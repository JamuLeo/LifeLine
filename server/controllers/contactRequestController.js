import ContactRequest from '../models/ContactRequest.js';
import nodemailer from 'nodemailer';
// Create (POST)
export const submitContactRequest = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ success: false, message: "All fields required" });
    }

    // 1️⃣ Save message to MongoDB
    const newRequest = await ContactRequest.create({ name, email, subject, message });

    // 2️⃣ Send email notification to admin
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: `"LifeLine Contact Form" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER, // Send to your own email
      subject: `New Contact Request: ${subject}`,
      text: `
        You have a new contact request:
        
        Name: ${name}
        Email: ${email}
        Subject: ${subject}
        
        Message:
        ${message}
      `
    });

    res.json({ success: true, message: "Your request has been submitted!", request: newRequest });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// Read (GET, admin)
export const getAllContactRequests = async (req, res) => {
  try {
    const requests = await ContactRequest.find().sort({ createdAt: -1 });
    res.json({ success: true, requests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
