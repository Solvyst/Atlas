import pg from "pg";
import { env } from "../config/env.js";

const { Pool } = pg;

if (!env.DATABASE_URI) {
  throw new Error("DATABASE_URL is required");
}

export const pgPool = new Pool({
  connectionString: env.DATABASE_URI,
  ssl: {
    rejectUnauthorized: false,
  },
  max: 10,
  idleTimeoutMillis: 30_000,
});

// Startup Health Check
export async function testPgConnection() {
  const client = await pgPool.connect();

  try {
    await client.query("select 1");
    console.log("[PG] Connection OK");
  } catch (error) {
    console.error("[PG] Connection FAILED:", error);
    throw error;
  } finally {
    client.release();
  }
}
