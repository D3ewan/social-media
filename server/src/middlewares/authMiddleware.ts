import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import jwt, { JwtPayload } from 'jsonwebtoken';

// Define schema for header validation
const headerSchema = z.object({
    authorization: z.string()
});

// Middleware for authorization: Only users with valid access tokens can proceed
export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { authorization } = headerSchema.parse(req.headers);

        // Check if the authorization header starts with 'Bearer'
        if (!authorization.startsWith('Bearer')) {
            return res.json({ message: 'Send token in proper format!!' });
        }

        // Extract the token from the authorization header
        const token = authorization.split(' ')[1];

        // Verify the token
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_PRIVATE_KEY!) as JwtPayload;

        // Pass the user ID extracted from the token to the request body
        req.body.id = decoded._id;

        // Move to the next middleware or route handler
        next();
    } catch (error) {
        // Return 401 Unauthorized if token verification fails
        return res.status(401).json({ message: "Not authorized, token failed" });
    }
};
