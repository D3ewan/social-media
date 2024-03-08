import express, { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import jwt, { JwtPayload } from 'jsonwebtoken';

//for validation of token coming from the client
const headerSchema = z.object({
    authorization: z.string()
})

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { authorization } = headerSchema.parse(req.headers);
        if (!authorization.startsWith('Bearer')) return res.send('Send token in proper format!!');
        const token = authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);
        console.log(decoded);
        req.body.id = (decoded as JwtPayload).id;
        next();
    } catch (error) {
        return res.status(401).send("Not authorized, token failed");
    }
}