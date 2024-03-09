import mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid';

const postSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: uuidv4,
        index: true
    },
    owner: {
        type: String,
        ref: 'user'
    },
    content: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

export default mongoose.model('post', postSchema);