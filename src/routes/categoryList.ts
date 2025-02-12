import express, { Application, Request, Response, NextFunction } from "express";
const router = express.Router();

import category from "../models/category";

interface Category {
    _id: string;
    name: string;
    parentCategory: string | null;
}
interface CategoryNode {
    _id: string;
    name: string;
    children: CategoryNode[];
}
const getCategories = async (parentCategory: string | null): Promise<CategoryNode[]> => {
    const categories: Category[] = await category.find({ parentCategory });
    const categoryList: CategoryNode[] = [];

    for (const category of categories) {
        categoryList.push({
            _id: category._id.toString(),
            name: category.name,
            children: await getCategories(category._id),
        });
    }

    return categoryList;
};

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const categories = await getCategories(null);
        res.json(categories)
    } catch (error) {
        next(error);
    }
});
export default router;