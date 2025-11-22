import { Sequelize } from "sequelize-typescript"
import { InvoiceItemModel, InvoiceModel } from "./invoice.model"
import InvoiceRepository from "./invoice.repository"
import { Invoice } from "../domain/invoice.entity"
import Id from "../../@shared/domain/value-object/id.value-object"
import Address from "../../@shared/domain/value-object/address"

describe('Invoice Repository test', () => {
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

    it('should add an invoice', async () => {
        const repository = new InvoiceRepository();

        await repository.add(new Invoice({
            id: new Id('i1'),
            name: 'Invoice 1',
            document: '123dumb',
            address: new Address(
                'Dumb Avenue',
                '99',
                'Dumb Floor',
                'Dumb City',
                'Dumb State',
                '99999999'
            ),
            items: [
                {
                    id: new Id('it1'),
                    name: 'Dumb Product 1',
                    price: 10
                },
                {
                    id: new Id('it2'),
                    name: 'Dumb Product 2',
                    price: 20
                }
            ]
        }))

        const created = await InvoiceModel.findOne({ where: { id: 'i1' }, include: InvoiceItemModel })

        expect(created.name).toBe('Invoice 1')
        expect(created.document).toBe('123dumb')
        expect(created.street).toBe('Dumb Avenue')
        expect(created.number).toBe('99')
        expect(created.complement).toBe('Dumb Floor')
        expect(created.city).toBe('Dumb City')
        expect(created.state).toBe('Dumb State')
        expect(created.zipcode).toBe('99999999')
        expect(created.items[0].id).toBe('it1')
        expect(created.items[0].name).toBe('Dumb Product 1')
        expect(created.items[0].price).toBe(10)
        expect(created.items[1].id).toBe('it2')
        expect(created.items[1].name).toBe('Dumb Product 2')
        expect(created.items[1].price).toBe(20)
    })

    it('should find an invoice', async () => {
        const repository = new InvoiceRepository()
        
        await repository.add(new Invoice({
            id: new Id('i2'),
            name: 'Invoice 2',
            document: '123dumb',
            address: new Address(
                'Dumb Avenue',
                '99',
                'Dumb Floor',
                'Dumb City',
                'Dumb State',
                '99999999'
            ),
            items: [
                {
                    id: new Id('it3'),
                    name: 'Dumb Product 3',
                    price: 30
                },
                {
                    id: new Id('it4'),
                    name: 'Dumb Product 4',
                    price: 40
                }
            ]
        }))

        const found = await repository.find('i2')

        expect(found.name).toBe('Invoice 2')
        expect(found.document).toBe('123dumb')
        expect(found.address.street).toBe('Dumb Avenue')
        expect(found.address.number).toBe('99')
        expect(found.address.complement).toBe('Dumb Floor')
        expect(found.address.city).toBe('Dumb City')
        expect(found.address.state).toBe('Dumb State')
        expect(found.address.zipCode).toBe('99999999')
        expect(found.items[0].id.id).toBe('it3')
        expect(found.items[0].name).toBe('Dumb Product 3')
        expect(found.items[0].price).toBe(30)
        expect(found.items[1].id.id).toBe('it4')
        expect(found.items[1].name).toBe('Dumb Product 4')
        expect(found.items[1].price).toBe(40)
    })
})