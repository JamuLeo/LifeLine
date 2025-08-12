import mongoose from "mongoose";

const sendedAmountSchema = new mongoose.Schema({
    campaign: { type: String, required: true, ref: 'campaign' },
    amount: { type: Number, required: true },
    pendingAmount: { type: Number, required: true }, // Collected - All sent
    patientId: { type: String, required: true, ref: 'patient' },
    donationRequestId: { type: String, required: true, ref: 'donationrequest' },
}, { timestamps: true });

const SendedAmount = mongoose.models.sendedamount || mongoose.model('sendedamount', sendedAmountSchema);
export default SendedAmount;
