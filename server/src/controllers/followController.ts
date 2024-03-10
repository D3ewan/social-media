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

//@description     Follow a user
//@route           POST /api/followRouter/follow
//@access          Protected

const followController = async (req: Request, res: Response) => {
    try {
        const usersData = BodyValidator.safeParse(req.body); // Parsing and validating request body

        if (!usersData.success) {
            return res.status(400).json({ error: usersData.error }); // Handling validation errors
        }
        const { id, userId } = usersData.data;
        // console.log(id, userId);
        if (id == userId) return res.status(409).json({ "message": 'Users cannot follow themselves' }); // Handling self-following case
        const existingFollow = await Follow.findOne({ followerId: id, followingId: userId });

        if (existingFollow) {
            return res.status(400).json({ error: 'You are already following this user' }); // Handling case where user is already followed
        }
        const userToFollow = await User.findOne({ _id: usersData.data.userId });

        // console.log(userToFollow);

        if (!userToFollow) {
            return res.status(404).json({ error: 'User to follow not found' }); // Handling case where user to follow is not found
        }

        // console.log(id, userId);
        await Follow.create({
            followerId: id,
            followingId: userId
        })

        return res.status(200).json({ message: `Started Following ${userToFollow.name}` }); // Returning success message after following
    } catch (error) {
        res.status(500).json({ error: (error as Error).message }); // Handling errors
    }
}

// Controller function to unfollow a user

//@description     Unfollow a user
//@route           DELETE /api/followRouter/unfollow
//@access          Protected
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

        return res.status(200).json({ message: 'unfollowed successfully' }); // Returning success message after unfollowing

    } catch (error) {
        res.status(500).json((error as Error).message); // Handling errors
    }
}

// Controller function to get followers of a user

//@description     Get the followers
//@route           GET /api/followRouter/follower
//@access          Protected

const getFollowers = async (req: Request, res: Response) => {
    try {
        const myid = req.body.id; // ID of the current user
        const followers = await Follow.find({ followingId: myid }).select('-followingId').populate('followerId'); // Finding followers of the current user
        if (followers.length === 0) return res.status(200).json({ message: 'You have 0 Followers' }); // Handling case where there are no followers

        return res.status(200).json({ message: followers }); // Returning followers

    } catch (error) {
        res.status(500).json((error as Error).message); // Handling errors
    }
}

// Controller function to get users followed by a user

//@description     Get your followings
//@route           GET /api/followRouter/following
//@access          Protected

const getFollowing = async (req: Request, res: Response) => {
    try {
        const myid = req.body.id; // ID of the current user
        const following = await Follow.find({ followerId: myid }).select('-followerId').populate('followingId'); // Finding users followed by the current user

        if (following.length === 0) return res.status(200).json({ message: 'You dont follow anyone' }); // Handling case where the user is not following anyone

        return res.status(200).json({ message: following }); // Returning users followed by the current user
    } catch (error) {
        res.status(500).json((error as Error).message); // Handling errors
    }
}

export { followController, unfollowController, getFollowers, getFollowing };
