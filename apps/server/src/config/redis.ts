import type { QueueOptions, RedisOptions, WorkerOptions } from "bullmq";
import { QueueEvents } from "bullmq";
import { env } from "./env.js";

export const BULL_PREFIX = env.BULL_PREFIX;

/*************************** REDIS CONNECTION ***************************/
export function redisConn(): RedisOptions {
  const url = env.REDIS_URL?.trim();

  if (url) {
    return { url } as RedisOptions;
  }

  return {
    host: env.REDIS_HOST || "127.0.0.1",
    port: Number(env.REDIS_PORT || 6379),
    password: process.env.REDIS_PASSWORD || undefined,
    tls: env.REDIS_TLS === "true" ? {} : undefined,
  };
}

/*************************** BULL QUEUE OPTIONS ***************************/
export function bullQueueOpts(): QueueOptions {
  return {
    connection: redisConn(),
    prefix: BULL_PREFIX,
    defaultJobOptions: {
      attempts: Number(env.EMAIL_QUEUE_RETRY ?? 3),
      backoff: { type: "exponential", delay: 3000 },
      removeOnComplete: 1000,
      removeOnFail: 2000,
    },
  };
}

/*************************** BULL WORKER OPTIONS ***************************/
export function bullWorkerOpts(): WorkerOptions {
  return {
    connection: redisConn(),
    prefix: BULL_PREFIX,
    concurrency: Number(env.EMAIL_QUEUE_CONCURRENCY ?? 5),
    lockDuration: 60_000,
  };
}

/*************************** QUEUE EVENTS ***************************/
export function makeQueueEvents(name: string) {
  const events = new QueueEvents(name, {
    connection: redisConn(),
    prefix: BULL_PREFIX,
  });

  events.on("completed", ({ jobId }) => {
    console.log(`[queue:${name}] job ${jobId} completed`);
  });

  events.on("failed", ({ jobId, failedReason }) => {
    console.error(`[queue:${name}] job ${jobId} failed: ${failedReason}`);
  });

  return events;
}

/*************************** TIMEOUT ***************************/
export function withTimeout<T>(promise: Promise<T>, ms: number) {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(
      () => reject(new Error(`Job timed out after ${ms}ms`)),
      ms,
    );

    promise
      .then((value) => {
        clearTimeout(timer);
        resolve(value);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
}
