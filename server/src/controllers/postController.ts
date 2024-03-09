import { Response, Request } from 'express';
import { z } from 'zod';
import Post from '../models/postSchema'
import Follow from '../models/followSchema';

// Handler function to read posts owned by a specific user

//@description     Read your posts
//@route           GET /api/post/myPosts
//@access          Protected
const readPostController = async (req: Request, res: Response) => {
    try {
        const { id } = req.body; // Extracting the user ID from the request body
        console.log(id);
        // Finding all posts owned by the user with the specified ID
        const allPosts = await Post.find({ owner: id });
        return res.json(allPosts); // Returning the found posts
    } catch (error) {
        return res.status(500).send((error as Error).message); // Handling errors
    }
}

// Validation schema for creating a new post
const createPostBodySchema = z.object({
    id: z.string(), // User ID
    content: z.string().max(1000).min(3) // Content of the post
});

//@description     Create your post
//@route           POST /api/post/
//@access          Protected

const createPostController = async (req: Request, res: Response) => {
    try {
        const postData = createPostBodySchema.safeParse(req.body); // Parsing and validating the request body
        console.log(postData);
        if (!postData.success) {
            return res.status(400).send(postData.error); // Handling validation errors
        }

        // Creating a new post using the provided data
        const post = await Post.create({
            owner: postData.data.id, // Assigning the post to the specified user
            content: postData.data.content // Setting the content of the post
        });

        console.log(post);
        return res.status(201).json(post); // Returning the created post
    } catch (error) {
        return res.send((error as Error).message); // Handling errors
    }
}

// Validation schema for updating a post
const paramSchema = z.object({
    postId: z.string() // ID of the post to be updated
})

//@description     Update your post
//@route           PUT /api/post/:postId
//@access          Protected

const updatePostController = async (req: Request, res: Response) => {
    try {
        const postId = paramSchema.safeParse(req.params); // Parsing and validating the post ID
        if (!postId.success) {
            return res.status(400).send(postId.error); // Handling validation errors
        }
        const postData = createPostBodySchema.safeParse(req.body); // Parsing and validating the request body
        if (!postData.success) {
            return res.status(400).send(postData.error); // Handling validation errors
        }
        // Finding and updating the post with the specified ID
        const updatedPost = await Post.findByIdAndUpdate(
            postId.data.postId,
            {
                content: postData.data.content // Updating the content of the post
            },
            {
                new: true // Returning the updated post
            }
        )

        if (!updatedPost) {
            return res.status(404).send('Post Not Found'); // Handling case where post is not found
        } else {
            return res.status(200).json(updatedPost); // Returning the updated post
        }

    } catch (error) {
        return res.send((error as Error).message); // Handling errors
    }
}

//@description     Delete your post
//@route           DELETE /api/post/:postId
//@access          Protected

const deletePostController = async (req: Request, res: Response) => {
    try {
        const postId = paramSchema.safeParse(req.params); // Parsing and validating the post ID
        if (!postId.success) {
            return res.status(400).send(postId.error); // Handling validation errors
        }

        await Post.findByIdAndDelete(
            postId.data.postId // Deleting the post with the specified ID
        )

        return res.status(200).send('post deleted successfully'); // Sending success message
    } catch (error) {
        return res.send((error as Error).message); // Handling errors
    }
}

//@description     Get latest posts of the people you follow
//@route           GET /api/chat/latestPosts
//@access          Protected
const latestPostsController = async (req: Request, res: Response) => {
    try {
        const latestPost = await Follow.aggregate([
            {
                $match: { followerId: req.body.id } // Matching the followerId with the provided userId
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
                $unwind: '$posts' // Unwinding the posts array
            },
            {
                $sort: { 'posts.createdAt': -1 } // Sorting posts by createdAt in descending order
            },
            {
                $limit: 5 // Limiting to only one post, which is the latest
            },
            {
                $project: {
                    _id: 0, // Excluding the _id field
                    latestPost: '$posts' // Renaming the field to latestPost
                }
            }
        ]);

        if (latestPost.length === 0) {
            return res.status(404).json({ message: 'No latest post found for the user you follow.' }); // Handling case where no latest post is found
        }

        return res.status(200).json({ latestPost: latestPost[0].latestPost }); // Returning the latest post

    } catch (error) {
        res.status(500).json({ message: 'Internal server error' }) // Handling errors
    }
}

export { readPostController, createPostController, updatePostController, deletePostController, latestPostsController };
