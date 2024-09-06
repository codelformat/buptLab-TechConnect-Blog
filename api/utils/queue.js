// /api/utils/queue.js
import amqp from 'amqplib';

let channel, connection;

export const connectQueue = async () => {
  try {
    connection = await amqp.connect(process.env.RABBITMQ_URL);
    channel = await connection.createChannel();
    console.log('Connected to RabbitMQ');
  } catch (error) {
    console.error('Failed to connect to RabbitMQ', error);
  }
};

export const sendMessageToQueue = async (queueName, message) => {
  try {
    await channel.assertQueue(queueName, { durable: true });
    channel.sendToQueue(queueName, Buffer.from(message), { persistent: true });
  } catch (error) {
    console.error('Failed to send message to queue', error);
  }
};

export const closeQueue = async () => {
  try {
    await channel.close();
    await connection.close();
  } catch (error) {
    console.error('Failed to close RabbitMQ connection', error);
  }
};