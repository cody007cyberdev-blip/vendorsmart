import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema.js";
import path from "node:path";
import fs from "node:fs";

// VendorSmart usa SQLite local. Aceitamos override via VENDORSMART_DB_URL
// para casos especificos, ignorando DATABASE_URL para evitar conflitos com
// MySQL/Postgres injetados pelo ambiente.
const envOverride = process.env.VENDORSMART_DB_URL;
const DB_PATH = envOverride && envOverride.startsWith("file:")
  ? envOverride
  : `file:${path.resolve("data/vendorsmart.db")}`;

// Garante que a pasta data/ existe
const dataDir = path.resolve("data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

export const sqliteClient = createClient({ url: DB_PATH });
export const db = drizzle(sqliteClient, { schema });
export { schema };
