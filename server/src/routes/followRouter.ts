import express from 'express';
import { followController, unfollowController, getFollowers, getFollowing } from '../controllers/followController';
import { authMiddleware } from '../middlewares/authMiddleware';

// Create an instance of Express Router
const router = express.Router();

// Apply authentication middleware to all routes defined in this router
router.use(authMiddleware);

// Define routes and their corresponding controller functions
router.post('/follow', followController); // Route for following a user
router.delete('/unfollow', unfollowController); // Route for unfollowing a user
router.get('/follower', getFollowers); // Route for getting followers of a user
router.get('/following', getFollowing); // Route for getting users followed by a user

// Export the router to be used in other parts of the application
export default router;
