import express from 'express';
import { addAddress, getAddress } from '../controllers/addressController.js';
import authPatient from '../middlewares/authPatient.js';

const addressRouter = express.Router();

addressRouter.post('/add', authPatient, addAddress);
addressRouter.get('/get', authPatient, getAddress);

export default addressRouter;
