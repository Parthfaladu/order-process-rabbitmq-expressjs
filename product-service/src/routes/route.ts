import { Router, Request, Response } from "express";
import {createProduct} from "../controllers/ProductController";
import {createBuy} from "../controllers/BuyController";

const router = Router();

// Create a new product
router.get("/", (request: Request, response: Response) => {
    response.json({message: 'Hello world'});
});
router.post("/", createProduct);
router.post("/quick-buy", createBuy);

export default router;