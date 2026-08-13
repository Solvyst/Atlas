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

const optionalBoolean = z
  .union([z.boolean(), z.string(), z.number()])
  .optional()
  .transform((value) => {
    if (value === undefined) return undefined;
    if (typeof value === "boolean") return value;
    if (typeof value === "number") return value === 1;

    const normalized = value.trim().toLowerCase();
    if (["true", "1", "yes", "on"].includes(normalized)) return true;
    if (["false", "0", "no", "off", ""].includes(normalized)) return false;

    return undefined;
  });

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
    CORS_ORIGINS: z.string().trim().default("*"),
    DATABASE_URI: z.string().trim().min(1, "DATABASE_URI is required"),
    ATLAS_API_KEY: z.string().trim().optional(),
    META_API_KEY: z.string().trim().optional(),
    META_RATE_LIMIT_MAX: z.coerce.number().int().positive().default(120),
    META_RATE_LIMIT_WINDOW_MS: z.coerce
      .number()
      .int()
      .positive()
      .default(60_000),
    REDIS_ENABLED: optionalBoolean.default(false),
    REDIS_HOST: z.string().trim().default("127.0.0.1"),
    REDIS_PORT: z.coerce.number().int().positive().default(6379),
    REDIS_URL: optionalUrl,
    REDIS_PASSWORD: z.string().trim().optional(),
    REDIS_TLS: optionalBoolean.default(false),
    BULL_PREFIX: z.string().trim().optional(),
    EMAIL_QUEUE_RETRY: z.coerce.number().int().positive().default(3),
    EMAIL_QUEUE_CONCURRENCY: z.coerce.number().int().positive().default(5),
  })
  .superRefine((value, ctx) => {
    const apiKey = value.ATLAS_API_KEY ?? value.META_API_KEY;

    if (!apiKey || apiKey.length < 16) {
      ctx.addIssue({
        code: "custom",
        path: ["ATLAS_API_KEY"],
        message: "ATLAS_API_KEY is required",
      });
      return;
    }

    if (value.NODE_ENV === "production" && apiKey.length < 32) {
      ctx.addIssue({
        code: "custom",
        path: ["ATLAS_API_KEY"],
        message: "ATLAS_API_KEY must be at least 32 characters in production",
      });
    }
  });

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid environment configuration");
  console.error(z.treeifyError(parsed.error));
  process.exit(1);
}

export const env = {
  ...parsed.data,
  ATLAS_API_KEY: parsed.data.ATLAS_API_KEY ?? parsed.data.META_API_KEY ?? "",
};
