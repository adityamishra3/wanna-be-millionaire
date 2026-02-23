import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/errors";
import logger from "../utils/logger";
export const errorMiddleware = (error:Error, req: Request, res: Response, next: NextFunction) => {
    // console.error(error)
    logger.error(error, `${req.method} | ${req.url}`)

    if (error instanceof AppError) {
        res.status(error.statusCode).json({
            success: false, 
            message: error.message
        })
        return;
    }

    // unknown error
    res.status(500).json({
        success: false,
        message: "Internal server error"
    })
}