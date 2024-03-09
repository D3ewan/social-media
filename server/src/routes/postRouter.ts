import express from 'express';
import { createPostController, latestPostsController, updatePostController, deletePostController, readPostController } from '../controllers/postController';
import { authMiddleware } from '../middlewares/authMiddleware';

// Create an instance of Express Router
const router = express.Router();

// Apply authentication middleware for all routes in this router
router.use(authMiddleware); // Middleware for authorization

// Define routes for post functionality
router.post('/', createPostController); // Route for creating a post
router.put('/:postId', updatePostController); // Route for updating a post
router.delete('/:postId', deletePostController); // Route for deleting a post
router.get('/myPosts', readPostController); // Route for reading posts
router.get('/latestPosts', latestPostsController); // Route for retrieving latest posts of users followed

// Export the router to be used in other parts of the application
export default router;
