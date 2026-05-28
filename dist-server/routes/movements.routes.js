import { Router } from "express";
import { eq, desc, sql } from "drizzle-orm";
import { z } from "zod";
import { randomUUID } from "node:crypto";
import { db, schema } from "../db/client.js";
import { requireAuth, requireRole } from "../middleware/auth.middleware.js";
import { checkStockAndNotify } from "../services/notifications.service.js";
export const movementsRouter = Router();
const movementSchema = z.object({
    productId: z.string().min(1),
    type: z.enum(["entry", "exit", "adjustment", "transfer"]),
    quantity: z.number().int(),
    fromLocation: z.string().nullable().optional(),
    toLocation: z.string().nullable().optional(),
    reference: z.string().nullable().optional(),
    notes: z.string().nullable().optional(),
});
movementsRouter.get("/", requireAuth, async (req, res) => {
    const { limit } = req.query;
    const lim = limit ? Math.min(parseInt(limit, 10) || 50, 500) : 100;
    const rows = await db
        .select()
        .from(schema.stockMovements)
        .orderBy(desc(schema.stockMovements.createdAt))
        .limit(lim);
    return res.json(rows);
});
movementsRouter.post("/", requireRole("admin", "manager", "vendor"), async (req, res) => {
    const parsed = movementSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ error: "Dados invalidos", details: parsed.error.flatten() });
    }
    const m = parsed.data;
    const id = randomUUID();
    // Determina o delta de stock
    let delta = 0;
    if (m.type === "entry")
        delta = Math.abs(m.quantity);
    else if (m.type === "exit")
        delta = -Math.abs(m.quantity);
    else if (m.type === "adjustment")
        delta = m.quantity;
    // transfer nao altera total (apenas entre locations)
    await db.insert(schema.stockMovements).values({
        id,
        ...m,
        performedById: req.user.uid,
    });
    if (delta !== 0) {
        await db
            .update(schema.products)
            .set({
            currentStock: sql `MAX(0, ${schema.products.currentStock} + ${delta})`,
            updatedAt: new Date().toISOString(),
        })
            .where(eq(schema.products.id, m.productId));
        // Verifica e dispara notificacao se necessario
        await checkStockAndNotify(m.productId);
    }
    const inserted = await db
        .select()
        .from(schema.stockMovements)
        .where(eq(schema.stockMovements.id, id))
        .limit(1);
    return res.status(201).json(inserted[0]);
});
