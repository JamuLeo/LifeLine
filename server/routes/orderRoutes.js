import express from 'express';

import { getAllOrder, getUserOrder, placeOrderCOD, placeOrderStripe } from '../controllers/orderController.js';
import authAdmin from '../middlewares/authAdmin.js';
import authPatient from '../middlewares/authPatient.js';

const orderRouter = express.Router();

orderRouter.post('/cod',authPatient, placeOrderCOD)
orderRouter.get('/user',authPatient, getUserOrder)
orderRouter.get('/admin',authAdmin, getAllOrder)
orderRouter.post('/stripe',authPatient, placeOrderStripe)

export default orderRouter;