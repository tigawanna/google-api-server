import  { Request, Response } from 'express';
import { saveRefreshToRedis } from '../firebase/tokenActions';
const http = require('http');
const url = require('url');
const opn = require('open');
const destroyer = require('server-destroy');
const admin = require("firebase-admin");

const {google} = require('googleapis');
const people = google.people('v1');


export const scopes = [
        "https://www.googleapis.com/auth/userinfo.email",
         "https://www.googleapis.com/auth/calendar.events",
          "https://www.googleapis.com/auth/documents",
          "https://www.googleapis.com/auth/spreadsheets",
           "https://mail.google.com/",
           
        ];    

 const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URL
  );
let refreshToken;
google.options({auth: oauth2Client});
  


export async function authenticate() {
  const db = admin.firestore();
    return new Promise((resolve, reject) => {
      // grab the url that will be used for authorization
      const authorizeUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes.join(' '),
      });

      const server = http
        .createServer(async (req:Request, res:Response) => {
          try {
            if (req.url.indexOf('/oauth2callback') > -1) {
              const qs = new url.URL(req.url, 'http://localhost:3000').searchParams;

              console.log("what tf is qs ==== ",qs)
              console.log("wtf is is in qs,getcode ===== ",qs.get('code'))

              res.end('Authentication successful! Please return to the console.');
              server.destroy();
              const {tokens} = await oauth2Client.getToken(qs.get('code'));

              
              console.log("tokens obtained ===== ",tokens)

              oauth2Client.credentials = tokens;
              
              const oauth2 = await google.oauth2({
                auth: oauth2Client,
                version: 'v2'
              })
              
              const refresh_token = tokens?.refresh_token
               refreshToken=refresh_token;
              await oauth2.userinfo.get(
                function(err:any, res:any) {
                  if (err) {
                     console.log("error finding user ==== ",err);
                  }else{
                   const email=res.data.email
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

              // eslint-disable-line require-atomic-updates
              resolve(refreshToken);
            }
          } catch (e) {
            reject(e);
          }
        })
        .listen(3000, () => {
          // open the browser to the authorize url to start the workflow
          opn(authorizeUrl, {wait: false}).then((cp:any) => cp.unref());
        });
      destroyer(server);
    });
  }

 export  async function runSample() {
    // retrieve user profile
    const res = await people.people.get({
      resourceName: 'people/me',
      personFields: 'emailAddresses',
    });
    console.log("people gotten ====",res.data);
  }  



