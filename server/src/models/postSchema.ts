import mongoose from "mongoose";
import { string } from "zod";

const postSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true
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