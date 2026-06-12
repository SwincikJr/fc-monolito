import sequelize from './database';
import express from 'express';
import productAdmEndpoint from './modules/product-adm/endpoint/product-adm.endpoint';
import clientAdmEndpoint from './modules/client-adm/endpoint/client-adm.endpoint';
import checkoutEndpoint from './modules/checkout/endpoint/checkout.endpoint';
import invoiceEndpoint from './modules/invoice/endpoint/invoice.endpoint';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';

const app = express()
app.use(express.json())

productAdmEndpoint('/products', express.Router(), app)
clientAdmEndpoint('/clients', express.Router(), app)
checkoutEndpoint('/checkout', express.Router(), app)
invoiceEndpoint('/invoice', express.Router(), app)

const swaggerDocument = YAML.load(path.resolve(__dirname, './swagger/api.yml'));
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use((_, res, __) => res.status(400).send({ message: 'service not found!' }))

const shutodown = async () => { 
    await sequelize.close() 
    return process.exit(1)
}

process.on('SIGTERM', shutodown)
process.on('SIGINT', shutodown)

app.listen(3000, () => {
    console.log(`Server now is listening on http://localhost:3000`)
    console.log(`Swagger can be found on http://localhost:3000/swagger`)
})
