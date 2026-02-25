import redis from "../config/redis"

export const blacklistToken = async (token: string, exp: number) => {
    const ttlSeconds = exp - Math.floor(Date.now()/1000)
    if (ttlSeconds>0) await redis.setEx(`blacklist:${token}`, ttlSeconds, "1")
}

export const isTokenBlacklisted = async (token: string) : Promise<boolean> => {
    // check if the token is blacklisted
    const isBlacklisted= await redis.get(`blacklist:${token}`)
    return isBlacklisted=="1"? true: false
}