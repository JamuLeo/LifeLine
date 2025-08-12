import cookieParser from 'cookie-parser';
import express from'express';
import cors from 'cors';
import connectDB from './configs/db.js';
import 'dotenv/config';
import connectCloudinary from './configs/cloudinary.js';
import { clerkMiddleware } from '@clerk/express'
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js"
import patientRouter from './routes/patientRouter.js';
import addressRouter from './routes/addressRoute.js';
import accountRouter from './routes/accountRoute.js';
import campaignRouter from './routes/campaignRoutes.js';
import adminRouter from './routes/adminRoutes.js';
import donationRouter from './routes/donationRouter.js';
import donorRouter from './routes/donorRouter.js';
import adminStatsRouter from './routes/adminStatsRouter.js';
import DonationRequestRouter from './routes/DonationRequestRouter.js';
import sendedAmountRouter from './routes/sendedAmountRouter.js';
import favouriteRoute from './routes/favouriteRoute.js';
import contactRequestRoute from './routes/contactRequestRoute.js';




const app = express();
const port = process.env.PORT || 4000;

await connectDB()
await connectCloudinary()

// Allow multiple orgins
const allowedOrigins = ['http://localhost:5173']

// Middleware configuration
app.use(express.json());
app.use(cookieParser());
app.use(cors({origin: allowedOrigins, credentials: true}));
app.use(clerkMiddleware())


app.get('/',(req, res) => res.send("API is Working"));
app.use('/api/inngest', serve({ client: inngest, functions }))
app.use('/api/contact-request', contactRequestRoute);
app.use('/api/favourite', favouriteRoute);
app.use('/api/patient', patientRouter)
app.use('/api/address', addressRouter)
app.use('/api/account', accountRouter)
app.use('/api/campaign', campaignRouter)
app.use('/api/donation', donationRouter)
app.use('/api/donation-request', DonationRequestRouter);
app.use('/api/sended-amount',sendedAmountRouter);
app.use('/api/donor', donorRouter)
app.use('/api/admin', adminRouter)
app.use('/api/admin', adminStatsRouter);



app.listen(port, ()=>{
    console.log(`server is running on http://localhost:${port}`)
})