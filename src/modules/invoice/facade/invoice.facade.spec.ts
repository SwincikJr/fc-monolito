import { Sequelize } from "sequelize-typescript"
import { InvoiceItemModel, InvoiceModel } from "../repository/invoice.model"
import InvoiceRepository from "../repository/invoice.repository"
import GenerateInvoiceUseCase from "../usecase/generate-invoice/generate-invoice.usecase"
import InvoiceFacade from "./invoice.facade"
import InvoiceFacadeFactory from "../factory/invoice.facade.factory"

describe('Invoice Facade test', () => {
    let sequelize: Sequelize

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            logging: false,
            sync: { force: true }
        })

        sequelize.addModels([InvoiceItemModel, InvoiceModel])
        await sequelize.sync()
    })

    afterEach(async () => {
        await sequelize.close()
    })

    it('should create a invoice', async () => {
        const facade = InvoiceFacadeFactory.create()

        await facade.generate({
            id: 'i1',
            name: 'Invoice Test 1',
            document: '123mock',
            street: 'Dumb Avenue',
            number: '99A',
            complement: 'First Floor',
            city: 'Dumb City',
            state: 'Dumb State',
            zipCode: '99999999',
            items: [
                {
                    id: 'it1',
                    name: 'Dumb Product 1',
                    price: 10
                },
                {
                    id: 'it2',
                    name: 'Dumb Product 2',
                    price: 10
                }
            ]
        })

        const generated = await InvoiceModel.findOne({ where: { id: 'i1' }, include: InvoiceItemModel })

        expect(generated.name).toBe('Invoice Test 1')
        expect(generated.document).toBe('123mock')
        expect(generated.street).toBe('Dumb Avenue')
        expect(generated.number).toBe('99A')
        expect(generated.complement).toBe('First Floor')
        expect(generated.city).toBe('Dumb City')
        expect(generated.state).toBe('Dumb State')
        expect(generated.zipcode).toBe('99999999')
        expect(generated.items[0].id).toBe('it1')
        expect(generated.items[0].name).toBe('Dumb Product 1')
        expect(generated.items[0].price).toBe(10)
        expect(generated.items[1].id).toBe('it2')
        expect(generated.items[1].name).toBe('Dumb Product 2')
        expect(generated.items[1].price).toBe(10)
    })

    it('should find an invoice', async () => {
        const facade = InvoiceFacadeFactory.create();

        await facade.generate({
            id: 'i2',
            name: 'Invoice Test 2',
            document: '123mock',
            street: 'Dumb Avenue',
            number: '99A',
            complement: 'First Floor',
            city: 'Dumb City',
            state: 'Dumb State',
            zipCode: '99999999',
            items: [
                {
                    id: 'it3',
                    name: 'Dumb Product 1',
                    price: 10
                },
                {
                    id: 'it4',
                    name: 'Dumb Product 2',
                    price: 10
                }
            ]
        })

        const result = await facade.find({ id: 'i2' })

        expect(result.name).toBe('Invoice Test 2')
        expect(result.document).toBe('123mock')
        expect(result.address.street).toBe('Dumb Avenue')
        expect(result.address.number).toBe('99A')
        expect(result.address.complement).toBe('First Floor')
        expect(result.address.city).toBe('Dumb City')
        expect(result.address.state).toBe('Dumb State')
        expect(result.address.zipCode).toBe('99999999')
        expect(result.items[0].id).toBe('it3')
        expect(result.items[0].name).toBe('Dumb Product 1')
        expect(result.items[0].price).toBe(10)
        expect(result.items[1].id).toBe('it4')
        expect(result.items[1].name).toBe('Dumb Product 2')
        expect(result.items[1].price).toBe(10)
        expect(result.total).toBe(20)
    })
})