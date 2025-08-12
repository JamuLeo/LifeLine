import express from "express";
import { sendedAmountsAll, sendedAmountsByPatient } from "../controllers/SendedAmountControllers.js";
import authPatient from "../middlewares/authPatient.js";




const sendedAmountRouter = express.Router();
sendedAmountRouter.get('/my', authPatient ,sendedAmountsByPatient);
sendedAmountRouter.get('/all', sendedAmountsAll);
export default sendedAmountRouter;