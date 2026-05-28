import { Router } from "express";
import { eq, sql } from "drizzle-orm";
import { z } from "zod";
import { randomUUID } from "node:crypto";
import { db, schema } from "../db/client.js";
import { requireRole, requireAuth } from "../middleware/auth.middleware.js";
import { notifyAdmins } from "../services/notifications.service.js";

export const purchaseOrdersRouter = Router();

const itemSchema = z.object({
  productId: z.string(),
  quantityOrdered: z.number().int().positive(),
  unitCost: z.number().nonnegative(),
});

const createSchema = z.object({
  supplierId: z.string().nullable().optional(),
  expectedDelivery: z.string().nullable().optional(),
  notes: z.string().optional(),
  items: z.array(itemSchema).min(1),
});

purchaseOrdersRouter.get("/", requireAuth, async (_req, res) => {
  const orders = await db.select().from(schema.purchaseOrders);
  const items = await db.select().from(schema.purchaseOrderItems);
  const grouped = orders.map((o) => ({
    ...o,
    items: items.filter((i) => i.purchaseOrderId === o.id),
  }));
  return res.json(grouped);
});

purchaseOrdersRouter.post("/", requireRole("admin", "manager"), async (req, res) => {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Dados invalidos", details: parsed.error.flatten() });
  }
  const id = randomUUID();
  const orderNumber = `PO-${Date.now().toString().slice(-8)}`;
  const totalCost = parsed.data.items.reduce(
    (sum, i) => sum + i.quantityOrdered * i.unitCost,
    0,
  );

  await db.insert(schema.purchaseOrders).values({
    id,
    orderNumber,
    supplierId: parsed.data.supplierId ?? null,
    status: "draft",
    totalCost,
    expectedDelivery: parsed.data.expectedDelivery ?? null,
    notes: parsed.data.notes,
    createdById: req.user!.uid,
  });

  for (const it of parsed.data.items) {
    await db.insert(schema.purchaseOrderItems).values({
      id: randomUUID(),
      purchaseOrderId: id,
      productId: it.productId,
      quantityOrdered: it.quantityOrdered,
      unitCost: it.unitCost,
    });
  }

  return res.status(201).json({ id, orderNumber, totalCost });
});

const updateStatusSchema = z.object({
  status: z.enum(["draft", "submitted", "partial", "received", "cancelled"]),
});

purchaseOrdersRouter.put(
  "/:id/status",
  requireRole("admin", "manager"),
  async (req, res) => {
    const parsed = updateStatusSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Status invalido" });

    const setData: Partial<typeof schema.purchaseOrders.$inferInsert> = {
      status: parsed.data.status,
      updatedAt: new Date().toISOString(),
    };
    if (parsed.data.status === "received") {
      setData.receivedAt = new Date().toISOString();
    }
    await db
      .update(schema.purchaseOrders)
      .set(setData)
      .where(eq(schema.purchaseOrders.id, req.params.id));

    return res.json({ success: true });
  },
);

const receiveSchema = z.object({
  items: z
    .array(
      z.object({
        itemId: z.string(),
        quantityReceived: z.number().int().nonnegative(),
      }),
    )
    .min(1),
});

purchaseOrdersRouter.post(
  "/:id/receive",
  requireRole("admin", "manager"),
  async (req, res) => {
    const parsed = receiveSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Dados invalidos" });

    const orderId = req.params.id;
    const order = await db
      .select()
      .from(schema.purchaseOrders)
      .where(eq(schema.purchaseOrders.id, orderId))
      .limit(1);
    if (order.length === 0) return res.status(404).json({ error: "Ordem nao encontrada" });

    for (const r of parsed.data.items) {
      const itemRow = await db
        .select()
        .from(schema.purchaseOrderItems)
        .where(eq(schema.purchaseOrderItems.id, r.itemId))
        .limit(1);
      if (itemRow.length === 0) continue;
      const it = itemRow[0];
      const newReceived = Math.min(it.quantityOrdered, it.quantityReceived + r.quantityReceived);
      await db
        .update(schema.purchaseOrderItems)
        .set({ quantityReceived: newReceived })
        .where(eq(schema.purchaseOrderItems.id, r.itemId));

      await db
        .update(schema.products)
        .set({
          currentStock: sql`${schema.products.currentStock} + ${r.quantityReceived}`,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(schema.products.id, it.productId));

      await db.insert(schema.stockMovements).values({
        id: randomUUID(),
        productId: it.productId,
        type: "entry",
        quantity: r.quantityReceived,
        reference: order[0].orderNumber,
        notes: `Receção da ordem ${order[0].orderNumber}`,
        performedById: req.user!.uid,
      });
    }

    // Determina novo estado: se todos os itens completos -> received, senao partial
    const itemsAfter = await db
      .select()
      .from(schema.purchaseOrderItems)
      .where(eq(schema.purchaseOrderItems.purchaseOrderId, orderId));
    const allComplete = itemsAfter.every((i) => i.quantityReceived >= i.quantityOrdered);
    const newStatus = allComplete ? "received" : "partial";
    await db
      .update(schema.purchaseOrders)
      .set({
        status: newStatus,
        receivedAt: allComplete ? new Date().toISOString() : null,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(schema.purchaseOrders.id, orderId));

    if (allComplete) {
      await notifyAdmins({
        type: "po_received",
        title: "Ordem de compra recebida",
        message: `Ordem ${order[0].orderNumber} recebida na totalidade.`,
        link: "/app/purchase-orders",
        referenceId: orderId,
      });
    }
    return res.json({ success: true, status: newStatus });
  },
);

purchaseOrdersRouter.delete("/:id", requireRole("admin"), async (req, res) => {
  await db.delete(schema.purchaseOrders).where(eq(schema.purchaseOrders.id, req.params.id));
  return res.json({ success: true });
});
