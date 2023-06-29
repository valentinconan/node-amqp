# node-amqp

## Main purpose
This project is an example of a quick-start project developed in node, using AMQP protocol through rabbitmq instance

## Technical details

Two dockers are generated:
- one based on the official `node` image
- one based on the official `apline` image and embedding a native version of the node application, build with `pkg`

Each dockerfile builds the application directly

## How to test it

### predefine message
Create an AMQP message test using the api rest :

```
curl http://localhost:3000/amqp/produce
```

Check the logs, the message have been produced and consumed, using respectively the `example-producer.js -` and `example-consumer.js`

### send whatever you want

#### message ok
```
curl --data '{"message":"consume me please"}' -H 'Content-Type: application/json' http://localhost:3000/amqp/produce
```

#### message ko, redirected to error queue
```
curl --data '{"fail":true}' -H 'Content-Type: application/json' http://localhost:3000/amqp/produce
```