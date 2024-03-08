import { updateUserProfileController, deleteUserProfileController, getMyInfoController } from '../controllers/userController';
import { authMiddleware } from '../middlewares/authMiddleware';
import express from 'express';
const router = express.Router();

//Middleware for authorization
router.use(authMiddleware);

//APIs for Read, Update and Delete of user profile
router.get('/getMyInfo', getMyInfoController);
router.patch('/', updateUserProfileController);
router.delete('/', deleteUserProfileController);

export default router;