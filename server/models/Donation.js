import mongoose from "mongoose";

const donationSchema = new mongoose.Schema({
    donorId: { type: String, required: true, ref: 'donor' },
    campaign: { type: String, required: true, ref: 'campaign' },
    amount: { type: Number, required: true },
    message: { type: String, default: null },
    isAnonymous: { type: Boolean, default: false },
}, { timestamps: true });

const Donation = mongoose.models.donation || mongoose.model('donation', donationSchema);
export default Donation;

