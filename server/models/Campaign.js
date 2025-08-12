import mongoose from "mongoose";


const campaignSchema = new mongoose.Schema({
    patientId: { type: String, required: true, ref: 'patient' },
    image: {type: Array, required: true},
    title: { type: String, required: true },
    description: { type: Array, required: true },
    category: { type: String, required: true },
    goalAmount: { type: Number, required: true },
    collectedAmount: { type: Number, default: 0 },
    endDate: { type: String, required: true },
    address: { type: String, required: true, ref: 'address' },
    account: { type: String, required: true, ref: 'account' },
    isApprove: { type: Boolean, default: false },
    isEmergency: { type: Boolean, default: false },
    isReject: { type: Boolean, default: false },
}, { timestamps: true })

const Campaign = mongoose.models.campaign || mongoose.model('campaign', campaignSchema)

export default Campaign