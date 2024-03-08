import express from "express";
import authRouter from './authRouter';
import userRouter from './userRouter';
import postRouter from './postRouter';
import refreshAccessTokenRouter from "./refreshAccessTokenRouter";
const router = express.Router();

router.use('/auth', authRouter);
router.use('/user', userRouter);
router.use('/post', postRouter);
router.use('/refreshToken', refreshAccessTokenRouter);


export default router;