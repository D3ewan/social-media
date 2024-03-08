import express from 'express';
import { refreshAccessTokenController } from '../controllers/refreshAccessTokenController';
const router = express.Router();


router.get('/refresh', refreshAccessTokenController);


export default router;