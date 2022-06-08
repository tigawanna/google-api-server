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
const getToken_1 = require("./firebase/getToken");
const getToken2_1 = require("./firebase/getToken2");
const { createClient } = require('ioredis');
const startServer = async () => {
    dotenv_1.default.config();
    const port = process.env.PORT;
    const myemail = process.env.MY_EMAIL;
    const app = (0, express_1.default)();
    const client = createClient();
    client.on('error', (err) => console.log('Redis Client Error', err));
    app.set("view engine", "ejs");
    (0, firebaseInit_1.initFirebase)();
    app.get('/', async (req, res) => {
        const emal = req.query.email;
        const email = emal ? emal : myemail;
        const user = (0, getToken_1.getToken)(email);
        if (!user) {
            res.redirect('/auth/google');
        }
        else {
            res.send("authenticated");
        }
        console.log("user in database ", user);
    });
    app.get('/test', async (req, res) => {
        const token = (0, getToken2_1.getToken2)("denniskinuthiaw@gmail.com")
            .then((result) => {
            console.log("token promis returned in index === ", result);
        });
    });
    app.use('/auth', auth_1.default);
    app.use('/gmail', gmail_1.default);
    app.listen(port, () => {
        console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
    });
};
startServer().catch(e => console.log("error strating server======== ", e));
//# sourceMappingURL=index.js.map