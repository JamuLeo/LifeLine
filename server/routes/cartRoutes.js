import express from 'express';
import { updateCart } from "../controllers/cartController.js";
import authPatient from '../middlewares/authPatient.js';



const cartRouter = express.Router();

cartRouter.post('/update', authPatient, updateCart)

export default cartRouter;