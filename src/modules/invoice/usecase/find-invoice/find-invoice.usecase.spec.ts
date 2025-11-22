import Address from "../../../@shared/domain/value-object/address"
import Id from "../../../@shared/domain/value-object/id.value-object"
import { Invoice } from "../../domain/invoice.entity"
import FindInvoiceUseCase from "./find-invoice.usecase"

const invoice = new Invoice({
  id: new Id("1"),
  name: "Lucian",
  document: "1234-5678",
  address: new Address(
    "Rua 123",
    "99",
    "Casa Verde",
    "Criciúma",
    "SC",
    "88888-888",
  ),
  items: [
    {
      id: new Id('i1'),
      name: 'Produto 1',
      price: 10
    }
  ]
})

const MockRepository = () => {

  return {
    add: jest.fn(),
    find: jest.fn().mockReturnValue(Promise.resolve(invoice))
  }
}

describe("Find Client use case unit test", () => {

  it("should find a client", async () => {

    const repository = MockRepository()
    const usecase = new FindInvoiceUseCase(repository)

    const input = {
      id: "1"
    }

    const result = await usecase.execute(input)

    expect(repository.find).toHaveBeenCalled()
    expect(result.id).toEqual(input.id)
    expect(result.name).toEqual(invoice.name)
    expect(result.document).toEqual(invoice.document)
    expect(result.address.street).toBe(invoice.address.street)
    expect(result.address.number).toBe(invoice.address.number)
    expect(result.address.complement).toBe(invoice.address.complement)
    expect(result.address.city).toBe(invoice.address.city)
    expect(result.address.state).toBe(invoice.address.state)
    expect(result.address.zipCode).toBe(invoice.address.zipCode)
    expect(result.items[0].name).toEqual(invoice.items[0].name)
    expect(result.items[0].price).toEqual(invoice.items[0].price)
    expect(result.createdAt).toEqual(invoice.createdAt)
  })
})
