
import apikey  from './apinodekey.json';
var admin = require("firebase-admin");




const initFirebase=async()=>{
  try{
    await admin.initializeApp({
      credential: admin.credential.cert(apikey),
       databaseURL: "https://fiebaseprojects-default-rtdb.firebaseio.com"
     });
  }catch(err){
   console.log("error initialozing firebase === ",err)
  }
  }



export{initFirebase}
