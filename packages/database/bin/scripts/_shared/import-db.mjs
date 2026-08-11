import path from "node:path";

import dotenv from "dotenv";
import pg from "pg";

import { packageRoot, workspaceRoot } from "./paths.mjs";

function quoteIdent(value) {
  return '"' + value.replaceAll('"', '""') + '"';
}

function quoteTable(tableName) {
  return tableName
    .split(".")
    .map((part) => quoteIdent(part.replaceAll('"', "")))
    .join(".");
}

function normalizeValue(value) {
  if (value === undefined) return null;
  if (value && typeof value === "object") return JSON.stringify(value);
  return value;
}

export function dataset(tableName, columns, rows, conflictColumns = ["id"], name = tableName) {
  return { name, tableName, columns, rows, conflictColumns };
}

export async function upsertRows(client, config) {
  if (!config.rows.length) return 0;

  const batchSize = Number(process.env.IMPORT_BATCH_SIZE ?? 500);
  const tableName = quoteTable(config.tableName);
  const columns = config.columns.map(quoteIdent).join(", ");
  const conflictColumns = config.conflictColumns.map(quoteIdent).join(", ");
  const updateColumns = config.columns.filter(
    (column) => !config.conflictColumns.includes(column),
  );
  const updateSql = updateColumns.length
    ? "DO UPDATE SET " +
      updateColumns
        .map((column) => quoteIdent(column) + " = EXCLUDED." + quoteIdent(column))
        .join(", ")
    : "DO NOTHING";

  let imported = 0;
  for (let index = 0; index < config.rows.length; index += batchSize) {
    const batch = config.rows.slice(index, index + batchSize);
    const values = [];
    const placeholders = batch
      .map((row, rowIndex) => {
        const params = config.columns.map((column, columnIndex) => {
          values.push(normalizeValue(row[column]));
          return "$" + (rowIndex * config.columns.length + columnIndex + 1);
        });
        return "(" + params.join(", ") + ")";
      })
      .join(", ");

    await client.query(
      "INSERT INTO " +
        tableName +
        " (" +
        columns +
        ") VALUES " +
        placeholders +
        " ON CONFLICT (" +
        conflictColumns +
        ") " +
        updateSql,
      values,
    );
    imported += batch.length;
  }

  return imported;
}

export async function runDatabaseImport(datasets) {
  dotenv.config({ path: path.join(workspaceRoot, ".env") });
  dotenv.config({ path: path.join(packageRoot, ".env") });

  const databaseUrl = process.env.DATABASE_URI ?? process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("DATABASE_URI is not configured");

  const pool = new pg.Pool({
    connectionString: databaseUrl,
    ssl:
      process.env.NODE_ENV === "production"
        ? { rejectUnauthorized: false }
        : undefined,
  });
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    for (const config of datasets) {
      const count = await upsertRows(client, config);
      console.log(config.name + " upserted " + count + " rows");
    }
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}
