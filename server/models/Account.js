import mongoose from "mongoose";

const accountSchema = new mongoose.Schema({
    patientId : {type: String, required: true, ref: 'patient'},
    fullName: {type: String, required: true},
    bankName: {type: String, required: true},
    accNumber: {type: String, required: true},
    branch: {type: String, required: true},
})

const Account = mongoose.models.account || mongoose.model('account', accountSchema)

export default Account;
