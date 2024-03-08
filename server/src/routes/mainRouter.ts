import express from "express";
import authRouter from './authRouter';
import userRouter from './userRouter';
import postRouter from './postRouter';
import refreshAccessTokenRouter from "./refreshAccessTokenRouter";
import followRouter from './followRouter';
const router = express.Router();

router.use('/auth', authRouter);
router.use('/user', userRouter);
router.use('/post', postRouter);
router.use('/refreshAccessToken', refreshAccessTokenRouter);
router.use('/followRouter', followRouter);

export default router;