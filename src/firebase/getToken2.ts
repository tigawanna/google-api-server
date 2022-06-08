const admin = require("firebase-admin");
import { saveToRediis } from './saveToRedis';
const { createClient } =require('ioredis');

export const getToken2=async(email:string)=>{


const client = createClient();
client.on('error', (err:any) => console.log('Redis Client Error', err));

try{
let theToken;
//checke if token doesn't exist in redis
if(client.exists(email)!==1){
//get it  it from firebase    
const db = await admin.firestore();
const usersCollection = db.collection('users');
const user = await usersCollection.doc(email).get()

const {refresh_token}=user.data()
console.log("refresh token from firebase",user.data().refresh_token)
//save it to redis
saveToRediis(email,refresh_token)
theToken=refresh_token
}else{
//return token in redis    
theToken=await client.get(email);
}


return theToken
        
}catch(err){
console.log("bad stuff happenned ",err)
}

}
