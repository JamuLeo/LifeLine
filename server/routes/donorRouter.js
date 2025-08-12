import express from 'express';
import { listDonors } from '../controllers/donorController.js';

const donorRouter = express.Router();
donorRouter.get('/list', listDonors);
// donorRouter.post('/add', addDonor);



export default donorRouter;
