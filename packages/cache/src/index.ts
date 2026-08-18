import { Redis, type RedisOptions } from "ioredis";

export type RedisConfig = {
  enabled: boolean;
  url?: string;
};

let redis: Redis | null = null;

function buildRedisOptions(): RedisOptions {
  return {
    maxRetriesPerRequest: 1,
    enableOfflineQueue: false,
    enableReadyCheck: true,
    lazyConnect: true,
  };
}

function usesTls(config: RedisConfig) {
  return config.url?.startsWith("rediss://") || false;
}

// REDIS CLIENT
export function getRedis(config: RedisConfig): Redis | null {
  if (!config.enabled) {
    return null;
  }

  if (!redis) {
    const options = {
      ...buildRedisOptions(),
      tls: usesTls(config) ? {} : undefined,
    };

    if (!config.url) {
      throw new Error("REDIS_URL is required when Redis is enabled");
    }

    redis = new Redis(config.url, options);

    redis.on("error", (error: Error) => {
      console.error("[Redis] Error:", error);
    });
  }

  return redis;
}

// REDIS READY CHECK
export async function ensureRedisReady(client: Redis) {
  if (client.status === "wait") {
    await client.connect();
  }
}

// REDIS CONNECTION CHECK
export async function testRedisConnection(config: RedisConfig) {
  if (!config.enabled) {
    console.log("[Redis] Disabled");
    return;
  }

  const client = getRedis(config);
  if (!client) return;

  await ensureRedisReady(client);
  await client.ping();
  console.log("[Redis] Connection OK");
}

// REDIS SHUTDOWN
export function closeRedis() {
  redis?.disconnect();
  redis = null;
}
