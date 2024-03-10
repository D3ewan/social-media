import request from 'supertest';

import app from '../app';
import { User } from '../models'
import mongoose from 'mongoose';

beforeAll(async () => {
    const url = process.env.MONGO_URI;
    try {
        await mongoose.connect(url!);
        await User.deleteMany({})
    } catch (error) {
        console.log("Failed to connect");
    }
})

let token: string;

describe('POST /api/auth/signup', () => {
    it('creates a new user', async () => {

        const user1Response = await request(app)
            .post('/api/auth/signup')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .send({
                "name": "Ashish Rout",
                "email": "ashish@gmail.com",
                "password": "12345678",
                "bio": "I am from AIT"
            })
            .expect(201)

        expect(user1Response.body).toHaveProperty('email');
        expect(user1Response.body).toHaveProperty('name');
        expect(user1Response.body).toHaveProperty('bio');


        const user2Response = await request(app)
            .post('/api/auth/signup')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .send({
                "name": "Deewan Singh",
                "email": "deewan@gmail.com",
                "password": "12345678",
                "bio": "I am from AIT"
            })
            .expect(201)

        expect(user2Response.body).toHaveProperty('email');
        expect(user2Response.body).toHaveProperty('name');
        expect(user2Response.body).toHaveProperty('bio');
    })
})

describe('POST /api/auth/login', () => {
    it('user logs in', async () => {

        const tokenResponse = await request(app)
            .post('/api/auth/login')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .send({
                "email": "deewan@gmail.com",
                "password": "12345678"
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