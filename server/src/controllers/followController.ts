import { Request, Response } from "express";
import { z } from 'zod';
import Follow from '../models/followSchema';
import User from "../models/userSchema";
import { v4 as uuidv4 } from 'uuid';

// Validation schema for request body
const BodyValidator = z.object({
    id: z.string(), // ID of the current user
    userId: z.string() // ID of the user to follow/unfollow
})

// Controller function to follow a user
const followController = async (req: Request, res: Response) => {
    try {
        const usersData = BodyValidator.safeParse(req.body); // Parsing and validating request body

        if (!usersData.success) {
            return res.status(400).send(usersData.error); // Handling validation errors
        }
        const { id, userId } = usersData.data;

        if (id == userId) return res.status(409).send('Users cannot follow themselves'); // Handling self-following case
        const existingFollow = await Follow.findOne({ followerId: id, followingId: userId });

        if (existingFollow) {
            return res.status(400).json({ error: 'You are already following this user' }); // Handling case where user is already followed
        }
        const userToFollow = await User.find({ _id: usersData.data.userId }).populate('-password');

        if (!userToFollow) {
            return res.status(404).send('User to follow not found'); // Handling case where user to follow is not found
        }

        await Follow.create({
            _id: uuidv4(), // Generating a unique ID for the follow entry
            followerId: id,
            followingId: userId
        })
        return res.status(200).send(`Started Following ${userToFollow[1].name}`); // Returning success message after following
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' }); // Handling errors
    }
}

// Controller function to unfollow a user
const unfollowController = async (req: Request, res: Response) => {
    try {
        const usersData = BodyValidator.safeParse(req.body); // Parsing and validating request body

        if (!usersData.success) {
            return res.status(400).send(usersData.error); // Handling validation errors
        }

        const { id, userId } = usersData.data;

        const follow = await Follow.findOneAndDelete({
            followerId: id,
            followingId: userId
        });

        if (!follow) return res.status(404).send('You dont follow the provided user'); // Handling case where user is not followed

        return res.status(200).send('unfollowed successfully'); // Returning success message after unfollowing

    } catch (error) {
        res.status(500).json({ error: 'Internal server error' }); // Handling errors
    }
}

// Controller function to get followers of a user
const getFollowers = async (req: Request, res: Response) => {
    try {
        const myid = req.body.id; // ID of the current user
        const followers = await Follow.find({ followingId: myid }).populate('-password'); // Finding followers of the current user

        if (!followers) return res.status(404).send('You have 0 Followers'); // Handling case where there are no followers

        return res.status(200).json(followers); // Returning followers

    } catch (error) {
        res.status(500).json({ error: 'Internal server error' }); // Handling errors
    }
}

// Controller function to get users followed by a user
const getFollowing = async (req: Request, res: Response) => {
    try {
        const myid = req.body.id; // ID of the current user
        const following = await Follow.find({ followerId: myid }).populate('-password'); // Finding users followed by the current user

        if (!following) return res.status(404).send('You dont follow anyone'); // Handling case where the user is not following anyone

        return res.status(200).json(following); // Returning users followed by the current user
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' }); // Handling errors
    }
}

export { followController, unfollowController, getFollowers, getFollowing };
