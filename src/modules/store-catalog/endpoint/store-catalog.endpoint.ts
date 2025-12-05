import { Application, Router } from "express";
import ProductRepository from "../repository/product.repository";
import FindProductUseCase from "../usecase/find-product/find-product.usecase";
import FindAllProductsUsecase from "../usecase/find-all-products/find-all-products.usecase";

export default function storeCatalogEndpoint(baseEndpoint: string, router: Router, app: Application) {
    const repository = new ProductRepository();
    const findUseCase = new FindProductUseCase(repository);
    const findAllUseCase = new FindAllProductsUsecase(repository);

    router.get("/:id", async (req, res) => {
        try {
            const product = await findUseCase.execute({ id: req.params.id });
            return res.status(200).json(product);
        } catch (error: any) {
            return res.status(500).send(error.message)
        }
    })

    router.get("", async (req, res) => {
        try {
            const products = await findAllUseCase.execute();
            return res.status(200).send(products);
        } catch(error: any) {
            return res.status(500).send(error.message)
        }
    })

    app.use(baseEndpoint, router);
}