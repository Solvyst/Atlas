import path from "node:path";
import { fileURLToPath } from "node:url";

import dotenv from "dotenv";
import { defineConfig } from "drizzle-kit";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootEnvPath = path.resolve(__dirname, "../../.env");
const packageEnvPath = path.resolve(__dirname, ".env");

dotenv.config({ path: rootEnvPath });
dotenv.config({ path: packageEnvPath });

const databaseUrl = process.env.DATABASE_URI ?? process.env.DATABASE_URL;
const command = process.argv[2];
const canRunWithoutDatabase = command === "generate" || command === "check";

if (!databaseUrl && !canRunWithoutDatabase) {
  throw new Error("DATABASE_URI is not configured");
}

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/schema/index.ts",
  out: "./drizzle",
  dbCredentials: {
    url:
      databaseUrl ??
      "postgres://solvyst_atlas:solvyst_atlas@localhost:5432/solvyst_atlas",
  },
  migrations: {
    table: "__drizzle_migrations",
    schema: "drizzle",
  },
  strict: true,
  verbose: true,
});
