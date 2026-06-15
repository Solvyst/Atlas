import { Kysely, PostgresDialect } from "kysely";
import type { DB } from "./types/types.js";
import { pgPool } from "./pg.js";

export const db = new Kysely<DB>({
  dialect: new PostgresDialect({
    pool: pgPool,
  }),
});
