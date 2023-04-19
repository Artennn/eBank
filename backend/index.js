import mongosee from 'mongoose';
import express from 'express'
import cors from 'cors'
import session from 'express-session'

import userAPI from './api/session.js';
import operationAPI from "./api/operation.js";
import definedTransferAPI from './api/definedTransfer.js';
import recipientGroupAPI from './api/recipient.js';

import 'dotenv/config'
const { API_PORT, DATABASE_URI } = process.env

const app = express()
app.use(express.json())
app.use(cors({ 
    credentials: true, 
    origin: true, 
}))
app.use(session({
    secret: 'some secret',
    resave: false,
    saveUninitialized: true,
    rolling: true,
    cookie: {
        maxAge: 15 * 60 * 1000, // 15min
    }
}))

app.listen(API_PORT | 3001, () => {
    console.log(`Listening on ${API_PORT | 3001}`);

    userAPI(app);
    operationAPI(app);
    definedTransferAPI(app);
    recipientGroupAPI(app);
})

app.use((req, res, next) => {
    const url = req.originalUrl;
    if (url === "/login") return next();

    if (!req.session) return res.sendStatus(401);
    if (!req.session.userID) return res.sendStatus(401);

    //const { userID } = req.session;
    //const { expires, maxAge } = req.session.cookie
    //console.log(`Session ${userID} ${maxAge} ${expires}`);
    next();
})

mongosee.connect(DATABASE_URI).then(
    () => { console.log("Connected to MongoDB Cluster")},
    (err) => { console.log("Error while connecting to MongoDB: ", err.message)}
)
