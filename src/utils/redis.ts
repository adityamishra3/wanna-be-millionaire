import redis from "../config/redis"
import { PublicIdeasWithOwner } from "../types"
import { AppError } from "./errors"
import logger from "./logger"

export const blacklistToken = async (token: string, exp: number) => {
    const ttlSeconds = exp - Math.floor(Date.now()/1000)
    if (ttlSeconds>0) await redis.setEx(`blacklist:${token}`, ttlSeconds, "1")
}

export const isTokenBlacklisted = async (token: string) : Promise<boolean> => {
    // check if the token is blacklisted
    const isBlacklisted= await redis.get(`blacklist:${token}`)
    return isBlacklisted=="1"? true: false
}

export const setCachedPublicIdeas = async (ideas:PublicIdeasWithOwner[]):Promise<void> => {
    // here we get the public ideas from the db, and we set it in the cache
    await redis.setEx(`publicIdeas`, 5*60, JSON.stringify(ideas) )
    return;
}

export const getCachedPublicIdeas = async () : Promise<PublicIdeasWithOwner[] | null> => {
    const cached = await redis.get('publicIdeas');
    return cached ? JSON.parse(cached) : null
}

export const invalidatePublicIdeasCache = async (): Promise<boolean> => {
    const deletedCount = await redis.del('publicIdeas')
    if (deletedCount) {
        logger.info(`Public ideas cache invalidated`)
    } else {
        logger.info(`No cache to invalidate — already empty`)
    }
    return true  // always return true, cache miss is not an error
}