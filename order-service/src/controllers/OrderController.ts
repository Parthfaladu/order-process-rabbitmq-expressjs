import {getChannel} from '../services/rabbitmqService';
import Product from "../models/Product";
import Order, {PaymentStatus} from "../models/Order";

const QUEUE = process.env.ORDER_RABBITMQ_QUEUE || 'order-service-queue';

export const handleRequest = () => {
    getChannel()?.consume(QUEUE, async (data) => {
        if (data) {
            const {method, productId, qty, orderId} = JSON.parse(data.content.toString());

            if(method === 'placeOrder') {
                methods[method](productId, qty);
            } else {
                methods[method](orderId);
            }
            getChannel()?.ack(data);
        }
    });
}

const methods: { [key: string]: Function } = {
    placeOrder: async(productId: string, qty: number) =>{
        try {
            const response = await storeOrder(productId, qty);

            if(typeof response === 'object') {
                getChannel()?.sendToQueue(
                    process.env.PRODUCT_RABBITMQ_QUEUE || "product-service-queue",
                    Buffer.from(JSON.stringify({status: true, orderId: response._id, method: 'processPayment'}))
                );
            } else {
                getChannel()?.sendToQueue(
                    process.env.PRODUCT_RABBITMQ_QUEUE || "product-service-queue",
                    Buffer.from(JSON.stringify({status: false}))
                );
            }
        } catch (error) {
            getChannel()?.sendToQueue(
                process.env.PRODUCT_RABBITMQ_QUEUE || "product-service-queue",
                Buffer.from(JSON.stringify({status: false}))
            );
        }
    },
    updatePaymentStatus: async (orderId: string) => {
        try {
            await Order.findByIdAndUpdate(orderId, {payment_status: PaymentStatus.COMPLETED});
            getChannel()?.sendToQueue(
                process.env.PRODUCT_RABBITMQ_QUEUE || "product-service-queue",
                Buffer.from(JSON.stringify({status: true, method: 'notifyUser'}))
            );
        } catch (error) {
            getChannel()?.sendToQueue(
                process.env.PRODUCT_RABBITMQ_QUEUE || "product-service-queue",
                Buffer.from(JSON.stringify({status: false}))
            );
        }
    }
}

const storeOrder = async (productId: string, qty: number) => {
    try {
        const product = await Product.findById(productId).exec();
        const newOrder = await new Order({
            product: productId,
            qty: qty,
            total: qty * product.price
        });
        return await newOrder.save();
    } catch (error) {
        return false;
    }
}