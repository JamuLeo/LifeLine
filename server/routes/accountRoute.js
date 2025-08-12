import express from 'express';
import authPatient from '../middlewares/authPatient.js';
import { addAccount, getAccount } from '../controllers/accountController.js';

const accountRouter = express.Router();

accountRouter.post('/add', authPatient, addAccount);
accountRouter.get('/get', authPatient, getAccount);

export default accountRouter;