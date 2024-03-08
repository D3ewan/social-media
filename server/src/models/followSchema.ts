import mongoose from 'mongoose';

const followSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true,
    },
    followerId: {
        type: String,
        ref: 'user',
        required: true
    },
    followingId: {
        type: String,
        ref: 'user',
        required: true
    }
}, { timestamps: true })

export default mongoose.model('follow', followSchema);