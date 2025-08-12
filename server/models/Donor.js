import mongoose from 'mongoose';

const donorSchema = new mongoose.Schema({
    _id: {type: String, required:true},
    name: {type: String, required:true},
    email: {type: String, required:true},
    image: {type: String, required:true},
})

const Donor = mongoose.models.donor || mongoose.model('donor', donorSchema)

export default Donor;