const admin = require("firebase-admin");
const { createClient } =require('ioredis');

export const getToken=async(email:string)=>{
const client = createClient();
client.on('error', (err:any) => console.log('Redis Client Error', err));  
    
try{
    const db = await admin.firestore();
    const usersCollection = db.collection('users');
    const user = await usersCollection.doc(email).get()
    console.log("token gotten ====== ",user.data());
     
    return user.data()
    }catch(err){
    console.log("error getting tokens  ==== ",err)    
     return undefined
    }

}
