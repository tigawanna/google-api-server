import express, { Express, Request, Response,NextFunction } from 'express';
import dotenv from 'dotenv';
import auth from './routes/auth'
import gmail from './routes/gmail'
import { initFirebase } from './firebase/firebaseInit';
import { getRefreshTokenFromRedis, testFunction } from './firebase/tokenActions';
import { getFire, saveFire } from './firebase/testFunctions';
import { authenticate, runSample, scopes} from './middleware/getTheToken';
const { createClient } =require('ioredis');
const admin = require("firebase-admin");
   
const startServer=async()=>
{
    
    dotenv.config();
    const port = process.env.PORT;
    const myemail = process.env.MY_EMAIL;

    const app: Express = express();

    const client = createClient();
    client.on('error', (err:any) => console.log('Redis Client Error', err));

    app.set("view engine", "ejs");
    initFirebase()


    //home route , checks if user is authenticated
 
app.get(
  "/",(req:Request,res:Response,next:NextFunction)=>{
      authenticate(scopes)
     .then(client =>{
        console.log("authenticated client   ===  ",client)
    
    })
    .catch(console.error);
  },
  (req:Request, res:Response) => {
    res.send(`<div>
    <h2>Welcome to GeeksforGeeks</h2>
    <h5>Tutorial on Middleware</h5>
  </div>`);
  }
);

    //home route , checks if user is authenticated
    app.get('/test', async(req: Request, res: Response) => {
      const email="denniskinuthiaw@gmail.com"
      try{
        const redtkn = await getRefreshTokenFromRedis("denniskinuthiaw@gmail.com")
        console.log("redis token === ",redtkn)
        if(!redtkn){
          console.log("no token in , get one in firebase ")
          const db = await admin.firestore();
          const usersCollection = db.collection('users');
          const fireToken=await usersCollection.doc(email).get()
          console.log("firetoken in index",fireToken.data())
          if(!fireToken.data()){
          res.redirect('/auth/google')
          }
        }
  
      }catch(err){
      console.log("redis token err n index=== ",err)
      }

    })


    app.use('/auth',auth)
    app.use('/gmail',gmail)
    
    app.listen(port, () => {
      console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
    });
}
startServer().catch(e=>console.log("error strating server======== ",e))
