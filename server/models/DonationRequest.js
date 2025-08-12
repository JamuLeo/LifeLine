import mongoose from "mongoose";

const donationrequestSchema = new mongoose.Schema({
    campaign: { type: String, required: true, ref: 'campaign' },
    patientId: { type: String, required: true, ref: 'patient' }, 
    amount: { type: Number, required: true },
    message: { type: String, default: null }, 
    status: { type: String, enum: ['Pending', 'Rejected', 'Sended'], default: "Pending" },
    adminReply: { type: String, default: null }, 
}, { timestamps: true });

const DonationRequest = mongoose.models.donationrequest || mongoose.model('donationrequest', donationrequestSchema);
export default DonationRequest;