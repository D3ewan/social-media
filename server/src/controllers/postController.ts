import express, { Response, Request } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import Post from '../models/postSchema'
import Follow from '../models/followSchema';


const readPostController = async (req: Request, res: Response) => {
    try {
        const { id } = req.body;
        console.log(id);
        const allPosts = await Post.find({ owner: id });
        return res.json(allPosts);
    } catch (error) {
        return res.status(500).send((error as Error).message);
    }
}

const createPostBodySchema = z.object({
    id: z.string(),
    content: z.string().max(1000).min(3)
});

const createPostController = async (req: Request, res: Response) => {
    try {
        const postData = createPostBodySchema.safeParse(req.body);

        console.log(postData);
        if (!postData.success) {
            return res.status(400).send(postData.error);
        }

        const post = await Post.create({
            _id: uuidv4(),
            owner: postData.data.id,
            content: postData.data.content
        });

        console.log(post);
        return res.status(201).json(post);
    } catch (error) {
        return res.send((error as Error).message);
    }
}

const paramSchema = z.object({
    postId: z.string()
})

const updatePostController = async (req: Request, res: Response) => {
    try {
        const postId = paramSchema.safeParse(req.params);
        if (!postId.success) {
            return res.status(400).send(postId.error);
        }
        const postData = createPostBodySchema.safeParse(req.body);
        if (!postData.success) {
            return res.status(400).send(postData.error);
        }
        const updatedPost = await Post.findByIdAndUpdate(
            postId.data.postId,
            {
                content: postData.data.content
            },
            {
                new: true
            }
        )

        if (!updatedPost) {
            return res.status(404).send('Post Not Found');
        } else {
            return res.status(200).json(updatedPost);
        }

    } catch (error) {
        return res.send((error as Error).message);
    }
}

const deletePostController = async (req: Request, res: Response) => {
    try {
        const postId = paramSchema.safeParse(req.params);
        if (!postId.success) {
            return res.status(400).send(postId.error);
        }

        await Post.findByIdAndDelete(
            postId.data.postId
        )

        return res.status(200).send('post deleted successfully');
    } catch (error) {
        return res.send((error as Error).message);
    }
}

const latestPostsController = async (req: Request, res: Response) => {
    try {
        const latestPost = await Follow.aggregate([
            {
                $match: { followerId: req.body.id } // Match the followerId with the provided userId
            },
            {
                $lookup: {
                    from: 'posts', // Collection name for posts
                    localField: 'followingId',
                    foreignField: 'owner',
                    as: 'posts'
                }
            },
            {
                $unwind: '$posts' // Unwind the posts array
            },
            {
                $sort: { 'posts.createdAt': -1 } // Sort posts by createdAt in descending order
            },
            {
                $limit: 5 // Limit to only one post, which is the latest
            },
            {
                $project: {
                    _id: 0, // Exclude the _id field
                    latestPost: '$posts' // Rename the field to latestPost
                }
            }
        ]);

        if (latestPost.length === 0) {
            return res.status(404).json({ message: 'No latest post found for the user you follow.' });
        }

        return res.status(200).json({ latestPost: latestPost[0].latestPost });

    } catch (error) {
        res.status(500).json({ message: 'Internal server error' })
    }
}

export { readPostController, createPostController, updatePostController, deletePostController, latestPostsController };