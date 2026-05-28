import { Router } from "express";
import { eq, desc, sql } from "drizzle-orm";
import { z } from "zod";
import { randomUUID } from "node:crypto";
import QRCode from "qrcode";
import { db, schema } from "../db/client.js";
import { requireAuth, requireRole } from "../middleware/auth.middleware.js";
import { checkStockAndNotify, notifyAdmins } from "../services/notifications.service.js";
export const shoppingRouter = Router();
export const salesRouter = Router();
function generateToken() {
    return randomUUID().replace(/-/g, "").slice(0, 16);
}
// ─── Lista publica: criar ──────────────────────
const createListSchema = z.object({
    customerName: z.string().optional(),
    customerPhone: z.string().optional(),
    notes: z.string().optional(),
});
shoppingRouter.post("/lists", async (req, res) => {
    const parsed = createListSchema.safeParse(req.body);
    if (!parsed.success)
        return res.status(400).json({ error: "Dados invalidos" });
    const id = randomUUID();
    const token = generateToken();
    await db.insert(schema.shoppingLists).values({
        id,
        publicToken: token,
        customerName: parsed.data.customerName,
        customerPhone: parsed.data.customerPhone,
        notes: parsed.data.notes,
        status: "open",
    });
    return res.status(201).json({ id, publicToken: token });
});
// ─── Obter lista publica por token ─────────────
shoppingRouter.get("/lists/by-token/:token", async (req, res) => {
    const found = await db
        .select()
        .from(schema.shoppingLists)
        .where(eq(schema.shoppingLists.publicToken, req.params.token))
        .limit(1);
    if (found.length === 0)
        return res.status(404).json({ error: "Lista nao encontrada" });
    const items = await db
        .select()
        .from(schema.shoppingListItems)
        .where(eq(schema.shoppingListItems.listId, found[0].id));
    return res.json({ ...found[0], items });
});
// ─── Adicionar item a lista publica ────────────
const addItemSchema = z.object({
    productId: z.string().nullable().optional(),
    productName: z.string().min(1),
    quantity: z.number().int().positive().default(1),
    unitPrice: z.number().nonnegative().default(0),
    notes: z.string().optional(),
});
shoppingRouter.post("/lists/by-token/:token/items", async (req, res) => {
    const parsed = addItemSchema.safeParse(req.body);
    if (!parsed.success)
        return res.status(400).json({ error: "Dados invalidos" });
    const list = await db
        .select()
        .from(schema.shoppingLists)
        .where(eq(schema.shoppingLists.publicToken, req.params.token))
        .limit(1);
    if (list.length === 0)
        return res.status(404).json({ error: "Lista nao encontrada" });
    if (list[0].status !== "open")
        return res.status(400).json({ error: "Lista ja fechada" });
    // Se ha productId, busca preco atual
    let unitPrice = parsed.data.unitPrice;
    let productName = parsed.data.productName;
    if (parsed.data.productId) {
        const p = await db
            .select()
            .from(schema.products)
            .where(eq(schema.products.id, parsed.data.productId))
            .limit(1);
        if (p.length > 0) {
            unitPrice = p[0].sellingPrice;
            productName = p[0].name;
        }
    }
    const itemId = randomUUID();
    await db.insert(schema.shoppingListItems).values({
        id: itemId,
        listId: list[0].id,
        productId: parsed.data.productId ?? null,
        productName,
        quantity: parsed.data.quantity,
        unitPrice,
        notes: parsed.data.notes,
    });
    await db
        .update(schema.shoppingLists)
        .set({ updatedAt: new Date().toISOString() })
        .where(eq(schema.shoppingLists.id, list[0].id));
    return res.status(201).json({ id: itemId });
});
shoppingRouter.delete("/lists/by-token/:token/items/:itemId", async (req, res) => {
    const list = await db
        .select()
        .from(schema.shoppingLists)
        .where(eq(schema.shoppingLists.publicToken, req.params.token))
        .limit(1);
    if (list.length === 0)
        return res.status(404).json({ error: "Lista nao encontrada" });
    await db
        .delete(schema.shoppingListItems)
        .where(eq(schema.shoppingListItems.id, req.params.itemId));
    return res.json({ success: true });
});
// ─── Marcar lista como pronta para vendedor ────
shoppingRouter.post("/lists/by-token/:token/ready", async (req, res) => {
    const list = await db
        .select()
        .from(schema.shoppingLists)
        .where(eq(schema.shoppingLists.publicToken, req.params.token))
        .limit(1);
    if (list.length === 0)
        return res.status(404).json({ error: "Lista nao encontrada" });
    await db
        .update(schema.shoppingLists)
        .set({ status: "ready", updatedAt: new Date().toISOString() })
        .where(eq(schema.shoppingLists.id, list[0].id));
    // Notifica vendedores/admins
    await notifyAdmins({
        type: "shopping_list_ready",
        title: "Lista de compras pronta",
        message: `Lista de ${list[0].customerName ?? "cliente"} esta pronta para processamento.`,
        link: `/vendor-panel?token=${list[0].publicToken}`,
        referenceId: list[0].id,
    });
    return res.json({ success: true });
});
// ─── QR Code da lista ──────────────────────────
shoppingRouter.get("/lists/by-token/:token/qrcode", async (req, res) => {
    const found = await db
        .select()
        .from(schema.shoppingLists)
        .where(eq(schema.shoppingLists.publicToken, req.params.token))
        .limit(1);
    if (found.length === 0)
        return res.status(404).json({ error: "Lista nao encontrada" });
    const baseUrl = req.headers["x-app-origin"] || `${req.protocol}://${req.get("host")}`;
    const url = `${baseUrl}/shop/list/${found[0].publicToken}`;
    const dataUrl = await QRCode.toDataURL(url, { margin: 1, width: 320 });
    return res.json({ url, dataUrl });
});
// ─── Listar todas (autenticado, vendedor+) ─────
shoppingRouter.get("/lists", requireRole("admin", "manager", "vendor"), async (_req, res) => {
    const rows = await db
        .select()
        .from(schema.shoppingLists)
        .orderBy(desc(schema.shoppingLists.createdAt));
    return res.json(rows);
});
// ─── Vendas ────────────────────────────────────
const saleItemSchema = z.object({
    productId: z.string(),
    name: z.string(),
    quantity: z.number().int().positive(),
    unitPrice: z.number().nonnegative(),
});
const createSaleSchema = z.object({
    shoppingListId: z.string().nullable().optional(),
    items: z.array(saleItemSchema).min(1),
    discount: z.number().nonnegative().default(0),
    paymentMethod: z.enum(["cash", "card", "transfer", "other"]).default("cash"),
    customerId: z.string().nullable().optional(),
    notes: z.string().optional(),
});
salesRouter.post("/", requireRole("admin", "manager", "vendor"), async (req, res) => {
    const parsed = createSaleSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ error: "Dados invalidos", details: parsed.error.flatten() });
    }
    const data = parsed.data;
    const subtotal = data.items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0);
    const total = Math.max(0, subtotal - data.discount);
    const id = randomUUID();
    const saleNumber = `V-${Date.now().toString().slice(-8)}`;
    const itemsForJson = data.items.map((i) => ({
        ...i,
        subtotal: i.quantity * i.unitPrice,
    }));
    await db.insert(schema.sales).values({
        id,
        saleNumber,
        vendorId: req.user.uid,
        customerId: data.customerId ?? null,
        shoppingListId: data.shoppingListId ?? null,
        itemsJson: JSON.stringify(itemsForJson),
        subtotal,
        discount: data.discount,
        total,
        paymentMethod: data.paymentMethod,
        status: "completed",
        notes: data.notes,
    });
    // Reduz stock e regista movimento de saida
    for (const item of data.items) {
        await db
            .update(schema.products)
            .set({
            currentStock: sql `MAX(0, ${schema.products.currentStock} - ${item.quantity})`,
            updatedAt: new Date().toISOString(),
        })
            .where(eq(schema.products.id, item.productId));
        await db.insert(schema.stockMovements).values({
            id: randomUUID(),
            productId: item.productId,
            type: "exit",
            quantity: item.quantity,
            reference: saleNumber,
            notes: `Venda ${saleNumber}`,
            performedById: req.user.uid,
        });
        await checkStockAndNotify(item.productId);
    }
    // Marca a lista como concluida
    if (data.shoppingListId) {
        await db
            .update(schema.shoppingLists)
            .set({ status: "completed", updatedAt: new Date().toISOString() })
            .where(eq(schema.shoppingLists.id, data.shoppingListId));
    }
    await notifyAdmins({
        type: "new_sale",
        title: "Nova venda registada",
        message: `Venda ${saleNumber} no valor de ${total.toFixed(2)} EUR.`,
        link: `/app/sales`,
        referenceId: id,
    });
    return res.status(201).json({ id, saleNumber, subtotal, total });
});
salesRouter.get("/", requireAuth, async (req, res) => {
    const limitRaw = req.query.limit || "100";
    const lim = Math.min(parseInt(limitRaw, 10) || 100, 500);
    const rows = await db
        .select()
        .from(schema.sales)
        .orderBy(desc(schema.sales.createdAt))
        .limit(lim);
    return res.json(rows);
});
salesRouter.get("/:id", requireAuth, async (req, res) => {
    const found = await db
        .select()
        .from(schema.sales)
        .where(eq(schema.sales.id, req.params.id))
        .limit(1);
    if (found.length === 0)
        return res.status(404).json({ error: "Nao encontrado" });
    return res.json(found[0]);
});
