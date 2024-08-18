import {Schema, model} from "mongoose";

export enum PaymentStatus {
    PENDING = 'pending',
    COMPLETED = 'completed',
    FAILED = 'failed'
}

const OrderSchema = new Schema(
    {
        product: { type: Schema.Types.ObjectId, ref: 'products' },
        qty: {
            type: Number,
            required: true,
        },
        total: {
            type: Number,
            required: true
        },
        payment_status: {
            type: String,
            enum: Object.values(PaymentStatus),
            required: true,
            default: PaymentStatus.PENDING
        }
    },
    { timestamps: true }
);

export default model("orders", OrderSchema);