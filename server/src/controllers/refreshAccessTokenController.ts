import express, { Request, Response } from "express";
import { generateAccessToken } from "../utils/tokenGenerator";
import jwt, { JwtPayload } from 'jsonwebtoken';

//This Api will check the refreshToken validity and generate 
export const refreshAccessTokenController = async (req: Request, res: Response) => {
    const cookies = req.cookies;

    if (!cookies.jwt) {
        return res.status(401).send('refresh token in cookie is required');
    }

    const refreshToken = cookies.jwt;

    try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_PRIVATE_KEY!);
        const _id = (decoded as JwtPayload)._id;
        const accessToken = generateAccessToken({ _id });
        return res.status(201).send(accessToken);

    } catch (e) {
        console.error({ message: (e as Error).message });
        return res.status(401).send('invalid refresh token');
    }
}