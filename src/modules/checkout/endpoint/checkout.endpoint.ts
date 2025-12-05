import { Application, Router } from "express";
import PlaceOrderUseCase from "../usecase/place-order/place-order.usecase";
import ClientAdmFacadeFactory from "../../client-adm/factory/client-adm.facade.factory";
import ProductAdmFacadeFactory from "../../product-adm/factory/facade.factory";
import StoreCatalogFacadeFactory from "../../store-catalog/factory/facade.factory";
import InvoiceFacadeFactory from "../../invoice/factory/invoice.facade.factory";
import PaymentFacadeFactory from "../../payment/factory/payment.facade.factory";
import OrderReporitory from "../repository/order.repository";
import FindOrderUseCase from "../usecase/find-order/find-order.usecase";

export default function checkoutEndpoint(baseEndpoint: string, router: Router, app: Application) {
    const repository = new OrderReporitory();
    const placeOrderUseCase = new PlaceOrderUseCase(
        ClientAdmFacadeFactory.create(),
        ProductAdmFacadeFactory.create(),
        StoreCatalogFacadeFactory.create(),
        repository,
        InvoiceFacadeFactory.create(),
        PaymentFacadeFactory.create()
    )
    const findOrderUseCase = new FindOrderUseCase(repository);

    router.post("", async (req, res) => {
        try {
            const order = await placeOrderUseCase.execute(req.body);
            return res.status(201).json(order);
        } catch(error: any) {
            return res.status(500).send(error.message);
        }
    })

    router.get("/:id", async (req, res) => {
        try {
            const order = await findOrderUseCase.execute({ id: req.params.id });
            return res.status(200).json(order);
        } catch (error: any) {
            return res.status(500).send(error.message);
        }
    })

    app.use(baseEndpoint, router);
}