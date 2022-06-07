
import apikey  from './apinodekey.json';
var admin = require("firebase-admin");


const dbUrl = process.env.DBURL
const initFirebase=async()=>{
  try{
    await admin.initializeApp({
      credential: admin.credential.cert(apikey),
       databaseURL:dbUrl
     });
  }catch(err){
   console.log("error initialozing firebase === ",err)
  }
}



export{initFirebase}
