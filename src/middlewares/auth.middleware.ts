import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import { ForbiddenError, UnauthorizedError } from "../utils/errors";
import { isTokenBlacklisted } from "../utils/redis";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log("Auth middleware hit, token:", req.cookies.token)
  const token = req.cookies.token;

  if (!token) throw new UnauthorizedError("No token provided");

  //check if token is blacklisted
  const blacklisted = await isTokenBlacklisted(token)
  if (blacklisted) throw new UnauthorizedError("Token Blacklisted")

  // call verifyToken and get the userId
  const tokenPayload = await verifyToken(token);
  if (!tokenPayload?.userId) throw new UnauthorizedError("Invalid Token");

  req.userId = tokenPayload.userId; // its either a string or undefined type, as we have declared in the extended interface of Request (from express).
  req.exp = tokenPayload.exp
  next();
};
