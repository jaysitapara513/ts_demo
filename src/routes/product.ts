import express, { Application, Request, Response, NextFunction } from "express";
const router = express.Router();

// import module 
import product from "../models/product";
import fileModel from "../models/files";

interface ProductResponse {
    name: string;
    description: string;
    category_id: string;
    price: number;
    image: {
        fileName: string;
        fileUrl: string;
    } | null;
}

interface ProductData {
    name: string;
    description: string;
    category_id: string;
    price: number;
    images: string;
}

interface ImageData {
    fileName: string;
    fileUrl: string;
}

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

// Get API
router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const productId: string = req.params.id;
        const productData: ProductData | null = await product.findById(productId);
        if (!productData) {
            res.json({ message: "Product not found" });
            return;
        }
        const imageData: ImageData | null = await fileModel.findById(productData.images);
        if (!imageData) {
            res.json({ message: "Image not found" });
            return;
        }

        const response: ProductResponse = {
            category_id: productData.category_id,
            name: productData.name,
            description: productData.description,
            price: productData.price,
            image: {
                fileName: imageData.fileName,
                fileUrl: imageData.fileUrl
            }
        };
        res.json(response);
    } catch (error) {
        next(error);
    }
});


export default router;