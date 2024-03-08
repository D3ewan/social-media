import { getUserProfileController, updateUserProfileController, followOrUnfollowUserController, getPostsOfFollowingController, getMyPostController, getUserPostsController, deleteUserProfileController, getMyInfoController } from '../controllers/userController';
import { authMiddleware } from '../middlewares/authMiddleware';

import express from 'express';
const router = express.Router();

router.use(authMiddleware);
router.post('/follow', followOrUnfollowUserController);
router.get('/getFeedData', getPostsOfFollowingController);
router.get('/getMyPosts', getMyPostController);
router.get('/getUserPosts', getUserPostsController)
router.delete('/', deleteUserProfileController);
router.get('/getMyInfo', getMyInfoController);
router.put('/', updateUserProfileController);
router.post('/getUserProfile', getUserProfileController);

export default router;