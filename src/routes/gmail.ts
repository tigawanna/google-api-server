import express, { Request, Response } from 'express';
import { initChecks } from '../middleware/initialChecks';
const nodemailer = require("nodemailer");


const router = express.Router();



//gmail home route
router.get('/', (req: Request, res: Response) => {
res.render("welcome");
    
});


//route to handle api client authentication
router.get("/send",initChecks, async (req: Request, res: Response) => {
  const refreshtoken=req.query.refresh_token 
  const accesstoken=req.query.access_token
  const email=req.query.email
  // const auth2Client=req.query.oauthClient
  
  console.log("my personal client ,",email)

  const transport = await nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user:email,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      accessToken:accesstoken,
      refreshToken:refreshtoken,
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



res.send(result)

 
})
 
  

export default router
