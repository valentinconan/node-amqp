import Logger from '../../utils/logger.js'
import AmqpRunner from "../amqp-runner.js";
import ExampleConsumer from "../consumers/example-consumer.js";

const LOGGER = Logger.getLogger("ExampleProducer");

export default class ExampleProducer {

    /**
     * Produce message to amqp queue
     *
     * @param message
     * @param channel
     * @returns {Promise<void>}
     */
    static async produceMessageToAmqp(message, channel) {
        if (message) {
            LOGGER.info(`Send ${JSON.stringify(message)} message`);

            await AmqpRunner.sendMessage(JSON.stringify(message), ExampleConsumer.queueName, channel);

        }
    }

}




