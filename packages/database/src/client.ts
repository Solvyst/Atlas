import "dotenv/config";

import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";

import * as schema from "./schema/index.js";

const { Pool } = pg;

const databaseUrl = process.env.DATABASE_URI ?? process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URI is not configured");
}

export const createDatabase = (connectionString: string) => {
  const pool = new Pool({
    connectionString,
    max: 10,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 10_000,
    ssl:
      process.env.NODE_ENV === "production"
        ? {
            rejectUnauthorized: false,
          }
        : undefined,
  });

  return {
    db: drizzle({
      client: pool,
      schema,
    }),
    pool,
  };
};

export const { db, pool } = createDatabase(databaseUrl);

export async function testPgConnection() {
  const client = await pool.connect();

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
