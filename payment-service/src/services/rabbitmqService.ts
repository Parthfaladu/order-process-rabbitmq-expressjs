import amqp, { Channel } from 'amqplib';
import 'dotenv/config'

let channel: Channel | null = null;

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672';
const CHANNEL_NAME = process.env.PAYMENT_RABBITMQ_QUEUE || 'payment-service-queue';

export const connectToRabbitMQ = async () => {
    try {
        const connection = await amqp.connect(RABBITMQ_URL);
        channel = await connection.createChannel();
        await channel.assertQueue(CHANNEL_NAME);
    } catch (error) {
        console.log(error);
    }
};

export const getChannel = (): Channel | null => channel;