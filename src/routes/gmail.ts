import express, { Request, Response } from 'express';
import { getRefreshToken } from './../firebase/tokenActions';
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
  const token = getRefreshToken(email)
  console.log("user  in send==== user ",token)  
  token.then(async(resToken)=>{
    if(!resToken){
      res.redirect('/auth/google')   
    }

    try{
      console.log("res token=== ",resToken)
       await oauth2Client.setCredentials({
         refresh_token:resToken
       }); 
 
       const myAccessToken = await oauth2Client.getAccessToken()
       console.log("my access token ====  ",myAccessToken.res.data.access_token)
       console.log("my refresh token ====  ",resToken)
       console.log("client secret ====   ",process.env.CLIENT_SECRET)
       console.log("client id ====   ",process.env.CLIENT_SECRET)
       console.log("client email ====   ",email)
 
       const transport = await nodemailer.createTransport({
         service: "gmail",
         auth: {
           type: "OAuth2",
           user:email,
           clientId: process.env.CLIENT_ID,
           clientSecret: process.env.CLIENT_SECRET,
           accessToken:myAccessToken.res.data.access_token,
           refreshToken:resToken,
         },
       });
 
       const mailOptions = {
         from: `FRONT <${email}>`,
         to: "kinuthiawdennis@gmail.com",
         subject: `[FRONT]- Here is your e-Book!`,
         html: `Enjoy learning!`,
       };
   
       // Set up the email options and delivering it
       const result = await transport.sendMail(mailOptions);
       console.log("success    === ", result);
 
      }
      catch(err){
      console.log("send mail error ==== ",err)
      }

    }).catch(err=>{
      console.log("resToken error ==== ",err)
    })
   
  

     res.send("authenticated")
    })
 
 
  

export default router
