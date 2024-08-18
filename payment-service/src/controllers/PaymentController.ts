import {getChannel} from '../services/rabbitmqService';

const QUEUE = process.env.PAYMENT_RABBITMQ_QUEUE || 'payment-service-queue';

export const processPayment = () =>{
    try {
        getChannel()?.consume(QUEUE, async (data) => {
            if (data) {
                const { orderId } = JSON.parse(data.content.toString());

                getChannel()?.ack(data);

                setInterval(() => {
                    // process payment
                    }, 2000);

                getChannel()?.sendToQueue(
                    process.env.PRODUCT_RABBITMQ_QUEUE || "product-service-queue",
                    Buffer.from(JSON.stringify({status: true, orderId, method: 'updatePaymentStatus'}))
                );
            }
        });
    } catch (error) {
        getChannel()?.sendToQueue(
            process.env.PRODUCT_RABBITMQ_QUEUE || "product-service-queue",
            Buffer.from(JSON.stringify({status: false}))
        );
    }
}