import express from 'express';
import {
  createDonation,
  allDonations,
  userDonations,
  campaignDonations,
  donationsByDonor
} from '../controllers/donationController.js';

const donationRouter = express.Router();
donationRouter.post('/add', createDonation);
donationRouter.get('/all', allDonations);
donationRouter.get('/mine', userDonations); 
donationRouter.get('/campaign/:campaignId', campaignDonations);
donationRouter.get('/donor/:id', donationsByDonor);

export default donationRouter;
