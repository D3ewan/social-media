import { getUserProfileController, updateUserProfileController, followOrUnfollowUserController, getPostsOfFollowingController, getMyPostController, getUserPostsController, deleteUserProfileController, getMyInfoController } from '../controllers/userController';
import { authMiddleware } from '../middlewares/authMiddleware';
import express from 'express';
const router = express.Router();

//Middleware for authorization
router.use(authMiddleware);

//APIs for Read, Update and Delete of user profile
router.get('/getMyInfo', getMyInfoController);
router.patch('/', updateUserProfileController);
router.delete('/', deleteUserProfileController);

//API for Follower and Following
router.post('/follow', followOrUnfollowUserController);


router.get('/getFeedData', getPostsOfFollowingController);
// router.get('/getMyPosts', getMyPostController);
// router.get('/getUserPosts', getUserPostsController)
router.post('/getUserProfile', getUserProfileController);

export default router;