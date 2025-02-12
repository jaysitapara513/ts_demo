import express, { Application, Request, Response, NextFunction } from "express";
const router = express.Router();

// import module 
import product from "../models/product";


// Create product
router.post("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, images, description, category_id, price, }: { name: string; images: string[]; description: string; category_id: string; price: number; } = req.body;
        await new product({ name, images, description, category_id, price, }).save();
        res.json({ message: "Product saved" })
    } catch (error) {
        next(error);
    }
});

// Update product
router.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id: string = req.params.id;
        const { name, images, description, category_id, price, }: { name: string; images: string[]; description: string; category_id: string; price: number; } = req.body;
        if (!await product.findByIdAndUpdate(id, { name, images, description, category_id, price })) {
            res.json({ message: "Product not found" })
            return;
        }
        res.json({ message: "Product Update" })
    } catch (error) {
        next(error);
    }
});

// Delete product
router.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id: string = req.params.id;
        if (await product.deleteOne({ _id: id })) {
            res.json({ message: "Product delete" })
        } else {
            res.json({ message: "Product not found" })
        }
    } catch (error) {
        next(error);
    }
});

export default router;