import express from 'express';
import { submitContactRequest, getAllContactRequests } from '../controllers/contactRequestController.js';

const router = express.Router();

router.post('/submit', submitContactRequest); // Anyone can submit
router.get('/all', getAllContactRequests);    // Admin can fetch all

export default router;
