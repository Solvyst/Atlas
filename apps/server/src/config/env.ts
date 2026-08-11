import path from "node:path";
import { fileURLToPath } from "node:url";

import dotenv from "dotenv";
import { z } from "zod";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootEnvPath = path.resolve(__dirname, "../../../../.env");
const appEnvPath = path.resolve(__dirname, "../../.env");

dotenv.config({ path: rootEnvPath });
dotenv.config({ path: appEnvPath });

const optionalUrl = z
  .string()
  .trim()
  .optional()
  .transform((value) => (value ? value : undefined));

const envSchema = z
  .object({
    APP_NAME: z.string().trim().min(1).default("Solvyst Atlas"),
    APP_VERSION: z.string().trim().min(1).default("dev"),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    PORT: z.coerce.number().int().positive().default(5000),
    HOST: z.string().trim().optional(),
    COOKIE_DOMAIN: z.string().trim().optional(),
    WEB_URL: optionalUrl,
    CORS_ORIGINS: z.string().trim().optional(),
    DATABASE_URI: z.string().trim().min(1, "DATABASE_URI is required"),
    META_API_KEY: z.string().trim().min(16, "META_API_KEY is required"),
    META_RATE_LIMIT_MAX: z.coerce.number().int().positive().default(120),
    META_RATE_LIMIT_WINDOW_MS: z.coerce
      .number()
      .int()
      .positive()
      .default(60_000),
    REDIS_ENABLED: z.coerce.boolean().default(false),
    REDIS_HOST: z.string().trim().default("127.0.0.1"),
    REDIS_PORT: z.coerce.number().int().positive().default(6379),
    REDIS_URL: optionalUrl,
    REDIS_PASSWORD: z.string().trim().optional(),
    REDIS_TLS: z.coerce.boolean().default(false),
    BULL_PREFIX: z.string().trim().optional(),
    EMAIL_QUEUE_RETRY: z.coerce.number().int().positive().default(3),
    EMAIL_QUEUE_CONCURRENCY: z.coerce.number().int().positive().default(5),
  })
  .superRefine((value, ctx) => {
    if (value.NODE_ENV === "production") {
      if (!value.WEB_URL && !value.CORS_ORIGINS) {
        ctx.addIssue({
          code: "custom",
          path: ["WEB_URL"],
          message: "WEB_URL or CORS_ORIGINS is required in production",
        });
      }

      if (value.META_API_KEY.length < 32) {
        ctx.addIssue({
          code: "custom",
          path: ["META_API_KEY"],
          message: "META_API_KEY must be at least 32 characters in production",
        });
      }
    }
  });

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid environment configuration");
  console.error(z.treeifyError(parsed.error));
  process.exit(1);
}

export const env = parsed.data;
