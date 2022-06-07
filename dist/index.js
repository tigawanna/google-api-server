"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const admin = require("firebase-admin");
const auth_1 = __importDefault(require("./routes/auth"));
const gmail_1 = __importDefault(require("./routes/gmail"));
const firebaseInit_1 = require("./firebase/firebaseInit");
const getToken_1 = require("./firebase/getToken");
const PORT = 4000;
const startServer = async () => {
    dotenv_1.default.config();
    const app = (0, express_1.default)();
    app.set("view engine", "ejs");
    const port = process.env.PORT ? process.env.PORT : PORT;
    (0, firebaseInit_1.initFirebase)();
    app.get('/', async (req, res) => {
        const emal = req.query.email;
        const email = emal ? emal : "youremail@gmail.com";
        const user = (0, getToken_1.getToken)(email);
        if (!user) {
            res.redirect('/auth/google');
        }
        else {
            res.send("authenticated");
        }
        console.log("user in database ", user);
    });
    app.use('/auth', auth_1.default);
    app.use('/gmail', gmail_1.default);
    app.listen(port, () => {
        console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
    });
};
startServer().catch(e => console.log("error strating server======== ", e));
//# sourceMappingURL=index.js.map