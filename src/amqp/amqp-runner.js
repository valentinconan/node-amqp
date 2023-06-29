import AmqpManager from "./amqp-manager.js";
import Consumer from "./consumers/example-consumer.js";
import Environment from "../utils/environment.js";
import Constants from "../utils/constants.js";


class AmqpRunner {
    constructor() {
        this.amqpContext = {
            amqpConnector: null,
            connection: null,
            channels: [],
            queues: []
        };
        this.isInitialized = false;

        this.handlers = {};
        this.channelQuantity = Environment.getNumber(Constants.ENV_KEYS.RABBITMQ.CHANNEL_QUANTITY, 1);

    }

    async run() {
        this.handlers[Consumer.queueName] = Consumer;
        
        this.options = {
            queues: [
                {
                    queueName: Consumer.queueName,
                    conf: {
                        durable: true,
                        queueMode: 'lazy'
                    },
                    consumer: true
                },
                {
                    queueName: Consumer.errorQueueName,
                    conf: {
                        durable: true,
                        queueMode: 'lazy'
                    },
                    consumer: false
                }
            ]
        };
        
        this.amqpContext.amqpConnector = AmqpManager;
        this.amqpContext.amqpConnector.getEventsEmitter().on('connected', async () => {
            await this.instantiateChannel();
            await this.instantiateQueues();

            if (!this.isInitialized) {
                this.isInitialized = true;
            }
        });

        this.amqpContext.connection = this.amqpContext.amqpConnector.connect();
    }

    async instantiateChannel() {
        this.amqpContext.channels = [];
        let channel;

        for (let i = 0; i < this.channelQuantity; i++){
            channel = await this.amqpContext.amqpConnector.createChannel();
            this.amqpContext.channels.push(channel);
        }
    }

    async instantiateQueues() {
        this.amqpContext.queues = [];

        if (Array.isArray(this.options.queues)) {
            for (const queue of this.options.queues) {

                for (let i = 0; i < this.channelQuantity; i++) {
                    this.amqpContext.channels[i].qos(Environment.getNumber(Constants.ENV_KEYS.RABBITMQ.CHANNEL_PREFETCH_COUNT, 1), false);
                    this.amqpContext.queues[queue.queueName] = await this.amqpContext.channels[i].assertQueue(
                        queue.queueName,
                        queue.conf
                    );

                    if(queue.consumer) {
                        this.amqpContext.channels[i].consume(
                            queue.queueName,
                            function (msg) {
                                this.onMessageReceived(msg, queue.queueName, this.amqpContext.channels[i]);
                                this.amqpContext.channels[i].ack(msg);
                            }.bind(this),
                            {
                                noAck: false
                            });
                    }
                }
            }
        }
    }

    onMessageReceived(msg, queueName, channel) {
        const handler = this.instantiateAmqpHandler(queueName);
        handler.consume(msg, this.amqpContext, channel);
    }

    // Instantiate an AMQP handler 
    instantiateAmqpHandler(queueName) {
        return this.handlers[queueName];
    }

    /**
     * Send message in a queue
     * @param message
     * @param queueName
     * @param channel
     * @returns {Promise<void>}
     */
    async sendMessage(message, queueName, channel) {
        await this.amqpContext.amqpConnector.sendMessage(channel, queueName, message);
    }
}

export default new AmqpRunner();
