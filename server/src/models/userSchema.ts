import mongoose from "mongoose";
import { string } from "zod";

const userSchema = new mongoose.Schema({
    id: {
        type: string,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
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
    timestamps: true, _id: false
})

export default mongoose.model('user', userSchema);