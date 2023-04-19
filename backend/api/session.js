import userModel from '../models/user.js';

export default (app) => {
    app.post('/login', async (req, res) => {
        const { login, password } = req.body
        const user = await userModel.findOne({ login });
        if (!user) return res.status(400).send('User not found')
        if (user.password !== password) return res.status(400).send('Wrong data')
        
        req.session.userID = user._id;
        res.status(200).send(user)
    })

    app.post('/logout', async (req, res) => {
        if (!req.session) return res.sendStatus(401);
        if (!req.session.userID) return res.sendStatus(401);
        req.session.destroy();
        res.status(200);
    })
}