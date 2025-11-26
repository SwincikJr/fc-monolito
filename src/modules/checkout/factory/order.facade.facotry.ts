import ClientAdmFacadeFactory from "../../client-adm/factory/client-adm.facade.factory";
import InvoiceFacadeFactory from "../../invoice/factory/invoice.facade.factory";
import PaymentFacadeFactory from "../../payment/factory/payment.facade.factory";
import ProductAdmFacadeFactory from "../../product-adm/factory/facade.factory";
import StoreCatalogFacadeFactory from "../../store-catalog/factory/facade.factory";
import OrderFacade from "../facade/order.facade";
import OrderReporitory from "../repository/order.repository";
import FindOrderUseCase from "../usecase/find-order/find-order.usecase";
import PlaceOrderUseCase from "../usecase/place-order/place-order.usecase";

export default class OrderFacadeFactory {
    static create() {
        const repository = new OrderReporitory();
        const placeOrderUseCase = new PlaceOrderUseCase(
            ClientAdmFacadeFactory.create(),
            ProductAdmFacadeFactory.create(),
            StoreCatalogFacadeFactory.create(),
            repository,
            InvoiceFacadeFactory.create(),
            PaymentFacadeFactory.create()
        );
        const findOrderUseCase = new FindOrderUseCase(repository);
        return new OrderFacade({
            placeOrderUseCase,
            findOrderUseCase
        });
    }
}