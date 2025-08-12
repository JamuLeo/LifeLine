import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Patient from '../models/Patient.js';
import { generateOTP, otpExpiry } from '../utils/otp.js';
import { sendOTPEmail } from '../utils/mailer.js';

// Register: create user and send OTP
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.json({ success: false, message: 'Missing Details' });

    const existing = await Patient.findOne({ email });
    if (existing) {
      if (!existing.isVerified) {
        // Resend OTP
        const otp = generateOTP();
        existing.otp = otp;
        existing.otpExpires = otpExpiry();
        await existing.save();
        await sendOTPEmail({ to: existing.email, otp });
        return res.json({ success: false, message: 'Email already registered but not verified. OTP sent again.' });
      }
      return res.json({ success: false, message: 'Patient already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();
    const patient = await Patient.create({
      name,
      email,
      password: hashedPassword,
      isVerified: false,
      otp,
      otpExpires: otpExpiry(),
    });

    await sendOTPEmail({ to: email, otp });
    return res.json({ success: true, message: 'Registration successful. OTP sent to your email.', email });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// OTP Verify Route
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const patient = await Patient.findOne({ email });
    if (!patient) return res.json({ success: false, message: "Email not found." });
    if (patient.isVerified) return res.json({ success: false, message: "Already verified." });
    if (patient.otp !== otp) return res.json({ success: false, message: "Invalid OTP." });
    if (Date.now() > patient.otpExpires) return res.json({ success: false, message: "OTP expired." });

    patient.isVerified = true;
    patient.otp = undefined;
    patient.otpExpires = undefined;
    await patient.save();

    res.json({ success: true, message: "Account verified. You can now login." });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Login (must be verified)
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.json({ success: false, message: 'Email and Password are required' });
    const patient = await Patient.findOne({ email });
    if (!patient) return res.json({ success: false, message: 'Invalid email or password' });
    if (!patient.isVerified)
      return res.json({ success: false, message: "Account not verified. Please check your email for OTP." });

    const isMatch = await bcrypt.compare(password, patient.password);
    if (!isMatch)
      return res.json({ success: false, message: 'Invalid email or password' });

    const token = jwt.sign({ id: patient._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({ success: true, patient: { email: patient.email, name: patient.name } });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Forgot password: send OTP
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const patient = await Patient.findOne({ email });
    if (!patient) return res.json({ success: false, message: 'Email not found.' });

    const otp = generateOTP();
    patient.otp = otp;
    patient.otpExpires = otpExpiry();
    await patient.save();
    await sendOTPEmail({ to: email, otp });
    res.json({ success: true, message: 'OTP sent to your email.' });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Reset password: verify OTP and update
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, password } = req.body;
    const patient = await Patient.findOne({ email });
    if (!patient) return res.json({ success: false, message: 'Email not found.' });
    if (patient.otp !== otp) return res.json({ success: false, message: 'Invalid OTP.' });
    if (Date.now() > patient.otpExpires) return res.json({ success: false, message: 'OTP expired.' });

    patient.password = await bcrypt.hash(password, 10);
    patient.otp = undefined;
    patient.otpExpires = undefined;
    await patient.save();
    res.json({ success: true, message: 'Password reset successful. You can now login.' });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};



// Check Auth: /api/patient/is-auth
export const isAuth = async(req, res)=>{
    try {
        const patientId = req.patientId;
        const patient = await Patient.findById(patientId).select("-password")
        return res.json({success: true, patient})
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message})
    }
}

// Check Auth: /api/patient/logout
export const logout = async(req, res)=>{
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        });
        return res.json({success: true, message: "Logged Out" })
    } catch (error) {
        res.json({ success: false, message: error.message})
    }
}




// Get Campaign : /api/campaign/list
export const patientList = async (req, res) => {
  try {
    const patients = await Patient.find({}).select('-password');
    res.json({ success: true, patients });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};


// controllers/patientController.js
export const getPatientById = async (req, res) => {
  try {
    const { id } = req.params;
    const patient = await Patient.findById(id).select("-password");
    if (!patient) return res.json({ success: false, message: "Not found" });
    res.json({ success: true, patient });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
