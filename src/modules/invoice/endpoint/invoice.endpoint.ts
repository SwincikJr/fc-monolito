import { Application, Router } from "express";
import FindInvoiceUseCase from "../usecase/find-invoice/find-invoice.usecase";
import InvoiceRepository from "../repository/invoice.repository";
import GenerateInvoiceUseCase from "../usecase/generate-invoice/generate-invoice.usecase";

export default function invoiceEndpoint(baseEndpoint: string, router: Router, app: Application) {
    const repository = new InvoiceRepository();
    const findUseCase = new FindInvoiceUseCase(repository);
    const generateUseCase = new GenerateInvoiceUseCase(repository);

    router.get("/:id", async (req, res) => {
        try {
            const invoice = await findUseCase.execute({ id: req.params.id });
            return res.status(200).json(invoice);
        } catch (error: any) {
            return res.status(500).send(error.message);
        }
    })

    router.post("", async (req, res) => {
        try {
            const invoice = await generateUseCase.execute(req.body);
            return res.status(201).json(invoice);
        } catch (error: any) {
            return res.status(500).send(error.message);
        }
    })

    app.use(baseEndpoint, router);
}