import { createClient } from 'redis'
import logger from '../utils/logger'

export const publisher = createClient({ url: process.env.REDIS_URL || 'redis://localhost:6379' })
export const subscriber = createClient({ url: process.env.REDIS_URL || 'redis://localhost:6379' })

export const initPubSub = async () => {
    await publisher.connect()
    await subscriber.connect()
    logger.info('Redis Pub/Sub connected')
}