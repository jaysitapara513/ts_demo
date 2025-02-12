import { Request, Response, NextFunction } from "express";

const errorMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.error("Error:", err);

    if (res.headersSent) {
        return next(err);
    }

    if (req.originalUrl.startsWith("/images")) {
        res.status(err.status || 500).send("Error loading image.");
        return;
    }

    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error",
    });
};

export default errorMiddleware;
