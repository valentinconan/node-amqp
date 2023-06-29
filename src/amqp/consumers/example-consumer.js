import Logger from "../../utils/logger.js";
import Environment from "../../utils/environment.js";
import Constants from "../../utils/constants.js";
import AmqpRunner from "../amqp-runner.js";

const LOGGER = Logger.getLogger("ExampleConsumer");

/**
 * ExampleConsumer
 */
class ExampleConsumer {
    constructor() {
        this.queueName = Environment.get(Constants.ENV_KEYS.RABBITMQ.QUEUES.SAMPLE.NAME, 'sample.message.send');
        this.errorQueueName = Environment.get(Constants.ENV_KEYS.RABBITMQ.QUEUES.SAMPLE.ERROR, 'sample.message.send.errors');
    }

    async redirectMessageToErrorQueue(message, channel) {
        LOGGER.warn("Redirecting the message in the error queue");
        await AmqpRunner.sendMessage(JSON.stringify(message), this.errorQueueName, channel);
    }

    /**
     * Consume the amqp message.
     * If the message contains the root node fail at true, message will be redirected to error queue
     *
     * @param message
     * @param amqpContext
     * @param channel
     * @returns {Promise<void>}
     */
    async consume(message, amqpContext, channel) {

        try {
            LOGGER.info("received message : "+message.content.toString());
            let rawMessage=JSON.parse(message.content.toString());
            if(rawMessage?.fail){
                throw "testing the error queue redirection mecanism"
            }
        } catch (e) {
            LOGGER.error("Failed to consume message. Redirecting message to Error queue", e);
            await this.redirectMessageToErrorQueue(message, channel);
        }

    }
}

export default new ExampleConsumer();
