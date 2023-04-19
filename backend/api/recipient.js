import { recipientModel, recipientGroupModel } from "../models/recipient.js";

export default (app) => {
    app.post('/recipients', async (req, res) => {
        const { userID } = req.session;
        const recipients = await recipientModel.find({ owner: userID }) || []
        res.status(200).send(recipients)
    })

    app.post('/createRecipient', async (req, res) => {
        const { userID } = req.session;
        const { recipient } = req.body;
        const alreadyExists = await recipientModel.findOne({ name: recipient.name, owner: userID });
        if (alreadyExists) return res.status(400).send({ message: "Recipient with that name already exists" });
        const newRecipient = await recipientModel.create({ ...recipient, owner: userID });
        if (!newRecipient) return res.status(400).send({ message: "Creation of Recipient failed" });
        res.sendStatus(200);
    })

    app.post('/deleteRecipient', async (req, res) => {
        const { userID } = req.session;
        const success = await recipientModel.findByIdAndDelete(userID);
        if (!success) return res.status(400).send({ message: "Deletion of Recipient failed" });
        res.sendStatus(200);
    })

    app.post('/recipientGroups', async (req, res) => {
        const { userID } = req.session;
        const groups = await recipientGroupModel.find({ owner: userID }, {
            owner: 0,
            __v: 0,
        }) || [];
        res.status(200).send(groups)
    })

    app.post('/createRecipientGroup', async (req, res) => {
        const { userID } = req.session;
        const { name } = req.body;
        const alreadyExists = await recipientGroupModel.findOne({ name, owner: userID });
        if (alreadyExists) return res.status(400).send({ message: "Recipient Group with that name already exists" });
        const newRecipientGroup = await recipientGroupModel.create({ name, owner: userID });
        if (!newRecipientGroup) return res.status(400).send({ message: "Creation of Recipient Group failed" });
        res.sendStatus(200);
    })

    app.post('/updateRecipientGroup', async (req, res) => {
        const { _id, name } = req.body;
        const success = await recipientGroupModel.findOneAndUpdate({ _id }, { name });
        if (!success) return res.status(400).send({ message: "Updating of Recipient Group failed" });
        res.sendStatus(200);
    })

    app.post('/deleteRecipientGroup', async (req, res) => {
        const { userID } = req.session;
        const { _id } = req.body;
        const recipientGroup = await recipientGroupModel.findOne({ _id , owner: userID });
        if (!recipientGroup) return res.status(400).send({ message: "Couldnt find Recipient Group" });
        await recipientGroup.remove();
        res.sendStatus(200);
    })
}