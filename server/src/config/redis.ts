import Redis from "ioredis";
import { env } from "./env";

export const redis = new Redis(env.REDIS_URL, {
  maxRetriesPerRequest: null,
});

redis.on("error", (err) => console.error("Redis error", err));

// BullMQ requires its own connection with this exact option set.
export function createQueueConnection() {
  return new Redis(env.REDIS_URL, { maxRetriesPerRequest: null });
}
