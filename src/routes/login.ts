import express, { Request, Response, NextFunction } from "express";
const router = express.Router();
import bcrypt from "bcrypt";

// import module 
import User from "../models/user";
import { setUser, getUser } from "../middleware/auth";

// login user
interface UserLogin extends Document {
    _id: string;
    email: string;
    password: string;
}
router.post("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password }: { email: string; password: string } = req.body;
        const login: UserLogin | null = await User.findOne({ email });
        if (!login) {
            res.json({ message: "User not found" });
            return
        }
        if (await bcrypt.compare(password, login.password)) {
            const token: string = setUser(login);
            res.cookie("uid", token);
            res.json({ message: "User login successfully", token });
        } else {
            res.json({ message: "Invalid password" });
        }
    } catch (error) {
        next(error);
    }
});

// get login user profile
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.cookies.uid || !getUser(req.cookies.uid)) {
            res.json({ message: "Invalid token" });
        } else {
            res.json(getUser(req.cookies.uid));
        }
    } catch (error) {
        next(error);
    }
});

// update user profile with verifyToken
router.put("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.cookies.uid || !getUser(req.cookies.uid)) {
            res.json({ message: "Invalid token" });
        } else {
            const { email, password }: { email: string; password: string } = req.body;
            const user: UserLogin | null = await User.findOne({ email });
            if (!user) {
                res.json({ message: "User not found" });
                return;
            }
            if (await bcrypt.compare(password, user.password)) {
                res.json({ message: "User updated successfully" });
            } else {
                res.json({ message: "Invalid password" });
            }
        }
    } catch (error) {
        next(error);
    }
});

export default router;