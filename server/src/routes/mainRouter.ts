import express from "express";
import authRouter from './authRouter';
import userRouter from './userRouter';
import postRouter from './postRouter';

const router = express.Router();

router.use('/auth', authRouter);
router.use('/user', userRouter);
router.use('/post', postRouter);

export default router;