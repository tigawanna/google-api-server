import express, { Request, Response } from 'express';
import { checkRefreshToken } from './../firebase/checkRefreshToken';
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

const scopes = [
  "https://www.googleapis.com/auth/userinfo.email",
   "https://www.googleapis.com/auth/calendar.events",
    "https://www.googleapis.com/auth/gmail.compose",
    "https://www.googleapis.com/auth/documents",
    "https://www.googleapis.com/auth/spreadsheets"
  ];
  
  const sendMail = async () => {
    try {
      // Create the email envelope (transport)
      const transport = nodemailer.createTransport({
        service: "gmail",
        auth: {
          type: "OAuth2",
          user: process.env.MY_EMAIL,
          clientId: process.env.CLIENT_ID,
          clientSecret: process.env.CLIENT_SECRET,
          accessToken:process.env.MY_EMAIL,
        },
      });
  
      // Create the email options and body
      // ('email': user's email and 'name': is the e-book the user wants to receive)
      const mailOptions = {
        from: `FRONT <${my_email}>`,
        to: "email2@gmail.com",
        subject: `[FRONT]- Here is your e-Book!`,
        html: `Enjoy learning!`,
      };
  
      // Set up the email options and delivering it
      const result = await transport.sendMail(mailOptions);
      console.log("success    === ", result);
      return result;
    } catch (error) {
      console.log("error sendng mail    === ", error);
      return error;
    }
  };


router.get('/', (req: Request, res: Response) => {
res.render("welcome");
    
});

//route to handle api client authentication
router.get("/send", async (req: Request, res: Response) => {

  checkRefreshToken({email:"denniskinuthiaw@gmail.com",res})
  res.render("welcome");


});

export default router
