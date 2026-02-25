import { createClient } from 'redis';
import logger from '../utils/logger';

const redis = createClient({
    url:process.env.REDIS_URL || "redis://localhost:6379"
});
redis.connect()
redis.on('connect', ()=> logger.info("Redis connected"))
redis.on('error', err => logger.error( err,'Redis Client Error'));

export default redis