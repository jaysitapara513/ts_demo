import express, { Request, Response, NextFunction } from "express";
const router = express.Router();
import fs from "fs";
import path from "path";
import multer, { StorageEngine } from "multer";

// import module
import fileModel from "../models/files";

// upload directory
const uploadPath: string = path.join(__dirname, "../public/images");
const imageStore: string[] = [];

interface FileRequest extends Request {
    file?: Express.Multer.File;
}

// check directory
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath);
}

const storage: StorageEngine = multer.diskStorage({
    destination: (req: FileRequest, file: Express.Multer.File, cb: Function) => {
        cb(null, uploadPath);
    },
    filename: (req: FileRequest, file: Express.Multer.File, cb: Function) => {
        const filePath: string = path.join(uploadPath, file.originalname);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
        cb(null, file.originalname);
    },
});

const upload: multer.Multer = multer({
    storage,
    fileFilter: (req: FileRequest, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
        const filetypes: RegExp = /jpg|jpeg|png/;
        const extname: boolean = filetypes.test(path.extname(file.originalname).toLowerCase());
        if (extname) {
            cb(null, true);
        } else {
            cb(new Error("add only JPG, PNG, JPEG files"));
        }
    }
});

router.post("/", upload.single("file"), async (req: FileRequest, res: Response, next: NextFunction) => {
    try {
        if (!req.file) {
            res.json({ message: "No file uploaded" });
            return;
        }
        if (imageStore.length > 0) {
            const oldImagePath: string = imageStore[0];
            fs.unlink(oldImagePath, (err) => {
                if (err) {
                    res.json({ message: "Error deleting old image" });
                }
            });
            imageStore.pop();
        }
        imageStore.push(req.file.path);
        const fileName: string = req.file.filename;
        const fileUrl: string = `/images/${req.file.filename}`;
        await new fileModel({ fileName, fileUrl }).save();
        res.json({ message: "File uploaded successfully", fileName, fileUrl });

    } catch (error) {
        next(error);
    }
});

export default router;