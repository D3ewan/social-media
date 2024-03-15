import request from 'supertest';
import app from '../app';
import { User, Post, Follow } from '../models';
import mongoose from 'mongoose';

let user1Token: string;
let user2Id: string;
let postId: string;
let token: string;

beforeAll(async () => {
    const url = process.env.MONGO_URI as string;
    try {
        await mongoose.connect(url);
        await User.deleteMany({});
        await Follow.deleteMany({});

        const user1Response = await request(app)
            .post('/api/auth/signup')
            .send({
                "name": "Ashish Rout",
                "email": "ashish@gmail.com",
                "password": "12345678",
                "bio": "I am from AIT"
            });

        const user2Response = await request(app)
            .post('/api/auth/signup')
            .send({
                "name": "Deewan Singh",
                "email": "deewan@gmail.com",
                "password": "12345678",
                "bio": "I am from AIT"
            });

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


describe('Authentcation', () => {
    it('signups user', async () => {
        return request(app)
            .get('/')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then((response) => {
                expect(response.body).toHaveProperty('message');
            })
    })
})


describe('POST /api/auth/signup', () => {
    it('creates a new user', async () => {

        const user1Response = await request(app)
            .post('/api/auth/signup')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .send({
                "name": "Aman",
                "email": "aman@gmail.com",
                "password": "Aman@1234",
                "bio": "I am from AIT"
            })
            .expect(201)

        expect(user1Response.body).toHaveProperty('email');
        expect(user1Response.body).toHaveProperty('name');
        expect(user1Response.body).toHaveProperty('bio');
    })
})

describe('POST /api/auth/login', () => {
    it('user logs in', async () => {

        const tokenResponse = await request(app)
            .post('/api/auth/login')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .send({
                "email": "aman@gmail.com",
                "password": "Aman@1234"
            })
            // .expect('Content-Type', /json/)
            .expect(200)

        expect(tokenResponse.body).toHaveProperty('accessToken');
        token = tokenResponse.body.accessToken;
    })
})

describe('DELETE /api/auth/logout', () => {
    it('user logs out', async () => {
        return request(app)
            .post('/api/auth/logout')
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .expect('Content-Type', /json/)
            .expect(200)
            .then((response) => {
                expect(response.body).toEqual({
                    "message": "user logged out"
                })
            })
    })
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


describe('POST /api/followRouter/follow', () => {
    it('user1 follows user2', async () => {

        return request(app)
            .post('/api/followRouter/follow')
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${user1Token}`)
            .send({
                "userId": `${user2Id}`
            })
            .expect(200)
            .then((response) => {
                expect(response.body).toHaveProperty('message');
            })
    })
})

describe('DELETE /api/followRouter/unfollow', () => {
    it('user1 unfollows user2', async () => {

        return request(app)
            .delete('/api/followRouter/unfollow')
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${user1Token}`)
            .expect('Content-Type', /json/)
            .send({
                "userId": `${user2Id}`
            })
            .expect(200)
            .then((response) => {
                expect(response.body).toHaveProperty('message');
            })
    })
})

describe('GET /api/followRouter/follower', () => {
    it('get all followers of user1', async () => {

        return request(app)
            .get('/api/followRouter/follower')
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${user1Token}`)
            .expect(200)
            .then((response) => {
                expect(response.body).toHaveProperty('message');
            })
    })
})

describe('GET /api/followRouter/following', () => {
    it('get all followings of user1', async () => {

        return request(app)
            .get('/api/followRouter/following')
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${user1Token}`)
            .expect(200)
            .then((response) => {
                expect(response.body).toHaveProperty('message');
            })
    })
})


describe('GET /api/user', () => {
    it('gets user1 info', async () => {

        const userResponse = await request(app)
            .get('/api/user')
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${user1Token}`)
            .expect(200)

        expect(userResponse.body).toHaveProperty('email');
        expect(userResponse.body).toHaveProperty('name');
    })
})

describe('PATCH /api/user', () => {
    it('updates user1 info', async () => {

        const userResponse = await request(app)
            .get('/api/user')
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${user1Token}`)
            .send({
                "email": "ashish@gmail.com",
                "password": "12345678"
            })
            .expect(200)

        expect(userResponse.body).toHaveProperty('email');
        expect(userResponse.body).toHaveProperty('name');
    })
})

describe('DELETE /api/user', () => {
    it('user1 gets deleted', async () => {

        return request(app)
            .delete(`/api/user`)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${user1Token}`)
            .expect('Content-Type', /json/)
            .expect(200)
            .then((response) => {
                expect(response.body).toHaveProperty('message');
            })
    })
})