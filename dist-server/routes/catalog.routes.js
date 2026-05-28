import { Router } from "express";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { randomUUID } from "node:crypto";
import { db, schema } from "../db/client.js";
import { requireAuth, requireRole } from "../middleware/auth.middleware.js";
export const categoriesRouter = Router();
export const suppliersRouter = Router();
// ─── Categorias ────────────────────────────────
const categorySchema = z.object({
    name: z.string().min(1),
    description: z.string().nullable().optional(),
    parentId: z.string().nullable().optional(),
});
categoriesRouter.get("/", requireAuth, async (_req, res) => {
    const rows = await db.select().from(schema.categories);
    return res.json(rows);
});
categoriesRouter.post("/", requireRole("admin", "manager"), async (req, res) => {
    const parsed = categorySchema.safeParse(req.body);
    if (!parsed.success)
        return res.status(400).json({ error: "Dados invalidos" });
    const id = randomUUID();
    await db.insert(schema.categories).values({ id, ...parsed.data });
    return res.status(201).json({ id, ...parsed.data });
});
categoriesRouter.put("/:id", requireRole("admin", "manager"), async (req, res) => {
    const parsed = categorySchema.partial().safeParse(req.body);
    if (!parsed.success)
        return res.status(400).json({ error: "Dados invalidos" });
    await db
        .update(schema.categories)
        .set({ ...parsed.data, updatedAt: new Date().toISOString() })
        .where(eq(schema.categories.id, req.params.id));
    return res.json({ success: true });
});
categoriesRouter.delete("/:id", requireRole("admin"), async (req, res) => {
    await db.delete(schema.categories).where(eq(schema.categories.id, req.params.id));
    return res.json({ success: true });
});
// ─── Fornecedores ──────────────────────────────
const supplierSchema = z.object({
    name: z.string().min(1),
    contactName: z.string().nullable().optional(),
    email: z.string().email().nullable().optional().or(z.literal("")),
    phone: z.string().nullable().optional(),
    address: z.string().nullable().optional(),
    leadTimeDays: z.number().int().nonnegative().default(7),
    rating: z.number().min(0).max(5).default(0),
    isActive: z.boolean().default(true),
    notes: z.string().nullable().optional(),
});
suppliersRouter.get("/", requireAuth, async (_req, res) => {
    const rows = await db.select().from(schema.suppliers);
    return res.json(rows);
});
suppliersRouter.post("/", requireRole("admin", "manager"), async (req, res) => {
    const parsed = supplierSchema.safeParse(req.body);
    if (!parsed.success)
        return res.status(400).json({ error: "Dados invalidos" });
    const id = randomUUID();
    await db.insert(schema.suppliers).values({ id, ...parsed.data });
    return res.status(201).json({ id, ...parsed.data });
});
suppliersRouter.put("/:id", requireRole("admin", "manager"), async (req, res) => {
    const parsed = supplierSchema.partial().safeParse(req.body);
    if (!parsed.success)
        return res.status(400).json({ error: "Dados invalidos" });
    await db
        .update(schema.suppliers)
        .set({ ...parsed.data, updatedAt: new Date().toISOString() })
        .where(eq(schema.suppliers.id, req.params.id));
    return res.json({ success: true });
});
suppliersRouter.delete("/:id", requireRole("admin"), async (req, res) => {
    await db.delete(schema.suppliers).where(eq(schema.suppliers.id, req.params.id));
    return res.json({ success: true });
});
