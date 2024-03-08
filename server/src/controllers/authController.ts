import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response } from 'express';
import { z } from 'zod';
import User from '../models/userSchema';

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
        const user = await User.create({ name, email, password: hashedPassword })

        return res.status(201).send("user created successfully");

    } catch (e) {
        return res.status(500).send((e as Error).message);
    }
}

const loginController = async (req: Request, res: Response) => {
    try {
        const { email, password } = loginBodySchema.parse(req.body);

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).send('User not registered');
        }
        const matched = await bcrypt.compare(password, user.password)

        if (!matched) {
            return res.status(403).send('incorrect password');
        }
        const accessToken = generateAccessToken({ _id: user._id })
        const refreshToken = generateRefreshToken({ _id: user._id })

        res.cookie('jwt', refreshToken, {
            httpOnly: true,
            secure: true
        })

        return res.status(200).send(accessToken);

    } catch (e) {
        return res.status(500).send((e as Error).message);
    }
}
//This Api will check the refreshToken validity and generate 
const refreshAccessTokenController = async (req: Request, res: Response) => {
    const cookies = req.cookies;

    if (!cookies.jwt) {
        return res.status(401).send('refresh token in cookie is required');
    }

    const refreshToken = cookies.jwt;

    try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_PRIVATE_KEY!);
        const _id = (decoded as JwtPayload)._id;
        const accessToken = generateAccessToken({ _id });
        return res.send(success(201, { accessToken }))

    } catch (e) {
        console.error({ message: e.message });
        return res.send(error(401, 'invalid refresh token'))
    }
}

const logoutController = async (req: Request, res: Response) => {
    try {
        res.clearCookie('jwt', {
            httpOnly: true,
            secure: true
        })
        return res.send(success(200, 'user logged out'))
    } catch (e) {
        return res.send(error(500, e.message))
    }
}

const generateRefreshToken = (user) => {
    try {
        const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_PRIVATE_KEY, {
            expiresIn: '1y'
        })
        return refreshToken;
    } catch (e) {
        console.error({ message: e.message })
    }
}

const generateAccessToken = (user) => {
    try {
        const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_PRIVATE_KEY, {
            expiresIn: '15m'
        })
        return accessToken;
    } catch (e) {
        console.error({ message: e.message });
    }
}

export { loginController, signupController, refreshAccessTokenController, logoutController }