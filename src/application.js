import express from 'express';
import Logger from './utils/logger.js';
import MainRouter from './routes/main-router.js';
import AmqpRunner from './amqp/amqp-runner.js';
import cors from 'cors';

const LOGGER = Logger.getLogger('application');

export default class Application {
    constructor() {
        this.application = express();
        this.application.use(express.json());

        this.application.use(cors({
            origin: '',
            allowedHeaders: '*',
            methods: ['GET', 'OPTIONS']
        }));

        this.application.use('/amqp', new MainRouter())

        this.amqpRunner = AmqpRunner;
    }

    run(port) {
        this.application.listen(port, () => {
            LOGGER.info(`Server start on port ${port}`);

            //start runners
            this.amqpRunner.run();
        });
    }
}