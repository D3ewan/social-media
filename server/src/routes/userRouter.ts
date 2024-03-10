import { updateUserProfileController, deleteUserProfileController, getMyInfoController, allUsers } from '../controllers/userController';
import { authMiddleware } from '../middlewares/authMiddleware';
import express from 'express';

// Create an instance of Express Router
const router = express.Router();

// Apply authentication middleware for all routes in this router
router.use(authMiddleware);

// Define routes for user profile functionality
router.get('/', getMyInfoController); // Route for getting user information
router.patch('/', updateUserProfileController); // Route for updating user profile
router.delete('/', deleteUserProfileController); // Route for deleting user profile
router.get('/allUsers', allUsers); // Route to get details of all users present
// Export the router to be used in other parts of the application
export default router;
