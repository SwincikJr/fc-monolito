import Address from "../../../@shared/domain/value-object/address";
import Id from "../../../@shared/domain/value-object/id.value-object";
import { Invoice } from "../../domain/invoice.entity";
import InvoiceGateway from "../../gateway/invoice.gateway";
import { GenerateInvoiceUseCaseInputDto, GenerateInvoiceUseCaseOutputDto } from "./generate-invoice.usecase.dto";

export default class GenerateInvoiceUseCase {
    private _invoiceRepository: InvoiceGateway

    constructor(invoiceRepository: InvoiceGateway) {
        this._invoiceRepository = invoiceRepository
    }

    async execute(input: GenerateInvoiceUseCaseInputDto): Promise<GenerateInvoiceUseCaseOutputDto> {        
        const invoice = new Invoice({
            id: new Id(input.id),
            name: input.name,
            document: input.document,
            address: new Address(
                input.street,
                input.number,
                input.complement,
                input.city,
                input.state,
                input.zipCode
            ),
            items: input.items.map(i => ({
                id: new Id(i.id) || new Id(),
                name: i.name,
                price: i.price
            }))        
        })

        await this._invoiceRepository.add(invoice)

        return {
            id: invoice.id.id,
            name: invoice.name,
            document: invoice.document,
            street: invoice.address.street,
            number: invoice.address.number,
            complement: invoice.address.complement,
            city: invoice.address.city,
            state: invoice.address.state,
            zipCode: invoice.address.zipCode,
            items: invoice.items.map(i => ({
                id: i.id.id,
                name: i.name,
                price: i.price
            })),
            total: invoice.items.reduce((prev, curr) => prev + curr.price, 0)
        }
    }
}