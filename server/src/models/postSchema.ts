import mongoose from "mongoose";
import { string } from "zod";

const postSchema = new mongoose.Schema({
    id: {
        type: string,
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
    timestamps: true, _id: false
})

export default mongoose.model('post', postSchema);