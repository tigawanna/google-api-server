"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const saveToRedis_1 = require("./../firebase/saveToRedis");
const getToken_1 = require("../firebase/getToken");
var admin = require("firebase-admin");
const { google } = require("googleapis");
const { createClient } = require('ioredis');
require('dotenv').config();
const router = express_1.default.Router();
const oauth2Client = new google.auth.OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.REDIRECT_URL);
const scopes = [
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/calendar.events",
    "https://www.googleapis.com/auth/gmail.compose",
    "https://www.googleapis.com/auth/documents",
    "https://www.googleapis.com/auth/spreadsheets"
];
router.get('/', (req, res) => {
    res.render("welcome");
    (0, getToken_1.getToken)("denniskinuthiaw@gmail.com");
});
router.get("/check", async (req, res) => {
    const db = admin.firestore();
    const email = "denniskinuthiaw@gmail.com";
    const usersCollection = db.collection('users');
    const user = await usersCollection.doc(email).get();
    if (!user.data()) {
        res.redirect('/auth/google');
    }
});
router.get("/google", async (req, res) => {
    const url = oauth2Client.generateAuthUrl({
        access_type: "offline",
        scope: scopes,
    });
    console.log("url returned ======= ", url);
    if (url) {
        res.render("authorize", { url: url });
    }
});
router.get("/creds", async (req, res) => {
    const client = createClient();
    client.on('error', (err) => console.log('Redis Client Error', err));
    const code = req.query.code;
    const db = admin.firestore();
    try {
        const { tokens } = await oauth2Client.getToken(code);
        await oauth2Client.setCredentials(tokens);
        var oauth2 = await google.oauth2({
            auth: oauth2Client,
            version: 'v2'
        });
        await oauth2.userinfo.get(function (err, res) {
            if (err) {
                console.log("error finding user ==== ", err);
            }
            else {
                const email = res.data.email;
                const refresh_token = tokens === null || tokens === void 0 ? void 0 : tokens.refresh_token;
                console.log("found user ==== ", res.data.email);
                console.log("refresh token retrieved ==== ", refresh_token);
                console.log("email exists ,saving .....");
                const usersCollection = db.collection('users');
                if (tokens.refresh_token) {
                    console.log(tokens.refresh_token);
                    usersCollection.doc(email).set({ email, refresh_token }, { merge: true })
                        .then((res) => { console.log("success saving token to firebase", res); })
                        .catch((err) => { console.log("error saving token == ", err); });
                    (0, saveToRedis_1.saveToRediis)(email, tokens.refresh_token);
                }
                console.log("all tokens ==== ", tokens);
            }
        });
    }
    catch (err) {
        console.log("error in the creds block ==== ", err);
    }
    res.render("done");
});
exports.default = router;
//# sourceMappingURL=auth.js.map