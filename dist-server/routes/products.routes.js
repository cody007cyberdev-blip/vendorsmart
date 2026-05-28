import { Router } from "express";
import { eq, and, like, or, sql } from "drizzle-orm";
import { z } from "zod";
import { randomUUID } from "node:crypto";
import { db, schema } from "../db/client.js";
import { requireAuth, requireRole } from "../middleware/auth.middleware.js";
export const productsRouter = Router();
const productSchema = z.object({
    sku: z.string().min(1),
    barcode: z.string().nullable().optional(),
    name: z.string().min(1),
    description: z.string().nullable().optional(),
    categoryId: z.string().nullable().optional(),
    supplierId: z.string().nullable().optional(),
    unit: z.string().default("un"),
    currentStock: z.number().int().nonnegative().default(0),
    reorderPoint: z.number().int().nonnegative().default(0),
    reorderQuantity: z.number().int().nonnegative().default(0),
    costPrice: z.number().nonnegative().default(0),
    sellingPrice: z.number().nonnegative().default(0),
    status: z.enum(["active", "discontinued", "archived"]).default("active"),
    imageUrl: z.string().nullable().optional(),
});
// LISTAR (publico para clientes autenticados de qualquer perfil)
productsRouter.get("/", requireAuth, async (req, res) => {
    const { q, categoryId, supplierId, status, stockState, // 'low' | 'out' | 'ok'
     } = req.query;
    const conditions = [];
    if (q) {
        conditions.push(or(like(schema.products.name, `%${q}%`), like(schema.products.sku, `%${q}%`), like(schema.products.barcode, `%${q}%`)));
    }
    if (categoryId)
        conditions.push(eq(schema.products.categoryId, categoryId));
    if (supplierId)
        conditions.push(eq(schema.products.supplierId, supplierId));
    if (status)
        conditions.push(eq(schema.products.status, status));
    if (stockState === "out") {
        conditions.push(sql `${schema.products.currentStock} = 0`);
    }
    else if (stockState === "low") {
        conditions.push(sql `${schema.products.currentStock} > 0 AND ${schema.products.currentStock} <= ${schema.products.reorderPoint}`);
    }
    else if (stockState === "ok") {
        conditions.push(sql `${schema.products.currentStock} > ${schema.products.reorderPoint}`);
    }
    const rows = await db
        .select()
        .from(schema.products)
        .where(conditions.length ? and(...conditions) : undefined);
    return res.json(rows);
});
productsRouter.get("/:id", requireAuth, async (req, res) => {
    const found = await db
        .select()
        .from(schema.products)
        .where(eq(schema.products.id, req.params.id))
        .limit(1);
    if (found.length === 0)
        return res.status(404).json({ error: "Nao encontrado" });
    return res.json(found[0]);
});
productsRouter.post("/", requireRole("admin", "manager"), async (req, res) => {
    const parsed = productSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ error: "Dados invalidos", details: parsed.error.flatten() });
    }
    const id = randomUUID();
    await db.insert(schema.products).values({ id, ...parsed.data });
    const inserted = await db
        .select()
        .from(schema.products)
        .where(eq(schema.products.id, id))
        .limit(1);
    return res.status(201).json(inserted[0]);
});
productsRouter.put("/:id", requireRole("admin", "manager"), async (req, res) => {
    const parsed = productSchema.partial().safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ error: "Dados invalidos" });
    }
    await db
        .update(schema.products)
        .set({ ...parsed.data, updatedAt: new Date().toISOString() })
        .where(eq(schema.products.id, req.params.id));
    const updated = await db
        .select()
        .from(schema.products)
        .where(eq(schema.products.id, req.params.id))
        .limit(1);
    if (updated.length === 0)
        return res.status(404).json({ error: "Nao encontrado" });
    return res.json(updated[0]);
});
productsRouter.delete("/:id", requireRole("admin"), async (req, res) => {
    await db.delete(schema.products).where(eq(schema.products.id, req.params.id));
    return res.json({ success: true });
});
