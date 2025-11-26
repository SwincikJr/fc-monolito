import Id from "../../@shared/domain/value-object/id.value-object";
import ClientAdmFacadeFactory from "../../client-adm/factory/client-adm.facade.factory";
import StoreCatalogFacadeFactory from "../../store-catalog/factory/facade.factory";
import Client from "../domain/client.entity";
import Order from "../domain/order.entity";
import Product from "../domain/product.entity";
import CheckoutGateway from "../gateway/checkout.gateway";
import { OrderProductModel } from "./order-product.model";
import { OrderModel } from "./order.model";

export default class OrderReporitory implements CheckoutGateway {
    async addOrder(order: Order): Promise<void> {
        await OrderModel.create({
            id: order.id.id,
            clientId: order.client.id.id,
            status: order.status,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt
        })

        await OrderProductModel.bulkCreate(order.products.map(p => ({
            orderId: order.id.id,
            productId: p.id.id,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt
        })))
    }

    async findOrder(id: string): Promise<Order | null> {
        const order = await OrderModel.findOne({ 
            where: { id },
            include: OrderProductModel
        });

        if (!order) return null;

        const client = await ClientAdmFacadeFactory.create().find({ id: order.clientId });
        const productFacade = StoreCatalogFacadeFactory.create();
        const products = await Promise.all(order.products.map(p => productFacade.find({ id: p.productId })));

        return new Order({
            client: new Client({
                id: new Id(client.id),
                name: client.name,
                email: client.email,
                address: client.address.street
            }),
            products: products.map(p => new Product({
                id: new Id(p.id),
                name: p.name,
                description: p.description,
                salesPrice: p.salesPrice
            })),
            status: order.status
        });
    }
}