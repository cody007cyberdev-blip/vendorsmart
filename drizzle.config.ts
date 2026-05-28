import type { Config } from "drizzle-kit";

export default {
  schema: "./server/db/schema.ts",
  out: "./server/db/migrations",
  dialect: "sqlite",
  driver: "libsql",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "file:./data/vendorsmart.db",
  },
} satisfies Config;
