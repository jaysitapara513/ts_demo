import express, { Application, Request, Response, NextFunction } from "express";
const router = express.Router();

// import module 
import category from "../models/category";

// Create category
router.post("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, parentCategory }: { name: string; parentCategory: string | null } = req.body;
        await new category({ name, parentCategory, }).save();
        res.json({ message: "Category saved" });
    } catch (error) {
        next(error);
    }
});

// Update category
router.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id: string = req.params.id;
        const { name, parentCategory }: { name: string; parentCategory: string | null } = req.body;
        if (await category.findByIdAndUpdate(id, { name, parentCategory })) {
            res.json({ message: "Category Updated" });
        } else {
            res.json({ message: "Category not found" });
        }
    } catch (error) {
        next(error);
    }
});

// Delete category
router.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id: string = req.params.id;
        if (await category.findByIdAndDelete(id)) {
            res.json({ message: "Category delete" });
        } else {
            res.json({ message: "Category not found" });
        }
    } catch (error) {
        next(error);
    }
});

export default router;