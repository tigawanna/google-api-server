const admin = require("firebase-admin");
const { createClient } =require('ioredis');


const client = createClient();
client.on('error', (err:any) => console.log('Redis Client Error', err));


export const saveAccessToken=async(refresh:string,access:string)=>{
try{
await client.set(refresh,access);
await client.expire(refresh,2300);
}
catch(err){
console.log("bad stuff happenned ",err)
}

}


export const getAccessToken=async(refresh:string,access:string)=>{

    try{
    if(client.exists(refresh)!==1){
    console.log("no access token")   
    return
    }   
    return await client.get(refresh,access);
    }
    catch(err){
    console.log("bad stuff happenned ",err)
    }
}


// export const getRefreshToken=async(email:string)=>{

//     try{
//      let theToken;
   
//      client.get(email,
//      async function(err:any, reply:any) {
//      console.log("reply is === ",reply)
//     if(!reply||err){
//      console.log("no redis copy of token ,going into firebase")    
//      //get it  it from firebase    
//      const db = await admin.firestore();
//      const usersCollection = db.collection('users');
//      await usersCollection.doc(email).get().then((user:any)=>{
//     if(user.data()?.refresh_token){
//         const refresh_token=user.data()?.refresh_token
//         console.log("refresh token from firebase",user.data().refresh_token)
//         //save it to redis
//         saveRefreshToRedis(email,refresh_token)
//         theToken=refresh_token 
//     }
//     })
//      theToken = undefined
//     }else{
//     console.log("token found in recis ==== ",reply); 
//     theToken=reply
//     }

//     });
       
//    return theToken  
//      }
//      catch(err){
//      console.log("bad stuff happenned ",err)
//      }
     
//      }


export const testFunction=async(email:string)=>{

}





export const getRefreshToken=async(email:string)=>{
 return await client.get(email);
}




export const saveRefreshToRedis=(email:string,refresh_token:string):any=>{
    client.exists(email, 
     function(err:any, reply:any) {
        if (reply === 1) {
         //delet any existig token witnthat key
            client.del(email, 
            function(err:any, reply:any) {
            console.log("checking if token exists in redis",reply,err); 
            // reset the token
            client.set(email,refresh_token , 
            function(err:any, reply:any) {
            console.log("updating token to redis",reply,err); // OK
                           });   
            });
            }
        else {
    console.log('Doesn\'t exist!');
    // set new token
    client.set(email,refresh_token, 
    function(err:any, reply:any) {
     console.log("savving new token to redis",reply,err);}); 
     }
    });
             
       }
       