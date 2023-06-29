import express from 'express';
import ExampleProducer from '../amqp/producers/example-producer.js';
import AmqpRunner from '../amqp/amqp-runner.js'
import Logger from "../utils/logger.js";

const LOGGER = Logger.getLogger("AmqpRouter")

export default class AmqpRouter extends express.Router {
    constructor() {
        super();
        this.get('/produce', async (request, response) => {

            LOGGER.info("Sending test message from rest api");
            await ExampleProducer.produceMessageToAmqp({
                message: 'test'
            },AmqpRunner.amqpContext.channels[0]);

            response.sendStatus(200);
        });

        this.post('/produce', async (request, response) => {

            LOGGER.info(`Sending received message ${JSON.stringify(request?.body)}`);

            await ExampleProducer.produceMessageToAmqp(request?.body ,AmqpRunner.amqpContext.channels[0]);

            response.sendStatus(200);
        });
    }
}