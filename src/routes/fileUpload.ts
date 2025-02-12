import express, { Request, Response, NextFunction } from "express";
const router = express.Router();
import fs from "fs";
import path from "path";
import multer, { StorageEngine } from "multer";

// import module
import fileModel from "../models/files";

// upload directory
const uploadPath = path.join(__dirname, "../public/images");
interface FileRequest extends Request {
    file?: Express.Multer.File;
}
// check directory
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
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
const upload = multer({ storage });

router.post("/", upload.single("file"), async (req: FileRequest, res: Response, next: NextFunction) => {
    try {
        if (!req.file) {
            res.json({ message: "No file uploaded" });
            return;
        }
        const fileUrl: String = `/images/${req.file.filename}`;
        await fileModel.deleteMany({});
        await new fileModel({ fileUrl }).save();
        res.json({ message: "File uploaded successfully", fileUrl });

    } catch (error) {
        next(error);
    }
});

export default router;