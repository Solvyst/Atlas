import { timingSafeEqual } from "crypto";
import type { RequestHandler } from "express";
import { Redis } from "ioredis";

import { AppError } from "@/lib/AppError.js";
import { env } from "@/config/env.js";

const requests = new Map<string, { count: number; resetAt: number }>();
let redis: Redis | null = null;

function getAtlasApiKey() {
  return env.ATLAS_API_KEY;
}

function getRateLimitConfig() {
  return {
    max: env.META_RATE_LIMIT_MAX,
    windowMs: env.META_RATE_LIMIT_WINDOW_MS,
  };
}

function getRedis() {
  if (!env.REDIS_ENABLED) return null;
  if (redis) return redis;

  redis = env.REDIS_URL
    ? new Redis(env.REDIS_URL, {
        maxRetriesPerRequest: 1,
        enableOfflineQueue: false,
      })
    : new Redis({
        host: env.REDIS_HOST,
        port: env.REDIS_PORT,
        password: env.REDIS_PASSWORD,
        tls: env.REDIS_TLS ? {} : undefined,
        maxRetriesPerRequest: 1,
        enableOfflineQueue: false,
      });

  redis.on("error", (error: Error) => {
    console.error("[redis:rate-limit] error", error);
  });

  return redis;
}

function isSameSecret(input: string, expected: string) {
  const inputBuffer = Buffer.from(input);
  const expectedBuffer = Buffer.from(expected);

  if (inputBuffer.length !== expectedBuffer.length) return false;
  return timingSafeEqual(inputBuffer, expectedBuffer);
}

/*************************** META RATE LIMIT ***************************/
export const metaRateLimit: RequestHandler = async (req, res, next) => {
  const { max, windowMs } = getRateLimitConfig();
  const now = Date.now();
  const key = `${req.ip}:${req.header("x-api-key") ?? "anonymous"}`;
  const redisClient = getRedis();

  if (redisClient) {
    try {
      const redisKey = `rate-limit:meta:${key}`;
      const count = await redisClient.incr(redisKey);

      if (count === 1) {
        await redisClient.pexpire(redisKey, windowMs);
      }

      const ttl = await redisClient.pttl(redisKey);
      const resetAt = now + Math.max(ttl, 0);
      const remaining = Math.max(max - count, 0);

      res.setHeader("X-RateLimit-Limit", String(max));
      res.setHeader("X-RateLimit-Remaining", String(remaining));
      res.setHeader("X-RateLimit-Reset", String(Math.ceil(resetAt / 1000)));

      if (count > max) {
        return next(AppError.tooManyRequests("Too many requests"));
      }

      return next();
    } catch {
      return next(AppError.serviceUnavailable("Rate limiter unavailable"));
    }
  }

  const current = requests.get(key);

  if (!current || current.resetAt <= now) {
    requests.set(key, { count: 1, resetAt: now + windowMs });
    res.setHeader("X-RateLimit-Limit", String(max));
    res.setHeader("X-RateLimit-Remaining", String(Math.max(max - 1, 0)));
    return next();
  }

  current.count += 1;
  const remaining = Math.max(max - current.count, 0);
  res.setHeader("X-RateLimit-Limit", String(max));
  res.setHeader("X-RateLimit-Remaining", String(remaining));
  res.setHeader("X-RateLimit-Reset", String(Math.ceil(current.resetAt / 1000)));

  if (current.count > max) {
    return next(AppError.tooManyRequests("Too many requests"));
  }

  return next();
};

/*************************** REQUIRE API KEY ***************************/
export const requireApiKey: RequestHandler = (req, _res, next) => {
  const expectedApiKey = getAtlasApiKey();
  const apiKey = req.header("x-api-key");

  if (!expectedApiKey || !apiKey || !isSameSecret(apiKey, expectedApiKey)) {
    return next(AppError.unauthorized("Invalid API key"));
  }

  return next();
};
