import express from 'express';
import { upload } from '../configs/multer.js';
import authAdmin from '../middlewares/authAdmin.js';
import { addCampaign, deleteCampaign,campaignById, campaignList, campaignsByPatient, campaignsByPatientId, changeApprove, changeEmergency } from '../controllers/campaignController.js';
import authPatient from '../middlewares/authPatient.js';
import { patientCampaignOverview } from '../controllers/patientCampaignOverview.js';

const campaignRouter = express.Router();

campaignRouter.post('/add', upload.array(["images"],4), authPatient, addCampaign);
campaignRouter.get('/list', campaignList )
campaignRouter.get('/id', campaignById )
campaignRouter.get('/by-patient', authPatient, campaignsByPatient); 
campaignRouter.post('/approve', authAdmin, changeApprove )
campaignRouter.post('/emergency', authAdmin, changeEmergency )
router.delete('/delete/:id', deleteCampaign);
campaignRouter.get('/overview', authPatient, patientCampaignOverview);
campaignRouter.get('/by-patient', authPatient, campaignsByPatient); 
campaignRouter.get('/by-patient/:id', campaignsByPatientId);          


export default campaignRouter;