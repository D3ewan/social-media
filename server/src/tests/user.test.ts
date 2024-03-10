import request from 'supertest';

import app from '../app';
import mongoose from 'mongoose';

let user1Token: string;
let user2Id: string;

beforeAll(async () => {
    const url = process.env.MONGO_URI;
    try {
        await mongoose.connect(url!);

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