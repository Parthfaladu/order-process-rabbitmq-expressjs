import Product from '../models/Product';
import {getChannel} from "../services/rabbitmqService";
import 'dotenv/config'

const QUEUE = process.env.INVENTORY_RABBITMQ_QUEUE || 'inventory-service-queue';

export const consumeQueue = () => {
    try {
        getChannel()?.consume(QUEUE, async (data) => {
            if (data) {
                const {productId, qty } = JSON.parse(data.content.toString());

                getChannel()?.ack(data);

                const status = await verifyStockUpdate(productId, qty);

                getChannel()?.sendToQueue(
                    process.env.PRODUCT_RABBITMQ_QUEUE || "product-service-queue",
                    Buffer.from(JSON.stringify({status, method: 'placeOrder'}))
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

const verifyStockUpdate = async (productId: string, qty: number) => {
    try {
        const product = await Product.findById(productId).exec();

        if(product && product.qty >= qty) {
            await Product.findByIdAndUpdate(productId, { qty: product.qty - qty}, {useFindAndModify: true});
            return true;
        }
        return false;
    } catch (error) {
        return false;
    }
}