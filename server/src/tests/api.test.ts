import request from 'supertest';

import app from '../app';



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