import Id from "../../../@shared/domain/value-object/id.value-object";
import Client from "../../domain/client.entity";
import Order from "../../domain/order.entity";
import Product from "../../domain/product.entity";
import OrderReporitory from "../../repository/order.repository"
import FindOrderUseCase from "./find-order.usecase";

jest.mock("../../repository/order.repository");

describe('Find Order Usecase test', () => {
    it("should not find order", async () => {
        jest.spyOn(OrderReporitory.prototype, "findOrder").mockResolvedValue(null);
        const usecase = new FindOrderUseCase(new OrderReporitory());
        await expect(usecase.execute).rejects.toThrow(new Error('Order not found'));
    })

    it("should return order", async () => {
        jest.spyOn(OrderReporitory.prototype, "findOrder").mockResolvedValue(new Order({
            id: new Id('o1'),
            client: new Client({
                id: new Id('c1'),
                name: 'dumb client',
                email: 'dumb email',
                address: 'dumb street'
            }),
            products: [new Product({
                id: new Id('p1'),
                name: 'dumb product',
                description: 'product description',
                salesPrice: 10
            })],
            status: "approved"
        }));
        const usecase = new FindOrderUseCase(new OrderReporitory());
        const order = await usecase.execute({ id: 'o1' });
        expect(order.id).toBe('o1');
        expect(order.client.id).toBe('c1');
        expect(order.client.name).toBe('dumb client');
        expect(order.client.email).toBe('dumb@email.com');
        expect(order.client.address).toBe('dumb street');
        expect(order.products[0].name).toBe('dumb product');
        expect(order.products[0].description).toBe('product description');
        expect(order.products[0].salesPrice).toBe(10);
    })
})