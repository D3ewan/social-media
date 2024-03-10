import { Request, Response } from 'express';
import User from '../models/userSchema';
import { z } from 'zod';
import Post from '../models/postSchema';
import Follow from '../models/followSchema'

//@description     Get all the users detail
//@route           GET /api/user/allUsers
//@access          Protected
export const allUsers = async (req: Request, res: Response) => {
    try {
        if (!req.query.search) return res.status(404).send('No user with provided name or email');
        const keyword = {
            $or: [
                { name: { $regex: req.query.search, $options: "i" } },
                { email: { $regex: req.query.search, $options: "i" } },
            ],
        }
        const users = await User.find(keyword).find({ _id: { $ne: req.body.id } });
        return res.json({ data: users }).status(200);
    } catch (error) {
        return res.send((error as Error).message);
    }
};

//for reading your details
//@description     Get your details
//@route           GET /api/user/
//@access          Protected
const getMyInfoController = async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.body.id);
        return res.status(200).json(user);
    } catch (e) {
        return res.status(500).send((e as Error).message);
    }

}

//for validation of data coming into req.body from the client, in the handler function updateUserProfileController
const updateUserBodySchema = z.object({
    id: z.string().optional(),
    name: z.string().min(3).max(100).optional(),
    email: z.string().email().min(10).max(100).optional(),
    picUrl: z.string().optional(),
    password: z.string().min(8).max(100).optional()
})


//for updating your details
//@description     Update  your profile
//@route           PATCH /api/user/
//@access          Protected

const updateUserProfileController = async (req: Request, res: Response) => {
    try {
        //validating the content in this handler function
        const bodyData = updateUserBodySchema.safeParse(req.body);

        if (!bodyData.success) { //if not validated send the response regarding this to the client
            return res.status(400).json(bodyData.error);
        }

        const myId = bodyData.data.id;
        delete bodyData.data.id;

        const user = await User.findByIdAndUpdate(myId, bodyData.data, { new: true }); //first find the id of the user, then update it

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        return res.status(200).json({ message: 'User profile updated successfully', ...user });

    } catch (e) {
        return res.status(500).send((e as Error).message);
    }
}

//for deletion of your profile
//When you delete your profile, you need to remove the followers,followings and post from the database

//@description     Delete your profile
//@route           DELETE /api/user/
//@access          Protected
const deleteUserProfileController = async (req: Request, res: Response) => {
    try {
        const currentUserId = req.body.id;

        //deleting your posts if any
        await Post.deleteMany({
            owner: currentUserId
        })

        //delete the data from Follow
        await Follow.deleteMany({
            $or: [{ followerId: currentUserId }, { followingId: currentUserId }],
        });

        //delete the current user
        await User.deleteOne({ _id: currentUserId });

        //remove the refresh token from cookies
        res.clearCookie("jwt", {
            httpOnly: true,
            secure: true
        })

        return res.status(200).json({ message: 'user deleted' });
    } catch (e) {
        return res.status(500).send((e as Error).message);
    }
}


export { getMyInfoController, updateUserProfileController, deleteUserProfileController };