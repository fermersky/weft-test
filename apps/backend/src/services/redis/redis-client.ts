import { Redis } from "ioredis";

export const redisClient = new Redis({
  maxRetriesPerRequest: null,
  lazyConnect: true,
  host: process.env["REDIS_HOST"],
});
