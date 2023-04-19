import definedTransferModel from "../models/definedTransfer.js";

export default (app) => {
    app.post('/definedTransfers', async (req, res) => {
        const { userID } = req.session;
        const transfers = await definedTransferModel.find({ owner: userID });
        res.status(200).send(transfers);
    })

    app.post('/createDefinedTransfer', async  (req, res) => {
        const { userID } = req.session;
        const { definedTransfer } = req.body;
        const newDefinedTransfer = await definedTransferModel.create({ ...definedTransfer, owner: userID });
        if (!newDefinedTransfer) return res.status(400).send({ message: "Creation of Defined Transfer failed" });
        res.sendStatus(200);
    })

    app.post('/deleteDefinedTransfer', async  (req, res) => {
        const { _id } = req.body;
        const success = await definedTransferModel.findByIdAndDelete(_id);
        if (!success) return res.status(400).send({ message: "Deletion of Defined Transfer failed" });
        res.sendStatus(200);
    })
}