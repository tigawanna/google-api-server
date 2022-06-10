import {Request, Response,NextFunction } from 'express';
import { getRefreshTokenFromRedis } from './../firebase/tokenActions';
import { authenticate } from './getTheToken';
var admin = require("firebase-admin");


const getatoken=async(email:string)=>{
try{
    const tokenInRedis = await getRefreshTokenFromRedis(email)
    if(!tokenInRedis){
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

export async function initChecks(req: Request, res: Response, next: NextFunction) {
   const mail = req.query.mail as string;
   const email=mail?mail:"denniskinuthiaw@gmail.com";
   const token = await getatoken(email)
   if(!token){
    console.log("no tokens found , mint new ones")
    const newToken= await authenticate()
    console.log("minted new tokens  ==== ",newToken)
   }

   console.log('middleware found a token ==== ',token);
    next();
}
