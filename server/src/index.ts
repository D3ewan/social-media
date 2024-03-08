import express from 'express';
import dotenv from 'dotenv';
import dbConnect from "./utils/dbConnect";
import authRouter from "./routes/authRouter";
import postsRouter from "./routes/postRouter";
import userRouter from "./routes/userRouter";
import cookieParser from "cookie-parser";
// import cors from 'cors'
import Cloudinary from 'cloudinary';
import mainRouter from './routes/mainRouter';
import { rateLimit } from 'express-rate-limit';

const cloudinary = Cloudinary.v2;

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const app = express();

// Define rate limiting options
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 300, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later'
});



//middlewares
app.use(limiter); // Apply rate limiter to all requests
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());

let origin = 'http://localhost:5173';
if (process.env.NODE_ENV === 'production') {
    origin = process.env.CORS_ORIGIN!
}
// app.use(cors({
//     credentials: true,
//     origin
// }))

app.use('/api', mainRouter);
app.get('/', (req, res) => {
    res.status(200).send("ok from server");
})

const PORT = process.env.PORT || 3000;
dbConnect()
app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
}); 