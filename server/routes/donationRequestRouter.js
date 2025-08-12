import express from 'express';

import { cancelRequest, createRequest, listRequests, myRequests, rejectRequest, sendAmount } from '../controllers/DonationRequestControllers.js';
import authPatient from '../middlewares/authPatient.js';
import authAdmin from '../middlewares/authAdmin.js';


const DonationRequestRouter = express.Router();

// Patient routes
DonationRequestRouter.post('/add', authPatient, createRequest);
DonationRequestRouter.get('/my-requests', authPatient, myRequests);

// Admin routes
DonationRequestRouter.get('/list', authAdmin, listRequests);
DonationRequestRouter.post('/reject', authAdmin, rejectRequest);
DonationRequestRouter.post('/send', authAdmin, sendAmount);
DonationRequestRouter.post('/cancel', authAdmin, cancelRequest);

export default DonationRequestRouter;
