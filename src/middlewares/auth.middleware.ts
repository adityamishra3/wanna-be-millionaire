import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      res.status(401).json({ success: false, message: "No token provided" });
      return;
    }

    // call verifyToken and get the userId
    const userId = await verifyToken(token);
    if (!userId) {
      res.status(401).json({ success: false, message: "User not found" });
    }
    req.userId = userId // its either a string or undefined type, as we have declared in the extended interface of Request (from express).
    next()

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error!" });
  }
};
