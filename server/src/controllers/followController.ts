import { Request, Response } from "express";
import { z } from 'zod';
import Follow from '../models/followSchema';
import User from "../models/userSchema";
import { v4 as uuidv4 } from 'uuid';

const BodyValidator = z.object({
    id: z.string(),
    userId: z.string()
})

const followController = async (req: Request, res: Response) => {
    try {
        const usersData = BodyValidator.safeParse(req.body);

        if (!usersData.success) {
            return res.status(400).send(usersData.error);
        }
        const { id, userId } = usersData.data;

        if (id == userId) return res.status(409).send('Users cannot follow themselves');
        const existingFollow = await Follow.findOne({ followerId: id, followingId: userId });

        if (existingFollow) {
            return res.status(400).json({ error: 'You are already following this user' });
        }
        const userToFollow = await User.find({ _id: usersData.data.userId }).populate('-password');

        if (!userToFollow) {
            return res.status(404).send('User to follow not found');
        }

        await Follow.create({
            _id: uuidv4(),
            followerId: id,
            followingId: userId
        })
        return res.status(200).send(`Started Following ${userToFollow[1].name}`)
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

const unfollowController = async (req: Request, res: Response) => {
    try {
        const usersData = BodyValidator.safeParse(req.body);

        if (!usersData.success) {
            return res.status(400).send(usersData.error);
        }

        const { id, userId } = usersData.data;

        const follow = await Follow.findOneAndDelete({
            followerId: id,
            followingId: userId
        });

        if (!follow) return res.status(404).send('You dont follow the provided user');

        return res.status(200).send('unfollowed successfully');

    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

const getFollowers = async (req: Request, res: Response) => {
    try {
        const myid = req.body.id;
        const followers = await Follow.find({ followingId: myid }).populate('-password');

        if (!followers) return res.status(404).send('You have 0 Followers');

        return res.status(200).json(followers);

    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

const getFollowing = async (req: Request, res: Response) => {
    try {
        const myid = req.body.id;
        const following = await Follow.find({ followerId: myid }).populate('-password');

        if (!following) return res.status(404).send('You dont follow anyone');

        return res.status(200).json(following);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

export { followController, unfollowController, getFollowers, getFollowing };