import "dotenv/config";

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import pg from "pg";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const packageRoot = path.resolve(__dirname, "..");
const seedDir = path.join(packageRoot, "seeds", "generated");
const databaseUrl = process.env.DATABASE_URI ?? process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URI is not configured");
}

if (!fs.existsSync(seedDir)) {
  throw new Error(
    "Generated seed files not found. Run `pnpm seed:build` first.",
  );
}

const { Pool } = pg;
const pool = new Pool({
  connectionString: databaseUrl,
  ssl:
    process.env.NODE_ENV === "production"
      ? {
          rejectUnauthorized: false,
        }
      : undefined,
});

const files = fs
  .readdirSync(seedDir)
  .filter((file) => file.endsWith(".sql"))
  .sort();

try {
  for (const file of files) {
    const sql = fs.readFileSync(path.join(seedDir, file), "utf8");
    console.log(`Running ${file}`);
    await pool.query(sql);
  }
} finally {
  await pool.end();
}
