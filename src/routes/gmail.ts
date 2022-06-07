import express, { Request, Response } from 'express';
import { getToken } from '../firebase/getToken';
const { google } = require("googleapis");
const nodemailer = require("nodemailer");


const router = express.Router();
const my_email=process.env.MY_EMAIL


console.log("env vars email ==========   ",
process.env.MY_EMAIL
)

const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);




router.get('/', (req: Request, res: Response) => {
res.render("welcome");
    
});

//route to handle api client authentication
router.get("/send", async (req: Request, res: Response) => {
 const emal =req.query.email as string
  const email=emal?emal:process.env.MY_EMAIL as string
  const user = getToken(email)
  if(!user){
   res.redirect('/auth/google')   
  }else{
    user.then(async(res)=>{
    try{
     console.log("res === ",res)
      await oauth2Client.setCredentials({
        refresh_token:res.refresh_token
      }); 

      const myAccessToken = await oauth2Client.getAccessToken()
      console.log("my access token ====  ",myAccessToken.res.data.access_token)
      console.log("client envs ====   ",process.env.CLIENT_SECRET)

      // const transport = nodemailer.createTransport({
      //   service: "gmail",
      //   auth: {
      //     type: "OAuth2",
      //     user:res.email,
      //     clientId: process.env.CLIENT_ID,
      //     clientSecret: process.env.CLIENT_SECRET,
      //     accessToken:myAccessToken.res.data.access_token,
      //     refreshToken:res.refresh_token,
      //   },
      // });

      // const mailOptions = {
      //   from: `FRONT <${res.emaill}>`,
      //   to: "kinuthiawdennis@gmail.com",
      //   subject: `[FRONT]- Here is your e-Book!`,
      //   html: `Enjoy learning!`,
      // };
  
      // // Set up the email options and delivering it
      // const result = await transport.sendMail(mailOptions);
      // console.log("success    === ", result);

     }catch(err){
     console.log("send mail error ==== ",err)
     }

    })
 
  res.send("authenticated")
  }
 console.log("user in database ", user)


});

export default router
