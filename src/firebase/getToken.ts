const admin = require("firebase-admin");

export const getToken=async(email:string)=>{
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
