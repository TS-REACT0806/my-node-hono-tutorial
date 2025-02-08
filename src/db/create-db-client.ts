import dotenv from "dotenv";
import { Kysely, PostgresDialect } from "kysely";
import pg from "pg";

import { DB } from "./types";

dotenv.config();

export function createDbClient() {
  const dbClient = new Kysely<DB>({
    dialect: new PostgresDialect({
      pool: new pg.Pool({ connectionString: process.env.DB_URL }),
    }),
  });

  return dbClient;
}

export type DbClient = ReturnType<typeof createDbClient>;
