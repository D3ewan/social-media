import { loginController, signupController, logoutController } from "../controllers/authController";
import express from "express";

// Create an instance of Express Router
const router = express.Router();

// Define routes for authentication functionality
router.post('/login', loginController); // Route for user login
router.post('/signup', signupController); // Route for user signup
router.post('/logout', logoutController); // Route for user logout

// Export the router to be used in other parts of the application
export default router;
