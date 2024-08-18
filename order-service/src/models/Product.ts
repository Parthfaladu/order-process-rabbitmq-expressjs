import {Schema, model} from "mongoose";

const ProductSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        qty: {
            type: Number,
            required: true
        }
    },
    { timestamps: true }
);

export default model("products", ProductSchema);