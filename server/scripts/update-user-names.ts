import { db, schema } from "../db/client.js";
import { eq } from "drizzle-orm";

async function run() {
  const emails = [
    "admin@vendorsmart.local",
    "manager@vendorsmart.local",
    "vendor@vendorsmart.local",
    "cliente@vendorsmart.local",
  ];

  console.log("[update-users] A atualizar nomes para 'Leonardo Fonseca'...");

  for (const email of emails) {
    await db
      .update(schema.users)
      .set({ name: "Leonardo Fonseca" })
      .where(eq(schema.users.email, email));
  }

  console.log("[update-users] Utilizadores atualizados:");
  for (const email of emails) {
    const rows = await db.select().from(schema.users).where(eq(schema.users.email, email));
    const u = rows[0];
    if (u) {
      console.log(`  ${u.email} — ${u.name} (${u.role})`);
    } else {
      console.log(`  ${email} — NAO ENCONTRADO`);
    }
  }
}

run()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("[update-users] Falhou:", err);
    process.exit(1);
  });
