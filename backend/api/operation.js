import { operationModel } from "../models/operation.js";
import userModel from '../models/user.js';

export default (app) => {
    app.post('/operations', async (req, res) => {
        const { userID } = req.session;
        const user = await userModel.findById(userID);
        if (!user) return res.status(200).send([]);
        const limit = req.body.recent? 5 : 0;

        let outgoingOperations = await operationModel.find({
            'sourceAccount.number': user.account.number,
        }).select("-sourceAccount").limit(limit) || [];
        outgoingOperations = outgoingOperations.map(operation => ({ 
            outgoing: true, 
            info: operation.transferInfo, 
            recipient: operation.targetAccount, 
            targetAccount: undefined 
        }));

        let incomingOperation = await operationModel.find({
            'targetAccount.number': user.account.number,
        }).select("-targetAccount").limit(limit) || [];
        incomingOperation = incomingOperation.map(operation => ({ 
            outgoing: false, 
            info: operation.transferInfo, 
            recipient: operation.sourceAccount, 
            sourceAccount: undefined 
        }));

        const operations = [...outgoingOperations, ...incomingOperation].map(operation => ({
            recipient: operation.recipient.name,
            title: operation.info.title,
            amount: operation.info.amount,
            date: operation.info.date,
            outgoing: operation.outgoing,
            balanceAfter: "1000.00",
        })).sort((a, b) => b.date - a.date);
        res.status(200).send(limit? operations.slice(0, 5) : operations);
    })

    app.post('/createOperation', async  (req, res) => {
        const newOperation = await operationModel.create(req.body);
        if (!newOperation) return res.status(400).send({ message: "Creation of Operation failed" });
        res.sendStatus(200);
    })
}