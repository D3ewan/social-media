import { Request, Response } from 'express';
import User from '../models/userSchema';
import { z } from 'zod';
import Post from '../models/postSchema';
import Follow from '../models/followSchema'

const getMyInfoController = async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.body.id);
        return res.status(200).json(user);
    } catch (e) {
        return res.status(500).send((e as Error).message);
    }

}

const updateUserBodySchema = z.object({
    id: z.string().optional(),
    name: z.string().min(3).max(100).optional(),
    email: z.string().email().min(10).max(100).optional(),
    picUrl: z.string().optional(),
    password: z.string().min(8).max(100).optional()
})

const updateUserProfileController = async (req: Request, res: Response) => {
    try {
        const bodyData = updateUserBodySchema.safeParse(req.body);
        if (!bodyData.success) {
            return res.status(400).send(bodyData.error);
        }
        const myId = bodyData.data.id;
        delete bodyData.data.id;

        const user = await User.findByIdAndUpdate(myId, bodyData, { new: true });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        return res.status(200).json({ message: 'User profile updated successfully', user });

    } catch (e) {
        return res.status(500).send((e as Error).message);
    }
}

const deleteUserProfileController = async (req: Request, res: Response) => {
    try {
        const currentUserId = req.body.id;

        await Post.deleteMany({
            owner: currentUserId
        })

        await Follow.deleteMany({ followerId: currentUserId });
        await Follow.deleteMany({ followingId: currentUserId });
        await User.deleteOne({ _id: currentUserId });

        res.clearCookie("jwt", {
            httpOnly: true,
            secure: true
        })

        return res.status(200).send('user deleted');
    } catch (e) {
        return res.status(500).send((e as Error).message);
    }
}


export { getMyInfoController, updateUserProfileController, deleteUserProfileController };