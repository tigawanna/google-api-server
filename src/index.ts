import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import auth from './routes/auth'
import gmail from './routes/gmail'
import { initFirebase } from './firebase/firebaseInit';
import { getToken } from './firebase/getToken';
import { getToken2 } from './firebase/getToken2';
const { createClient } =require('ioredis');

   
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
    app.get('/', async(req: Request, res: Response) => {
      const emal =req.query.email as string
      const email=emal?emal:myemail as string
      const user = getToken(email)
      if(!user){
       res.redirect('/auth/google')   
      }else{
      res.send("authenticated")
      }
     console.log("user in database ", user)
    });

    //home route , checks if user is authenticated
    app.get('/test', async(req: Request, res: Response) => {
    
      const token=getToken2("denniskinuthiaw@gmail.com")
      .then((result)=>{
        console.log("token promis returned in index === ",result)
      })

 


    });


    app.use('/auth',auth)
    app.use('/gmail',gmail)
    
    app.listen(port, () => {
      console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
    });
}
startServer().catch(e=>console.log("error strating server======== ",e))
