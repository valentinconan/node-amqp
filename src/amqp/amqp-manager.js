import amqp from 'amqplib';
import Environment from "../utils/environment.js";
import Constants from "../utils/constants.js";
import events from 'events';
import Logger from "../utils/logger.js";

const LOGGER = Logger.getLogger("AmqpManager");
const EventEmitter = events.EventEmitter;

const maxRetry = Environment.getNumber(Constants.ENV_KEYS.RABBITMQ.CONNECT_MAX_RETRY, 10);
const interval = Environment.getNumber(Constants.ENV_KEYS.RABBITMQ.CONNECT_WAIT_FOR_RETRY, 15000);

/**
 * Common class to interact with rabbitMQ
 */
class AmqpManager {
    constructor() {
        this.amqpEventsEmitter = new EventEmitter();
        this.amqpEventsEmitter.setMaxListeners(0);
    }

    /**
     * Returns the amqp client from RabbitMQ
     * @returns {{connect?: function(*=, *=): Promise<ChannelModel>, credentials?: {plain?, amqplain?, external?}, IllegalOperationError?: function(*, *): void}}
     */
    getAmqp() {
        return amqp;
    }

    /**
     * Returns the handler of event emitter in order to watch them
     * @returns {*}
     */
    getEventsEmitter() {
        return this.amqpEventsEmitter;
    }

    /**
     * Construct amqp url with env variables
     * @returns {string}
     */
    getAmqpUrl() {
        const url =
            'amqp://' +
            Environment.get(Constants.ENV_KEYS.RABBITMQ.USERNAME, 'guest') +
            ':' +
            Environment.get(Constants.ENV_KEYS.RABBITMQ.PASSWORD, 'guest') +
            '@' +
            Environment.get(Constants.ENV_KEYS.RABBITMQ.HOST, 'rabbitmq') +
            ':' +
            Environment.get(Constants.ENV_KEYS.RABBITMQ.PORT, 5672) +
            '/' +
            Environment.get(Constants.ENV_KEYS.RABBITMQ.VHOST, '/');

        LOGGER.debug('RabbitMQ server url is:', url);
        return url;
    }

    /**
     * Connect to RabbitMQ, manage errors and retries
     *
     * @returns {Promise<*>}
     */
    async connect(connectionNbTry=0) {
        try {
            connectionNbTry++;
            this.connection = await this.getAmqp().connect(this.getAmqpUrl());
            LOGGER.info('Connection to AMQP succeed');
            this.amqpEventsEmitter.emit('connected');
            connectionNbTry = 0;

            // Reconnection management
            this.connection.on('error', (error) => {
                LOGGER.error('Error with amqp connection');
                LOGGER.error(error);
            });

            this.connection.on('close', () => {
                LOGGER.error('close connection');
                if (connectionNbTry === 0) {
                    this.connect();
                }
            });

            return this.connection;
        } catch (error) {
            if (connectionNbTry <= maxRetry) {
                LOGGER.warn('AMQP connection has failed, try ' + connectionNbTry + '/' + maxRetry + '. Retry in ' + (interval / 1000) + 's');
                // Wait a period of time
                await new Promise((resolve) => {
                    setTimeout(() => {
                        resolve();
                    }, interval);
                });

                return this.connect(connectionNbTry);
            } else {
                LOGGER.fatal('Unable to connect rabbitMQ', error);

                setTimeout(() => {
                    process.exit(1);
                }, 0);
            }
        }
    }

    /**
     * Create a new channel
     * @returns {Promise<*>}
     */
    async createChannel() {
        try {
            return await this.connection.createChannel();
        } catch (error) {
            LOGGER.error('Unable to create the rabbitMQ channel', error);
        }
    }

    /**
     * Send a message in an existing queue
     *
     * @param channel The channel that hold the queues
     * @param queueName the destination queue for messages
     * @param message the data to produce in the queue
     * @returns {Promise<void>}
     */
    async sendMessage(channel, queueName, message) {
        await channel.sendToQueue(queueName, Buffer.from(message),{persistent: true});
    }
}

export default new AmqpManager();
