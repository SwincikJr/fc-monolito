import UseCaseInterface from "../../@shared/usecase/use-case.interface";
import { FindOrderFacadeInputDto, FindOrderFacadeOutputDto, OrderFacadeInterface, PlaceOrderFacadeInputDto, PlaceOrderFacadeOutputDto } from "./order.facade.interface";

export interface UseCaseProps {
    placeOrderUseCase: UseCaseInterface,
    findOrderUseCase: UseCaseInterface
}

export default class OrderFacade implements OrderFacadeInterface {
    private _placeOrderUseCase: UseCaseInterface;
    private _findOrderUseCase: UseCaseInterface;
    
    constructor(useCaseProps: UseCaseProps) {
        this._placeOrderUseCase = useCaseProps.placeOrderUseCase;
        this._findOrderUseCase = useCaseProps.findOrderUseCase;
    }

    async placeOrder(input: PlaceOrderFacadeInputDto): Promise<PlaceOrderFacadeOutputDto> {
        return await this._placeOrderUseCase.execute(input);
    }

    async findOrder(input: FindOrderFacadeInputDto): Promise<FindOrderFacadeOutputDto> {
        return await this._findOrderUseCase.execute(input);
    }
}