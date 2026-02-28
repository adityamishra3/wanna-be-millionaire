import { rateLimit } from "express-rate-limit";
import { createRateLimitMiddlewareOptions } from "../types/rateLimit";
import {RedisStore} from 'rate-limit-redis'
import redis from "../config/redis";


export const createRateLimitMiddleware = (
  options?: Partial<createRateLimitMiddlewareOptions>,
) => {
  const limiter = rateLimit({
    // this function returns a middlware internally, hence we dont need to write the next() function call manually.
    windowMs: options?.windowMs || 15 * 60 * 1000, // 15 mins
    limit: options?.limit || 100, // Limit each IP to 100 request per 15 mins window
    message: options?.message || "Too many requests, please try again later.",
    standardHeaders: true,
    legacyHeaders: false,
    store: new RedisStore({
      sendCommand: (...args: string[]) => redis.sendCommand(args),
    })
  });
  return limiter;
};
