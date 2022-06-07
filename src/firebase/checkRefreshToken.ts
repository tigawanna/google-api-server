const admin = require("firebase-admin");
import {Response } from 'express';

interface CheckRefreshParams{
    email:string
    res:Response
}



export const checkRefreshToken=async({email,res}:CheckRefreshParams)=>{
    const db = admin.firestore();
    const usersCollection = db.collection('users');
    const user = await usersCollection.doc(email).get();
    console.log("response == ",res)
    // if(!user.data()){
     res.redirect('/auth')   
    // }
        //  res.redirect('/auth/google')   
    console.log("user in database ", user.data())
}
