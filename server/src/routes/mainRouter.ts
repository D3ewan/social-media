import express from "express";
import authRouter from './authRouter';
import userRouter from './userRouter';
import postRouter from './postRouter';
import refreshAccessTokenRouter from "./refreshAccessTokenRouter";
import followRouter from './followRouter';

// Create an instance of Express Router
const router = express.Router();

// Define routes for different functionalities of the application
router.use('/auth', authRouter); // Route for authentication API
router.use('/user', userRouter); // Route for CRUD operations on User
router.use('/post', postRouter); // Route for CRUD operations on posts
router.use('/refreshAccessToken', refreshAccessTokenRouter); // Route for refreshing access token
router.use('/followRouter', followRouter); // Route for follow and unfollow functionality

// Export the router to be used in other parts of the application
export default router;
