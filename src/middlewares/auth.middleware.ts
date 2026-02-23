import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import { ForbiddenError, UnauthorizedError } from "../utils/errors";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.cookies.token;

  if (!token) throw new UnauthorizedError("No token provided");

  // call verifyToken and get the userId
  const userId = await verifyToken(token);
  if (!userId) throw new UnauthorizedError("Invalid Token");

  req.userId = userId; // its either a string or undefined type, as we have declared in the extended interface of Request (from express).
  next();
};
