import supertest from 'supertest';
import Application from '../../../src/application.js';

describe('AmqpRouter endpoint', () => {
    let app;
    beforeAll(() => {
        app = new Application().application;
    });

    it('should return status 200 on /amqp/info', async () => {
        const res = await supertest(app).get("/amqp/info");
        expect(res.statusCode).toEqual(200);
    });
});