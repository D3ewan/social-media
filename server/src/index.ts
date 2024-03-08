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
const cloudinary = Cloudinary.v2;

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const app = express();

//middlewares
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