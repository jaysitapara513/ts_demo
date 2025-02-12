import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

const secret: string = "EmpyrealInfotech123";

interface User {
  _id: string;
  email: string;
}

interface TokenPayload {
  _id: string;
  email: string;
  iat: number;
  exp: number;
}

function setUser(user: User): string {
  return jwt.sign({ id: user._id, email: user.email }, secret, {
    expiresIn: "1h",
  });
}

function getUser(token: string | undefined): TokenPayload | null {
  if (!token) return null;
  try {
    return jwt.verify(token, secret) as TokenPayload;
  } catch (error) {
    return null;
  }
}

// verify token
function verifyToken(req: Request, res: Response, next: NextFunction): void {
  if (!req.headers.authorization) {
    res.status(401).json({ message: "Token not provided" });
    return;
  }
  const token: string | undefined = req.headers.authorization;
  const user: TokenPayload | null = getUser(token);
  if (!user) {
    res.status(401).json({ message: "Invalid token" });
    return;
  }
  next();
}

export { setUser, getUser, verifyToken };
