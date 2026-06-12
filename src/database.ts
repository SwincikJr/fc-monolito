import { Sequelize } from "sequelize-typescript";
import { ProductModel } from "./modules/product-adm/repository/product.model";
import { ClientModel } from "./modules/client-adm/repository/client.model";
import { OrderModel } from "./modules/checkout/repository/order.model";
import { OrderProductModel } from "./modules/checkout/repository/order-product.model";
import TransactionModel from "./modules/payment/repository/transaction.model";
import { InvoiceItemModel, InvoiceModel } from "./modules/invoice/repository/invoice.model";
import CatalogModel from './modules/store-catalog/repository/product.model';

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite',
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

export default sequelize
