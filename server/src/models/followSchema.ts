import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

//Schema for follower and following purpose
const followSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: uuidv4
    },
    followerId: {
        type: String,
        ref: 'user',
        required: true,
        index: true
    },
    followingId: {
        type: String,
        ref: 'user',
        required: true,
        index: true
    }
}, { timestamps: true })

export default mongoose.model('follow', followSchema);