import UseCaseInterface from "../../../@shared/usecase/use-case.interface";
import CheckoutGateway from "../../gateway/checkout.gateway";
import { FindOrderInputDto, FindOrderOutputDto } from "./find-order.usecase.dto";

export default class FindOrderUseCase implements UseCaseInterface {
    private _repository: CheckoutGateway;

    constructor(repository: CheckoutGateway) {
        this._repository = repository;
    }
    
    async execute(input: FindOrderInputDto): Promise<FindOrderOutputDto> {
        const order = await this._repository.findOrder(input.id);
        if (!order) throw new Error('Order not found');
        return {
            id: order.id.id,
            client: {
                id: order.client.id.id,
                name: order.client.name,
                email: order.client.email,
                address: order.client.address
            },
            status: order.status,
            products: order.products,
            total: order.products.reduce((total, product) => total + product.salesPrice, 0)
        }   
    }
}