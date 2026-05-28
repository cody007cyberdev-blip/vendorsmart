import { eq, and, isNull, or } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import { db, schema } from "../db/client.js";

/**
 * Emite uma notificacao para todos os admins/managers (user_id = null = broadcast).
 */
export async function notifyAdmins(opts: {
  type: typeof schema.notifications.$inferInsert.type;
  title: string;
  message: string;
  link?: string;
  referenceId?: string;
}) {
  const admins = await db
    .select()
    .from(schema.users)
    .where(or(eq(schema.users.role, "admin"), eq(schema.users.role, "manager")));

  if (admins.length === 0) return;

  const rows = admins.map((u) => ({
    id: randomUUID(),
    userId: u.id,
    type: opts.type,
    title: opts.title,
    message: opts.message,
    link: opts.link ?? null,
    referenceId: opts.referenceId ?? null,
    isRead: false,
  }));
  await db.insert(schema.notifications).values(rows);
}

/**
 * Verifica se um produto atingiu o ponto de reabastecimento e dispara notificacao.
 */
export async function checkStockAndNotify(productId: string) {
  const found = await db
    .select()
    .from(schema.products)
    .where(eq(schema.products.id, productId))
    .limit(1);
  if (found.length === 0) return;
  const p = found[0];

  if (p.currentStock <= 0) {
    await notifyAdmins({
      type: "zero_stock",
      title: "Stock esgotado",
      message: `O produto "${p.name}" (SKU ${p.sku}) esta sem stock.`,
      link: `/app/catalog?productId=${p.id}`,
      referenceId: p.id,
    });
  } else if (p.currentStock <= p.reorderPoint && p.reorderPoint > 0) {
    await notifyAdmins({
      type: "low_stock",
      title: "Stock baixo",
      message: `O produto "${p.name}" (SKU ${p.sku}) esta com stock abaixo do minimo (${p.currentStock}/${p.reorderPoint}).`,
      link: `/app/catalog?productId=${p.id}`,
      referenceId: p.id,
    });
  }
}

export async function listNotificationsForUser(userId: string, unreadOnly = false) {
  const where = unreadOnly
    ? and(
        or(eq(schema.notifications.userId, userId), isNull(schema.notifications.userId)),
        eq(schema.notifications.isRead, false),
      )
    : or(eq(schema.notifications.userId, userId), isNull(schema.notifications.userId));
  return db
    .select()
    .from(schema.notifications)
    .where(where)
    .orderBy(schema.notifications.createdAt);
}
