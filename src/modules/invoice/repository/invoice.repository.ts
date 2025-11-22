import Address from "../../@shared/domain/value-object/address";
import Id from "../../@shared/domain/value-object/id.value-object";
import { Invoice } from "../domain/invoice.entity";
import InvoiceGateway from "../gateway/invoice.gateway";
import { InvoiceItemModel, InvoiceModel } from "./invoice.model";

export default class InvoiceRepository implements InvoiceGateway {

    async add(invoice: Invoice): Promise<void> {
        const created = await InvoiceModel.create({
            id: invoice.id.id,
            name: invoice.name,
            document: invoice.document,
            street: invoice.address.street,
            number: invoice.address.number,
            complement: invoice.address.complement,
            city: invoice.address.city,
            state: invoice.address.state,
            zipcode: invoice.address.zipCode,
            createdAt: invoice.createdAt,
            updatedAt: invoice.updatedAt
        })

        await InvoiceItemModel.bulkCreate(invoice.items.map(i => ({
            id: i.id.id,
            invoice_id: created.id,
            name: i.name,
            price: i.price,
            createdAt: i.createdAt,
            updatedAt: i.updatedAt
        })))
    }

    async find(id: string): Promise<Invoice> {
        const invoice = await InvoiceModel.findOne({ where: { id }, include: InvoiceItemModel })

        if (!invoice) {
            throw new Error("Invoice not found")
        }

        return new Invoice({
            id: new Id(invoice.id),
            name: invoice.name,
            document: invoice.document,
            address: new Address(
                invoice.street,
                invoice.number,
                invoice.complement,
                invoice.city,
                invoice.state,
                invoice.zipcode,
            ),
            items: invoice.items.map(i => ({
                id: new Id(i.id),
                name: i.name,
                price: i.price
            })),
            createdAt: invoice.createdAt,
            updatedAt: invoice.createdAt
        })   
    }
}