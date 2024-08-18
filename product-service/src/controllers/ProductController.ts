import { Request, Response } from "express";
import Product from "../models/Product";

export const createProduct = async (req: Request, res: Response) => {
    try {
        const {name, price, description, qty} = req.body;
        if (!name || !price || !description || !qty) {
            return res.status(400).json({
                message: "Please provide name, price, description and qty",
            });
        }
        const newProduct = await new Product({...req.body});
        await newProduct.save();
        return res.status(201).json({
            message: "Product created successfully"
        });
    } catch (error) {
        console.log(error)
        res.json(error)
    }
}