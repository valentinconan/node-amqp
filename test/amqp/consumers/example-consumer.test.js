import {jest} from "@jest/globals";
import ExampleConsumer from "../../../src/amqp/consumers/example-consumer.js";

describe('example consumer test', () => {


    it('should consume the message', async () => {

        //create buffer of message in order to simulate's
        //amqp server behavior
        let message = {
                content: Buffer.from(JSON.stringify({
                    message: "consume me"
                }))
            };

        await ExampleConsumer.consume(message);
    });

});
