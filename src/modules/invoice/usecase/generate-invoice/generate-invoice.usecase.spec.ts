import GenerateInvoiceUseCase from "./generate-invoice.usecase"

const MockRepository = () => {
  return {

    add: jest.fn(),
    find: jest.fn()
  }
}

describe("Add Client use case unit test", () => {

  it("should add a client", async () => {

    const repository = MockRepository()
    const usecase = new GenerateInvoiceUseCase(repository)

    const input = {
        name: 'Invoice 1',
        document: '123dumb',
        street: 'Dumb Street',
        number: '99',
        complement: 'Dumb Floor',
        city: 'Dumb City',
        state: 'Dumb State',
        zipCode: '99999999',
        items: [
            {
                name: 'Product 1',
                price: 99
            }
        ]
    }

    const result = await usecase.execute(input)

    expect(repository.add).toHaveBeenCalled()
    expect(result.id).toBeDefined()
    expect(result.name).toEqual(input.name)
    expect(result.document).toEqual(input.document)
    expect(result.street).toEqual(input.street)
    expect(result.number).toEqual(input.number)
    expect(result.complement).toEqual(input.complement)
    expect(result.city).toEqual(input.city)
    expect(result.state).toEqual(input.state)
    expect(result.zipCode).toEqual(input.zipCode)
    expect(result.items[0].id).toBeDefined()
    expect(result.items[0].name).toEqual(input.items[0].name)
    expect(result.items[0].price).toEqual(input.items[0].price)

  })
})