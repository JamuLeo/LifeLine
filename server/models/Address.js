import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
    patientId : {type: String, required: true, ref: 'patient'},
    street: {type: String, required: true},
    city: {type: String, required: true},
    province: {type: String, required: true},
    phone: {type: String, required: true},
})

const Address = mongoose.models.address || mongoose.model('address', addressSchema)

export default Address