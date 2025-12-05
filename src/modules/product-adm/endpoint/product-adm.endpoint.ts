import { Application, Router } from "express";
import AddProductUseCase from "../usecase/add-product/add-product.usecase";
import ProductRepository from "../repository/product.repository";
import CheckStockUseCase from "../usecase/check-stock/check-stock.usecase";

export default function productAdmEndpoint(baseEndpoint: string, router: Router, app: Application) {
    const repository = new ProductRepository();
    const addUseCase = new AddProductUseCase(repository);
    const checkStockUseCase = new CheckStockUseCase(repository); 
    
    router.post("", async (req, res) => {
        try {
            const product = await addUseCase.execute(req.body);
            return res.status(201).json(product);
        } catch (error: any) {
            return res.status(500).send(error.message);
        }
    })

    router.get("/:id/stock", async (req, res) => {
        try {
            const product = await checkStockUseCase.execute({ productId: req.params.id });
            return res.status(200).json(product);
        } catch (error: any) {
            return res.status(500).send(error.message);
        }
    })

    app.use(baseEndpoint, router);
}