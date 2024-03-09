import mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid';

const userSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: uuidv4,
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        index: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    name: {
        type: String,
        required: true,
    },
    bio: {
        type: String
    },
    avatar: {
        publicId: String,
        url: String
    }
}, {
    timestamps: true
})

export default mongoose.model('user', userSchema);