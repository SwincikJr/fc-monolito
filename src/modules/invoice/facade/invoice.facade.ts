import UseCaseInterface from "../../@shared/usecase/use-case.interface";
import { FindInvoiceFacadeInputDto, FindInvoiceFacadeOutputDto, GenerateInvoiceFacadeInputDto, InvoiceFacadeInterface } from "./invoice.facade.interface";

export interface UseCaseProps {
    findUseCase: UseCaseInterface;
    generateUseCase: UseCaseInterface;
}

export default class InvoiceFacade implements InvoiceFacadeInterface {
    private _findUseCase: UseCaseInterface;
    private _generateUseCase: UseCaseInterface;

    constructor(usecaseProps: UseCaseProps) {
        this._findUseCase = usecaseProps.findUseCase;
        this._generateUseCase = usecaseProps.generateUseCase;
    }

    async generate(input: GenerateInvoiceFacadeInputDto): Promise<void> {
        await this._generateUseCase.execute(input);
    }

    async find(input: FindInvoiceFacadeInputDto): Promise<FindInvoiceFacadeOutputDto> {
        return await this._findUseCase.execute(input);
    }
}