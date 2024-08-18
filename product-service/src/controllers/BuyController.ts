import { Request, Response } from 'express';
import 'dotenv/config'
import {getChannel} from '../services/rabbitmqService';

export const createBuy = async (req: Request, res: Response) => {
    try {
        const { productId, qty } = req.body;
        const channel = getChannel();

        if (!channel) {
            return res.status(500).json({ message: 'Failed to connect to message broker' });
        }

        // Send a message to the inventory queue
        channel.sendToQueue(
            process.env.INVENTORY_RABBITMQ_QUEUE || "inventory-service-queue",
            Buffer.from(JSON.stringify({ productId, qty }))
        );

        // Create a consumer for the response queue
        channel.consume("product-service-queue", (data) => {
            if (data) {
                const { status, method, orderId } = JSON.parse(data.content.toString());

                channel.ack(data);

                if (status === true) {
                    handleRequest(method, orderId, productId, qty);
                } else {
                    console.log('Failed to place order, retry after sometime.');
                }
            } else {
                console.log('Failed to place order, retry after sometime.');
            }
        }, { noAck: false });
        return res.status(200).json({ message: 'Processing order!' });
    } catch (error) {
        console.error('Error in createBuy:', error);
    }
};

const handleRequest = (method: string, orderId: string, productId: string, qty: number) => {
    if(method && methods[method]) {
        if(method === 'processPayment' || method === 'updatePaymentStatus') {
            methods[method](orderId)
        } else {
            methods[method](productId, qty);
        }
    }
}

const methods: { [key: string]: Function } = {
    placeOrder: async (productId: string, qty: number) => {
        try {
            const channel = getChannel();

            if (!channel) {
                console.log('Failed to connect to message broker');
                return;
            }

            // Send a message to the inventory queue
            channel.sendToQueue(
                process.env.ORDER_RABBITMQ_QUEUE || "order-service-queue",
                Buffer.from(JSON.stringify({ productId, qty, method: 'placeOrder' }))
            );
        } catch (error) {
            console.error('Error in placeOrder:', error);
        }
    },
    processPayment: async (orderId: string) => {
        try {
            const channel = getChannel();

            if (!channel) {
                console.log('Failed to connect to message broker');
                return;
            }

            // Send a message to the inventory queue
            channel.sendToQueue(
                process.env.PAYMENT_RABBITMQ_QUEUE || "payment-service-queue",
                Buffer.from(JSON.stringify({ orderId }))
            );
        } catch (error) {
            console.error('Error in processPayment:', error);
        }
    },
    updatePaymentStatus: async (orderId: string) => {
        try {
            const channel = getChannel();

            if (!channel) {
                console.log('Failed to connect to message broker');
                return;
            }

            // Send a message to the inventory queue
            channel.sendToQueue(
                process.env.ORDER_RABBITMQ_QUEUE || "order-service-queue",
                Buffer.from(JSON.stringify({ orderId, method: 'updatePaymentStatus' }))
            );
        } catch (error) {
            console.error('Error in updatePaymentStatus:', error);
        }
    },
    notifyUser: () => {
        console.log('Successfully placed order!');
    }
};