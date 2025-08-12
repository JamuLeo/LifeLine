import mongoose from 'mongoose';

const favouriteSchema = new mongoose.Schema({
    donorId: { type: String, required: true, ref: 'donor' },
    campaign: { type: String, required: true, ref: 'campaign' },
})

const Favourite = mongoose.models.favourite || mongoose.model('favourite', favouriteSchema)

export default Favourite;