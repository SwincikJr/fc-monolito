import { Sequelize } from "sequelize-typescript"
import { OrderProductModel } from "./order-product.model"
import { OrderModel } from "./order.model"
import Client from "../domain/client.entity"
import Product from "../domain/product.entity"
import Order from "../domain/order.entity"
import OrderReporitory from "./order.repository"
import ClientAdmFacade from "../../client-adm/facade/client-adm.facade"
import Address from "../../@shared/domain/value-object/address"
import StoreCatalogFacade from "../../store-catalog/facade/store-catalog.facade"

jest.mock("../../client-adm/facade/client-adm.facade")
jest.mock("../../store-catalog/facade/store-catalog.facade")

describe("Order Repository test", () => {
    let sequelize: Sequelize

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            logging: false,
            sync: { force: true }
        })

        sequelize.addModels([OrderModel, OrderProductModel])
        await sequelize.sync()
    })

    afterEach(async () => {
        await sequelize.close()
    })

    it("should create an order", async () => {
        const client = new Client({
            name: 'Dumb Client',
            email: 'Dumb Email',
            address: 'Dumb Avenue'
        });

        const product1 = new Product({
            name: 'Dumb Product 1',
            description: 'product 1 description',
            salesPrice: 10
        })

        const product2 = new Product({
            name: 'Dumb Product 2',
            description: 'product 2 description',
            salesPrice: 20
        })

        const order = new Order({
            client,
            products: [product1, product2]
        });

        const repository = new OrderReporitory()

        await repository.addOrder(order);

        const createdOrder =  await OrderModel.findOne({ where: { id: order.id.id } })

        const createdOrderProducts = await OrderProductModel.findAll({ where: { orderId: order.id.id } })

        expect(createdOrder.clientId).toBe(client.id.id);
        expect(createdOrder.status).toBe("pending");
        expect(createdOrderProducts[0].productId).toBe(product1.id.id);
        expect(createdOrderProducts[1].productId).toBe(product2.id.id);
    })

    it("should find and order", async () => {
        jest.spyOn(ClientAdmFacade.prototype, "find").mockResolvedValue({
            id: 'c1',
            name: 'dumb client',
            document: 'dumb',
            email: 'dumb@email.com',
            address: new Address(
                'dumb',
                'dumb',
                'dumb',
                'dumb',
                'dumb',
                'dumb'
            ),
            createdAt: new Date(),
            updatedAt: new Date()
        })

        jest.spyOn(StoreCatalogFacade.prototype, "find").mockResolvedValue({
            id: 'p1',
            name: 'dumb product',
            description: 'product description',
            salesPrice: 10
        })

        await OrderModel.create({
            id: 'o1',
            clientId: 'c1',
            status: "approved",
            createdAt: new Date(),
            updatedAt: new Date()
        })

        await OrderProductModel.create({
            orderId: 'o1',
            productId: 'p1',
            createdAt: new Date(),
            updatedAt: new Date()
        })

        const repository = new OrderReporitory();

        const order = await repository.findOrder('o1');

        expect(order.client.id.id).toBe('c1');
        expect(order.client.name).toBe('dumb client');
        expect(order.client.address).toBe('dumb');
        expect(order.products[0].name).toBe('dumb product');
        expect(order.products[0].description).toBe('product description');
        expect(order.products[0].salesPrice).toBe(10);
        expect(order.status).toBe("approved");
    })
})