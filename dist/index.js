"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_1 = __importDefault(require("./routes/auth"));
const gmail_1 = __importDefault(require("./routes/gmail"));
const firebaseInit_1 = require("./firebase/firebaseInit");
const tokenActions_1 = require("./firebase/tokenActions");
const getTheToken_1 = require("./middleware/getTheToken");
const { createClient } = require('ioredis');
const admin = require("firebase-admin");
const startServer = async () => {
    dotenv_1.default.config();
    const port = process.env.PORT;
    const myemail = process.env.MY_EMAIL;
    const app = (0, express_1.default)();
    const client = createClient();
    client.on('error', (err) => console.log('Redis Client Error', err));
    app.set("view engine", "ejs");
    (0, firebaseInit_1.initFirebase)();
    app.get("/", (req, res, next) => {
        (0, getTheToken_1.authenticate)(getTheToken_1.scopes)
            .then(client => {
            console.log("authenticated client   ===  ", client);
        })
            .catch(console.error);
    }, (req, res) => {
        res.send(`<div>
    <h2>Welcome to GeeksforGeeks</h2>
    <h5>Tutorial on Middleware</h5>
  </div>`);
    });
    app.get('/test', async (req, res) => {
        const email = "denniskinuthiaw@gmail.com";
        try {
            const redtkn = await (0, tokenActions_1.getRefreshTokenFromRedis)("denniskinuthiaw@gmail.com");
            console.log("redis token === ", redtkn);
            if (!redtkn) {
                console.log("no token in , get one in firebase ");
                const db = await admin.firestore();
                const usersCollection = db.collection('users');
                const fireToken = await usersCollection.doc(email).get();
                console.log("firetoken in index", fireToken.data());
                if (!fireToken.data()) {
                    res.redirect('/auth/google');
                }
            }
        }
        catch (err) {
            console.log("redis token err n index=== ", err);
        }
    });
    app.use('/auth', auth_1.default);
    app.use('/gmail', gmail_1.default);
    app.listen(port, () => {
        console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
    });
};
startServer().catch(e => console.log("error strating server======== ", e));
//# sourceMappingURL=index.js.map