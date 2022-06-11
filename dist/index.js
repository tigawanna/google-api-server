"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_1 = __importDefault(require("./routes/auth"));
const api_1 = __importDefault(require("./routes/api"));
const firebaseInit_1 = require("./firebase/firebaseInit");
const initialChecks_1 = require("./middleware/initialChecks");
const { createClient } = require('ioredis');
const startServer = async () => {
    dotenv_1.default.config();
    const port = process.env.PORT;
    const app = (0, express_1.default)();
    const client = createClient();
    client.on('error', (err) => console.log('Redis Client Error', err));
    app.set("view engine", "ejs");
    (0, firebaseInit_1.initFirebase)();
    app.get('/', initialChecks_1.initChecks, async (req, res) => {
        const refreshtoken = req.query.refresh_token;
        const accesstoken = req.query.access_token;
        const email = req.query.email;
        console.log('email ,ref , access', email, refreshtoken, accesstoken);
        res.send("good");
    });
    app.use('/auth', auth_1.default);
    app.use('/api', api_1.default);
    app.listen(port, () => {
        console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
    });
};
startServer().catch(e => console.log("error strating server======== ", e));
//# sourceMappingURL=index.js.map