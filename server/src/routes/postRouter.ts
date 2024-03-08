import express from 'express';
const router = express.Router();
import { createPostController, latestPostsController, updatePostController, deletePostController, readPostController } from '../controllers/postController';
import { authMiddleware } from '../middlewares/authMiddleware';

router.use(authMiddleware);
router.post('/', createPostController)
router.put('/:postId', updatePostController)
router.delete('/:postId', deletePostController);
router.get('/myPosts', readPostController);
router.get('/latestPosts', latestPostsController)

export default router;