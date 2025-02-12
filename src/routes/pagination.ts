import express, { Application, Request, Response, NextFunction } from "express";
const router = express.Router();

import product from "../models/product";

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const page: number = parseInt(req.query.page as string) || 1;
        const limit: number = parseInt(req.query.limit as string) || 10;
        const skip: number = (page - 1) * limit;
        const products = await product.find().skip(skip).limit(limit);
        res.json(products);
    } catch (error) {
        next(error);
    }
});

export default router;