const { createClient } =require('ioredis');


const client = createClient();
client.on('error', (err:any) => console.log('Redis Client Error', err));



//sav the acces token to redis , expires in 2,400 seconds
export const saveAccessToken=async(refresh:string,access:string)=>{
try{
await client.set(refresh,access);
await client.expire(refresh,2400);
}
catch(err){
console.log("bad stuff happenned ",err)
}

}


//retrieve access token from redis
export const getAccessToken=async(refresh:string)=>{
return await client.get(refresh);
}

//retrieve refresh token
export const getRefreshTokenFromRedis=async(email:string)=>{
 return await client.get(email);
}

//save refresh token to redis
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
       