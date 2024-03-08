import express from 'express';
import { followController, unfollowController, getFollowers, getFollowing } from '../controllers/followController';
import { authMiddleware } from '../middlewares/authMiddleware';
const router = express.Router();

router.use(authMiddleware);
router.post('/follow', followController);
router.delete('/unfollow', unfollowController);
router.get('/follower', getFollowers);
router.get('/following', getFollowing);

export default router;