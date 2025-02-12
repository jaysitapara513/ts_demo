import express, { Application, Request, Response, NextFunction } from "express";
const router = express.Router();
import bcrypt from "bcrypt";

// import module 
import User from "../models/user";

// register user
async function registerUser(req: Request, res: Response, next: NextFunction) {
    try {
        const { email, password }: { email: string; password: string } = req.body;
        if (await User.findOne({ email })) {
            res.json({ message: "User already registered" });
        }
        await User.create({ email, password: await bcrypt.hash(password, (await bcrypt.genSalt(10))) });
        res.json({ message: "User created succssfully" });
    } catch (error) {
        next(error);
    }
}
router.post("/", registerUser);

export default router;