import { db, schema, sqliteClient } from "../db/client.js";

async function run() {
  const res = await sqliteClient.execute("select count(*) as c from users");
  const count = res.rows?.[0]?.c ?? 0;
  console.log(`[list-users] users count = ${count}`);

  const all = await db.select().from(schema.users).orderBy(schema.users.createdAt);
  console.log("[list-users] Utilizadores na base:");
  for (const u of all) {
    console.log(`  ${u.email} — ${u.name} (${u.role})`);
  }
}

run()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("[list-users] Falhou:", err);
    process.exit(1);
  });
