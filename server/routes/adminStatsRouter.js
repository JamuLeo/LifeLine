import express from 'express';
import { dashboardStats } from '../controllers/adminStatsController.js';
import authAdmin from '../middlewares/authAdmin.js'; 

const adminStatsRouter = express.Router();

adminStatsRouter.get('/dashboard-stats', authAdmin, dashboardStats);

export default adminStatsRouter;
