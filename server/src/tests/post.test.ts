import request from 'supertest';

import app from '../app';
import { User, Post, Follow } from '../models'
import mongoose from 'mongoose';

let user1Token: string;
let user2Id: string;
let postId: string;

beforeAll(async () => {
    const url = process.env.MONGO_URI;
    try {
        await mongoose.connect(url!);
        await Follow.deleteMany({});

        const loginResponse = await request(app)
            .post('/api/auth/login')
            .send({
                "email": "ashish@gmail.com",
                "password": "12345678"
            });

        user1Token = loginResponse.body.accessToken;

        const getUsersResponse = await request(app)
            .get('/api/user/allUsers?search=deewan@gmail.com')
            .set('Authorization', `Bearer ${user1Token}`);

        user2Id = getUsersResponse.body.data[0]._id;
    } catch (error) {
        console.log("Failed to connect");
    }
})


describe('POST /api/post', () => {
    it('user1 creates post', async () => {

        const postResponse = await request(app)
            .post('/api/post')
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${user1Token}`)
            .send({
                "content": "This is new Post"
            })
            .expect(201)

        expect(postResponse.body).toHaveProperty('content');
        expect(postResponse.body).toHaveProperty('_id');
        postId = postResponse.body._id;
    })
})

describe('PUT /api/post/:postId', () => {
    it('user1 creates post', async () => {

        const postResponse = await request(app)
            .put(`/api/post/${postId}`)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${user1Token}`)
            .send({
                "content": "This is UPDATED Post"
            })
            .expect(200)

        expect(postResponse.body).toHaveProperty('content');
        expect(postResponse.body).toHaveProperty('_id');
    })
})

describe('GET /api/post/latestposts', () => {
    it('gets latestPosts of all follwings', async () => {

        const postResponse = await request(app)
            .get(`/api/post/latestposts`)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${user1Token}`)
            .expect(200)

        expect(postResponse.body).toHaveProperty('message');
    })
})

describe('DELETE /api/post/:postId', () => {
    it('user1 unfollows user2', async () => {

        return request(app)
            .delete(`/api/post/${postId}`)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${user1Token}`)
            .expect('Content-Type', /json/)
            .expect(200)
            .then((response) => {
                expect(response.body).toHaveProperty('message');
            })
    })
})