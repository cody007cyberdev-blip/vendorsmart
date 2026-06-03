import { db, schema } from "../db/client.js";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { randomUUID } from "node:crypto";

async function run() {
  const email = "admin@vendorsmart.local";
  const password = "admin123";

  const existing = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.email, email))
    .limit(1);

  if (existing.length > 0) {
    await db.delete(schema.users).where(eq(schema.users.email, email));
    console.log(`[recreate-admin] Conta existente removida: ${email}`);
  } else {
    console.log(`[recreate-admin] Nenhuma conta existente encontrada para ${email}`);
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const now = new Date().toISOString();

  await db.insert(schema.users).values({
    id: randomUUID(),
    name: "Leonardo Fonseca",
    email,
    passwordHash,
    role: "admin",
    twoFactorEnabled: false,
    isActive: true,
    createdAt: now,
    updatedAt: now,
  });

  console.log(`[recreate-admin] Conta criada de novo: ${email} / ${password}`);
}

run()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("[recreate-admin] Falhou:", err);
    process.exit(1);
  });
