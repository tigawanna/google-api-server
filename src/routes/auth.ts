import express, { Request, Response } from 'express';
import { saveRefreshToRedis } from '../firebase/tokenActions';
var admin = require("firebase-admin");
const { google } = require("googleapis");
const { createClient } =require('ioredis');

require('dotenv').config();
const router = express.Router();

const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URL
);

const scopes = [
  "https://www.googleapis.com/auth/userinfo.email",
   "https://www.googleapis.com/auth/calendar.events",
    "https://www.googleapis.com/auth/documents",
    "https://www.googleapis.com/auth/spreadsheets",
     "https://mail.google.com/"
  ];
  
router.get('/', (req: Request, res: Response) => {

res.render("welcome");

    
});


  

//route to check client authentication
router.get("/check", async (req: Request, res: Response) => {
  const db = admin.firestore();
  const email="denniskinuthiaw@gmail.com"

  const usersCollection = db.collection('users');
  const user = await usersCollection.doc(email).get();

  if(!user.data()){
   res.redirect('/auth/google')   
  }

});


//route to handle api client authentication
router.get("/google", async (req: Request, res: Response) => {
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
client.on('error', (err:any) => console.log('Redis Client Error', err));    
const code = req.query.code;
const db = admin.firestore();
try{

const { tokens } = await oauth2Client.getToken(code);
await oauth2Client.setCredentials(tokens)

var oauth2 = await google.oauth2({
  auth: oauth2Client,
  version: 'v2'
});

await oauth2.userinfo.get(
  function(err:any, res:any) {
    if (err) {
       console.log("error finding user ==== ",err);
    }else{
     const email=res.data.email
     const refresh_token = tokens?.refresh_token
      console.log("found user ==== ",res.data.email);
      console.log("refresh token retrieved ==== ",refresh_token)
      console.log("email exists ,saving .....")
      const usersCollection = db.collection('users');
    console.log("response token ==== ",tokens.refresh_token)
    if (tokens.refresh_token) {
          // store the refresh_token in my database!
          console.log("refresh token in response ,saving it")
          console.log(tokens.refresh_token);
          usersCollection.doc(email).set({ email, refresh_token }, { merge: true })
          .then((res:any)=>{console.log("success saving token to firebase",res)})
          .catch((err:any)=>{console.log("error saving token == ",err)}) 
          saveRefreshToRedis(email,tokens.refresh_token)
        }
        console.log("all tokens ==== ",tokens);
      }
});
}
catch(err){
  console.log("error in the creds block ==== ",err)
}

res.render("done");
});



export default router
