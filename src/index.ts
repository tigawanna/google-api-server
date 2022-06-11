import express, { Express, Request, Response} from 'express';
import dotenv from 'dotenv';
import auth from './routes/auth'
import api from './routes/api'
import { initFirebase } from './firebase/firebaseInit';
import { initChecks} from './middleware/initialChecks';
const { createClient } =require('ioredis');

   
const startServer=async()=>
{
    
    dotenv.config();
    const port = process.env.PORT;


    const app: Express = express();

    const client = createClient();
    client.on('error', (err:any) => console.log('Redis Client Error', err));

    app.set("view engine", "ejs");
    initFirebase()


    //home route , checks if user is authenticated
    app.get('/', initChecks,
    async(req: Request, res: Response)=>{
    const refreshtoken=req.query.refresh_token 
    const accesstoken=req.query.access_token
    const email=req.query.email
 // const auth2Client=req.query.oauthClient
    
    console.log('email ,ref , access', email,refreshtoken,accesstoken)
    res.send("good")
  });




    app.use('/auth',auth)
    app.use('/api',api)
    
    app.listen(port, () => {
      console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
    });
}
startServer().catch(e=>console.log("error strating server======== ",e))
