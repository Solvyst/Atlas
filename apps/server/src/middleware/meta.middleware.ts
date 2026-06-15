import { timingSafeEqual } from "crypto";
import type { RequestHandler } from "express";

import { AppError } from "@/lib/AppError.js";

const requests = new Map<string, { count: number; resetAt: number }>();

function getMetaApiKey() {
  return process.env.META_API_KEY;
}

function getRateLimitConfig() {
  return {
    max: Number(process.env.META_RATE_LIMIT_MAX ?? 120),
    windowMs: Number(process.env.META_RATE_LIMIT_WINDOW_MS ?? 60_000),
  };
}

function isSameSecret(input: string, expected: string) {
  const inputBuffer = Buffer.from(input);
  const expectedBuffer = Buffer.from(expected);

  if (inputBuffer.length !== expectedBuffer.length) return false;
  return timingSafeEqual(inputBuffer, expectedBuffer);
}

/*************************** META RATE LIMIT ***************************/
export const metaRateLimit: RequestHandler = (req, res, next) => {
  const { max, windowMs } = getRateLimitConfig();
  const now = Date.now();
  const key = `${req.ip}:${req.header("x-api-key") ?? "anonymous"}`;
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
  const expectedApiKey = getMetaApiKey();
  const apiKey = req.header("x-api-key");

  if (!expectedApiKey || !apiKey || !isSameSecret(apiKey, expectedApiKey)) {
    return next(AppError.unauthorized("Invalid API key"));
  }

  return next();
};
