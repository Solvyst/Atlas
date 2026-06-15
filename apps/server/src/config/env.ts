export const env = {
  APP_NAME: process.env.APP_NAME!,

  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT || 5000,
  HOST: process.env.HOST,
  COOKI_DOMAIN: process.env.COOKIE_DOMAIN!,
  WEB_URL: process.env.WEB_URL!,
  SOLVYST_API_URL: process.env.SOLVYST_API_URL,

  //DATABASE URI
  DATABASE_URI: process.env.DATABASE_URI!,

  //META API
  META_API_KEY: process.env.META_API_KEY!,
  META_RATE_LIMIT_MAX: process.env.META_RATE_LIMIT_MAX,
  META_RATE_LIMIT_WINDOW_MS: process.env.META_RATE_LIMIT_WINDOW_MS,

  //REDIS
  REDIS_HOST: process.env.REDIS_HOST!,
  REDIS_PORT: process.env.REDIS_PORT!,
  REDIS_URL: process.env.REDIS_URL!,
  REDIS_TLS: process.env.REDIS_TLS!,
  BULL_PREFIX: process.env.BULL_PREFIX,
  EMAIL_QUEUE_RETRY: process.env.EMAIL_QUEUE_RETRY,
  EMAIL_QUEUE_CONCURRENCY: process.env.EMAIL_QUEUE_CONCURRENCY,
};
