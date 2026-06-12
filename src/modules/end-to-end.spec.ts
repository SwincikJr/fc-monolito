import { Sequelize } from "sequelize-typescript"
import express, { Express } from 'express'
import request from 'supertest'
import { migrator } from "../database/config-migrations/migrator"
import { Umzug } from "umzug"
import productAdmEndpoint from "./product-adm/endpoint/product-adm.endpoint"
import { ProductModel } from "./product-adm/repository/product.model"
import clientAdmEndpoint from "./client-adm/endpoint/client-adm.endpoint"
import { ClientModel } from "./client-adm/repository/client.model"
import checkoutEndpoint from "./checkout/endpoint/checkout.endpoint"
import { OrderModel } from "./checkout/repository/order.model"
import { OrderProductModel } from "./checkout/repository/order-product.model"
import TransactionModel from "./payment/repository/transaction.model"
import { InvoiceItemModel, InvoiceModel } from "./invoice/repository/invoice.model"
import CatalogModel from "./store-catalog/repository/product.model";
import invoiceEndpoint from "./invoice/endpoint/invoice.endpoint"


describe("Products tests", () => {

  const app: Express = express()
  app.use(express.json())
  productAdmEndpoint('/products', express.Router(), app)
  clientAdmEndpoint('/clients', express.Router(), app)
  checkoutEndpoint('/checkout', express.Router(), app)
  invoiceEndpoint('/invoice', express.Router(), app)

  let sequelize: Sequelize

  let migration: Umzug<any>;

  beforeAll(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ":memory:",
      logging: false
    })
    
    sequelize.addModels([
        ProductModel,
        ClientModel,
        OrderModel,
        OrderProductModel,
        TransactionModel,
        InvoiceModel,
        InvoiceItemModel,
        CatalogModel
    ])
    migration = migrator(sequelize)
    await migration.up()
  })

  afterAll(async () => {
    if (!migration || !sequelize) {
      return 
    }
    migration = migrator(sequelize)
    await migration.down()
    await sequelize.close()
  })

  it("Teste END to END", async () => {

    // 1 - ADMIN CADASTRA PRODUTO

    const product = await request(app).post("/products").send({
        name: "Produto 1",
        description: "descrição do produto 1",
        purchasePrice: 10,
        salesPrice: 200,
        stock: 50
    })

    expect(product.status).toBe(201);
    expect(product.body.id).toBeDefined()
    expect(product.body.name).toBe("Produto 1")
    expect(product.body.description).toBe("descrição do produto 1")
    expect(product.body.purchasePrice).toBe(10)
    expect(product.body.salesPrice).toBe(200)
    expect(product.body.stock).toBe(50)
    expect(product.body.createdAt).toBeDefined()
    expect(product.body.updatedAt).toBeDefined()

    // 2 - CLIENT SE CADASTRA NA LOJA VIRTUAL

    const client = await request(app).post("/clients").send({
        name: "Some Client",
        email: "someclient@email.com",
        document: "999",
        address: {
            street: "client street",
            number: "00",
            complement: "first floor",
            city: "client city",
            state: "client state",
            zipCode: "99999"
        }
    })

    expect(client.status).toBe(201)
    expect(client.body.id).toBeDefined()
    expect(client.body.name).toBe("Some Client")
    expect(client.body.email).toBe("someclient@email.com")
    expect(client.body.document).toBe("999")
    expect(product.body.createdAt).toBeDefined()
    expect(product.body.updatedAt).toBeDefined()
    expect(client.body.address).toEqual({
        street: "client street",
        number: "00",
        complement: "first floor",
        city: "client city",
        state: "client state",
        zipCode: "99999"
    })

    // 3 - CLIENTE FAZ CHECKOUT E FINALIZA UMA COMPRA
    
    const order = await request(app).post("/checkout").send({
        clientId: client.body.id,
        products: [
          {
            productId: product.body.id
          }
        ]
    })

    expect(order.status).toBe(201)
    expect(order.body.id).toBeDefined()
    expect(order.body.invoiceId).toBeDefined()
    expect(order.body.status).toBe('approved')
    expect(order.body.total).toBe(200)
    expect(order.body.products.length).toBe(1)
    expect(order.body.products[0].productId).toBe(product.body.id)

    // 4 - CLIENT CONSULTA SUA NOTA FISCAL

    const invoice = await request(app).get(`/invoice/${order.body.invoiceId}`).send();

    expect(invoice.status).toBe(200)
    expect(invoice.body.id).toBe(order.body.invoiceId)
    expect(invoice.body.name).toBe(client.body.name)
    expect(invoice.body.document).toBe(client.body.document)
    expect(invoice.body.address.street).toBe(client.body.address.street)
    expect(invoice.body.address.number).toBe(client.body.address.number)
    expect(invoice.body.address.complement).toBe(client.body.address.complement)
    expect(invoice.body.address.city).toBe(client.body.address.city)
    expect(invoice.body.address.state).toBe(client.body.address.state)
    expect(invoice.body.address.zipCode).toBe(client.body.address.zipCode)
    expect(invoice.body.items.length).toBe(1)
    expect(invoice.body.items[0].id).toBe(product.body.id)
    expect(invoice.body.items[0].name).toBe(product.body.name)
    expect(invoice.body.items[0].price).toBe(product.body.salesPrice)
    expect(invoice.body.total).toBe(200)
    expect(invoice.body.createdAt).toBeDefined()

  })
})