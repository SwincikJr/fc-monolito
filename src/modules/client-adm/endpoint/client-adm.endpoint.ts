import { Application, Router } from "express";
import AddClientUseCase from "../usecase/add-client/add-client.usecase";
import ClientRepository from "../repository/client.repository";
import FindClientUseCase from "../usecase/find-client/find-client.usecase";

export default function clientAdmEndpoint(baseEndpoint: string, router: Router, app: Application) {
    const repository = new ClientRepository();
    const addUseCase = new AddClientUseCase(repository);
    const findUseCase = new FindClientUseCase(repository);

    router.post("", async (req, res) => {
        try {
            const client = await addUseCase.execute(req.body);
            return res.status(201).json(client);
        } catch(error: any) {
            return res.status(500).send(error.message);
        }
    })

    router.get("/:id", async (req, res) => {
        try {
            const client = await findUseCase.execute({ id: req.params.id });
            return res.status(200).json(client);
        } catch(error: any) {
            return res.status(500).send(error.message);
        }
    })

    app.use(baseEndpoint, router);
}