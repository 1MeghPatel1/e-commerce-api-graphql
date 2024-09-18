import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../db/prisma.client";

export async function authenticateUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  const token = authHeader?.split(" ")[1] || "";
  const jwtSecret = process.env.ACCESS_SECRET as string;
  try {
    const decodedToken = jwt.verify(token, jwtSecret) as
      | {
          userId: string;
        }
      | undefined;
    if (!decodedToken) {
      req.user = null;
      return next();
    }
    const user = await prisma.user.findUnique({
      where: { id: +decodedToken.userId }
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid authorization token" });
    }

    req.user = user;

    next();
  } catch (error) {
    req.user = null;
    return next();
  }
}
