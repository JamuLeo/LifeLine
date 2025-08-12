import mongoose from 'mongoose';

const contactRequestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const ContactRequest = mongoose.models.ContactRequest || mongoose.model('ContactRequest', contactRequestSchema);

export default ContactRequest;
