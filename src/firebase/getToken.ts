const admin = require("firebase-admin");
import { saveToRediis } from './saveToRedis';
const { createClient } =require('ioredis');

export const getToken=async(email:string)=>{
const client = createClient();
client.on('error', (err:any) => console.log('Redis Client Error', err));

let theUser={email:"",refresh_token:""};
client.exists(email, 
  async  function(err:any, reply:any) {
      if (reply === 1) {
        console.log("found token in redis "); 
        client.get(email, function(err:any, reply:any) {
            console.log("found refresh token in redis",reply); // ReactJS
        return reply
          }); 

      }else{
          try{
            console.log("no token in redis ,trying firebase");   
            const db = await admin.firestore();
            const usersCollection = db.collection('users');
            const user = await usersCollection.doc(email).get()
            if(!user.data()){
                
            }
            console.log("token gotten ====== ",user.data());
            const {refresh_token}=user.data()
            saveToRediis(email,refresh_token)
            return user.data()
            }catch(err){
            console.log("error getting tokens  ==== ",err)    
            }

      }
    });
    

return theUser
}
