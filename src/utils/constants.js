export default class Constants {
    static LOG_LEVEL = "LOG_LEVEL";

    static ENV_KEYS = {
        APP_VERSION: 'APP_VERSION',
        RABBITMQ: {
            CONNECT_MAX_RETRY: 'RABBITMQ_CONNECT_MAX_RETRY',
            CONNECT_WAIT_FOR_RETRY: 'RABBITMQ_CONNECT_WAIT_FOR_RETRY',
            HOST: 'RABBITMQ_HOST',
            PORT: 'RABBITMQ_PORT',
            VHOST: 'RABBITMQ_VHOST',
            USERNAME: 'RABBITMQ_USERNAME',
            PASSWORD: 'RABBITMQ_PASSWORD',
            QUEUES: {
                SAMPLE: {
                    NAME: 'RABBITMQ_SAMPLE_MESSAGE_QUEUE',
                    ERROR: 'RABBITMQ_SAMPLE_MESSAGE_QUEUE_ERROR'
                }
            },
            CHANNEL_QUANTITY: 'RABBITMQ_CHANNEL_QUANTITY',
            CHANNEL_PREFETCH_COUNT: 'RABBITMQ_CHANNEL_PREFETCH_COUNT'
        }
    }

}
