import express from 'express';
import { refreshAccessTokenController } from '../controllers/refreshAccessTokenController';

// Create an instance of Express Router
const router = express.Router();

// Define route for refreshing access token
router.get('/', refreshAccessTokenController); // Route for refreshing the access token

// Export the router to be used in other parts of the application
export default router;
