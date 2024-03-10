import request from 'supertest';

import app from '../app';
import { Follow } from '../models'
import mongoose from 'mongoose';

let user1Token: string;
let user2Id: string;

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