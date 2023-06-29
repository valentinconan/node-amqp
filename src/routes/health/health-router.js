import express from 'express';

export default class HealthRouter extends express.Router {
    constructor() {
        super();
        this.get('/info', (request, response) => {
            response.status(200).json({
                state: 'UP',
                version: '0.1.0'
            }).end();
        });

        this.get('/ping', (request, response) => {
                response.sendStatus(200);
        });
    }
}