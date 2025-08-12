import express from 'express';
import { forgotPassword, getPatientById, isAuth, login, logout, patientList, register, resetPassword, verifyOTP } from '../controllers/patientController.js';
import authPatient from '../middlewares/authPatient.js';

const patientRouter = express.Router();

patientRouter.post('/register', register);
patientRouter.post('/verify-otp', verifyOTP);
patientRouter.post('/login', login);
patientRouter.post('/forgot-password', forgotPassword);
patientRouter.post('/reset-password', resetPassword);
patientRouter.get('/is-auth', authPatient, isAuth);
patientRouter.get('/logout', authPatient, logout);
patientRouter.get('/all-patients', patientList);
patientRouter.get('/single/:id', getPatientById);
export default patientRouter;
