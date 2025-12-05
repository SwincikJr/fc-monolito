import { Application, Router } from "express";
import ProcessPaymentUseCase from "../usecase/process-payment/process-payment.usecase";
import TransactionRepostiory from "../repository/transaction.repository";

export default function paymentEndpoint(baseEndpoint: string, router: Router, app: Application) {
    const repository = new TransactionRepostiory();
    const processUseCase = new ProcessPaymentUseCase(repository);

    router.post("", async (req, res) => {
        try {
            const payment = await processUseCase.execute(req.body);
            return res.status(200).json(payment);
        } catch(error: any) {
            return res.status(500).send(error.message);
        }
    })

    app.use(baseEndpoint, router);
}