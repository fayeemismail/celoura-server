import Redis from 'ioredis';
import { env } from './authConfig';


const redis = new Redis({
    host: env.REDIS_HOST,
    port: env.REDIS_PORT ? parseInt(env.REDIS_PORT, 10) : undefined,
    retryStrategy(times) {
        const delay = Math.min(times * 50, 2000);
        return delay;
    },
});

redis.on('connect', () => {
    console.log('redis connected');
});

redis.on('error', (err) => {
    console.log('Redis connection error: ', err);
});

export default redis;