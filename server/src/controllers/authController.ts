import bcrypt from 'bcrypt';
import { generateAccessToken, generateRefreshToken } from '../utils/tokenGenerator';
import { Request, Response } from 'express';
import { z } from 'zod';
import User from '../models/userSchema';
import { v4 as uuidv4 } from 'uuid';

const signUpBodySchema = z.object({
    name: z.string().min(3).max(100),
    email: z.string().email().max(100).min(10),
    password: z.string().min(8).max(100),
    picUrl: z.string().optional()
});

const loginBodySchema = signUpBodySchema.pick({
    email: true,
    password: true
})

const signupController = async (req: Request, res: Response) => {
    try {
        const { email, password, name, picUrl } = signUpBodySchema.parse(req.body);

        const oldUser = await User.findOne({ email });

        if (oldUser) {
            return res.status(409).send('User is already registered');
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await User.create({ _id: uuidv4(), name, email, password: hashedPassword })

        return res.status(201).send("user created successfully");

    } catch (e) {
        return res.status(500).send((e as Error).message);
    }
}

const loginController = async (req: Request, res: Response) => {
    try {
        const { email, password } = loginBodySchema.parse(req.body);

        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(404).send('User not registered');
        }
        const matched = await bcrypt.compare(password, user.password)

        if (!matched) {
            return res.status(403).send('incorrect password');
        }
        const accessToken = generateAccessToken({ _id: user.id })
        const refreshToken = generateRefreshToken({ _id: user.id })

        res.cookie('jwt', refreshToken, {
            httpOnly: true,
            secure: true
        })

        return res.status(200).send(accessToken);

    } catch (e) {
        return res.status(500).send((e as Error).message);
    }
}

const logoutController = async (req: Request, res: Response) => {
    try {
        res.clearCookie('jwt', {
            httpOnly: true,
            secure: true
        })
        return res.status(200).send('user logged out');
    } catch (e) {
        return res.status(500).send((e as Error).message);
    }
}

export { loginController, signupController, logoutController }