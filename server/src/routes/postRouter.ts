import express from 'express';
const router = express.Router();
import { createPostController, likeAndUnlikePostController, updatePostControlller, deletePostControlller } from '../controllers/postsController';
import { authMiddleware } from '../middlewares/authMiddleware';

router.use(authMiddleware);
router.post('/', createPostController)
router.post('/like', likeAndUnlikePostController)
router.put('/', updatePostControlller)
router.delete('/', deletePostControlller);

export default router;