import "dotenv/config";
import { defineConfig } from "drizzle-kit";

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
    url: databaseUrl ?? "postgres://atlaskit:atlaskit@localhost:5432/atlaskit",
  },
  migrations: {
    table: "__drizzle_migrations",
    schema: "drizzle",
  },
  strict: true,
  verbose: true,
});
