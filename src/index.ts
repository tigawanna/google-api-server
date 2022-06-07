import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
const admin = require("firebase-admin");
import auth from './routes/auth'
import gmail from './routes/gmail'
import { initFirebase } from './firebase/firebaseInit';
import { getToken } from './firebase/getToken';



const PORT=4000;    

const startServer=async()=>
{
    
    dotenv.config();
    
    const app: Express = express();
    app.set("view engine", "ejs");
    
    const port = process.env.PORT?process.env.PORT:PORT;
    initFirebase()

    app.get('/', async(req: Request, res: Response) => {
      const emal =req.query.email as string
      const email=emal?emal:"youremail@gmail.com"
      const user = getToken(email)
      if(!user){
       res.redirect('/auth/google')   
      }else{
      res.send("authenticated")
      }
     console.log("user in database ", user)
    });


    app.use('/auth',auth)
    app.use('/gmail',gmail)
    
    app.listen(port, () => {
      console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
    });
}
startServer().catch(e=>console.log("error strating server======== ",e))
