import express, { Request, Response } from 'express';
require('dotenv').config();

const router = express.Router();


  
router.get('/', (req: Request, res: Response) => {
res.render("welcome");
});


export default router
