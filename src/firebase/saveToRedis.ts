const { createClient } =require('ioredis');

export const saveToRediis=(email:string,refresh_token:string)=>{
 const client = createClient();
 client.on('error', (err:any) => console.log('Redis Client Error', err));  

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
          } else {
          console.log('Doesn\'t exist!');
          // set new token
          client.set(email,refresh_token, 
          function(err:any, reply:any) {
            console.log("savving new token to redis",reply,err);}); 
          }
        });
}
