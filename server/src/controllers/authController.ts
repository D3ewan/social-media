import bcrypt from 'bcrypt';
import { generateAccessToken, generateRefreshToken } from '../utils/tokenGenerator';
import { Request, Response } from 'express';
import { z } from 'zod';
import User from '../models/userSchema';

// Validation schema for sign-up request body
const signUpBodySchema = z.object({
    name: z.string().min(3).max(100), // User's name
    email: z.string().email().max(100).min(10), // User's email
    password: z.string().min(8).max(100), // User's password
    picUrl: z.string().optional() // URL for user's profile picture (optional)
});

// Validation schema for login request body
const loginBodySchema = signUpBodySchema.pick({
    email: true, // Include email in login schema
    password: true // Include password in login schema
})

// Controller function for user sign-up

//@description     signup
//@route           POST /api/auth/signup

const signupController = async (req: Request, res: Response) => {
    try {
        const { email, password, name, picUrl } = signUpBodySchema.parse(req.body); // Parsing and validating request body

        const oldUser = await User.findOne({ email });

        if (oldUser) {
            return res.status(409).send('User is already registered'); // Handling case where user is already registered
        }

        const hashedPassword = await bcrypt.hash(password, 10); // Hashing the password
        const user = await User.create({ name, email, password: hashedPassword }); // Creating a new user

        return res.status(201).send("user created successfully"); // Sending success message

    } catch (e) {
        return res.status(500).send((e as Error).message); // Handling errors
    }
}

// Controller function for user login

//@description     Login
//@route           POST /api/auth/login

const loginController = async (req: Request, res: Response) => {
    try {
        const { email, password } = loginBodySchema.parse(req.body); // Parsing and validating request body

        const user = await User.findOne({ email }).select('+password'); // Finding user by email

        if (!user) {
            return res.status(404).send('User not registered'); // Handling case where user is not found
        }
        const matched = await bcrypt.compare(password, user.password); // Comparing passwords

        if (!matched) {
            return res.status(403).send('incorrect password'); // Handling case where password is incorrect
        }
        const accessToken = generateAccessToken({ _id: user.id }); // Generating access token
        const refreshToken = generateRefreshToken({ _id: user.id }); // Generating refresh token

        res.cookie('jwt', refreshToken, {
            httpOnly: true,
            secure: true
        }); // Setting refresh token in a cookie

        return res.status(200).send(accessToken); // Sending access token

    } catch (e) {
        return res.status(500).send((e as Error).message); // Handling errors
    }
}

// Controller function for user logout

//@description     logout
//@route           POST /api/auth/logout
//@access          Protected

const logoutController = async (req: Request, res: Response) => {
    try {
        res.clearCookie('jwt', {
            httpOnly: true,
            secure: true
        }); // Clearing the JWT cookie
        return res.status(200).send('user logged out'); // Sending success message
    } catch (e) {
        return res.status(500).send((e as Error).message); // Handling errors
    }
}

export { loginController, signupController, logoutController };
