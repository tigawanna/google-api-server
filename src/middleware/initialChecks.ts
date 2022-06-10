import {Request, Response,NextFunction } from 'express';
import { saveAccessToken, getAccessToken, getRefreshTokenFromRedis } 
from '../firebase/redisActions';
import { authenticate } from './authenticate';
;const {google} = require('googleapis');
var admin = require("firebase-admin");


//get a refresh token, check redis and firebase
const getatoken=async(email:string)=>{
try{
    const tokenInRedis = await getRefreshTokenFromRedis(email)
    if(tokenInRedis){
    console.log('found a token in redis',tokenInRedis);
    return tokenInRedis;
    }else{
    console.log('no token found in redis , checking in firebase .....');    
    const db = await admin.firestore();
    const usersCollection = db.collection('users1');
    const firebaseToken = await usersCollection.doc(email).get()
    console.log("from firebase Token ====  ",firebaseToken.data())
    return firebaseToken.data().refresh_token;
    }
}
catch(err){
    console.log("eroor getting any tokens",err);
    return undefined
}

}

export const  getOauthClient=async(rtkn:string)=>{
const oauth2Client = new google.auth.OAuth2(
        process.env.CLIENT_ID,
        process.env.CLIENT_SECRET,
        process.env.REDIRECT_URL
      );
   google.options({auth: oauth2Client});
   await oauth2Client.setCredentials({refresh_token:rtkn}); 
   return oauth2Client;
}

//use the refresh token toget an access token
const mintAccessToken=async(rtkn:string)=>{
 const myoauth2client=await getOauthClient(rtkn)
const myAccessToken = await myoauth2client.getAccessToken();
return myAccessToken;
}

//main middleware that will get a refresh an access token for every route tha uses it
export async function initChecks(req: Request, res: Response, next: NextFunction) {
   const mail = req.query.mail as string;
   const email=mail?mail:process.env.MY_EMAIL as string;
   const token = await getatoken(email)

   //if refresh token exist in redis or firebase
   if(token){
    const myoauth2client=await getOauthClient(token)
    const access_tok=await getAccessToken(token)

    if(!access_tok){
    const accessToken = await mintAccessToken(token)

    await saveAccessToken(token,accessToken.token)
    
    req.query.access_token=accessToken.token; 
    req.query.refresh_token=token;
    req.query.oauthClient=myoauth2client;
    req.query.email=email
    console.log('new access token ==== ',accessToken.token);
    }
    else{
    console.log('from redis access token ==== ',access_tok.token);    
    req.query.access_token=access_tok
    req.query.refresh_token=token
    req.query.oauthClient=myoauth2client;
    req.query.email=email
    }
 

   
   }
   else{

    console.log("no tokens found , mint new ones")
    const newToken= await authenticate()
    console.log("minted new tokens  ==== ",newToken)

    if(newToken){
    const retoken=newToken as string    
    const access_tok=await getAccessToken(retoken)
    const myoauth2client=await getOauthClient(retoken)

    if(!access_tok){
    const accessToken = await mintAccessToken(retoken)
    req.query.access_token=accessToken.token
    req.query.refresh_token=retoken
    req.query.oauthClient=myoauth2client;
    req.query.email=email

    await saveAccessToken(retoken,accessToken.token) 
    console.log('new access token ==== ',accessToken.retoken);
    }
    else{
    console.log('from redis access token ==== ',access_tok.retoken);    
    req.query.access_token=access_tok
    req.query.refresh_token=token
    req.query.oauthClient=myoauth2client;
    req.query.email=email
    }

    }
    else{
    console.log(`error autheniticating
     go revoke permision for our app in 
     your google settings and try again`)    

    return;

    }
   }
   
   console.log('middleware found a token ==== ',token);



   
    next();
}
