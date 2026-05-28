import { Router } from "express";
import { desc, sql } from "drizzle-orm";
import { db, schema } from "../db/client.js";
import { requireAuth } from "../middleware/auth.middleware.js";
export const dashboardRouter = Router();
dashboardRouter.get("/", requireAuth, async (_req, res) => {
    const products = await db.select().from(schema.products);
    const totalProducts = products.length;
    const lowStock = products.filter((p) => p.currentStock > 0 && p.reorderPoint > 0 && p.currentStock <= p.reorderPoint).length;
    const outOfStock = products.filter((p) => p.currentStock <= 0).length;
    const totalStockValue = products.reduce((sum, p) => sum + p.currentStock * p.costPrice, 0);
    const todayIso = new Date();
    todayIso.setHours(0, 0, 0, 0);
    const todayStart = todayIso.toISOString();
    const sales = await db.select().from(schema.sales);
    const todaySales = sales.filter((s) => s.createdAt >= todayStart);
    const totalSalesToday = todaySales.reduce((sum, s) => sum + s.total, 0);
    const totalSalesAll = sales.reduce((sum, s) => sum + s.total, 0);
    const transactionsToday = todaySales.length;
    const recentMovements = await db
        .select()
        .from(schema.stockMovements)
        .orderBy(desc(schema.stockMovements.createdAt))
        .limit(8);
    const openShoppingLists = await db
        .select({ count: sql `COUNT(*)` })
        .from(schema.shoppingLists)
        .where(sql `${schema.shoppingLists.status} IN ('open','ready')`);
    const pendingOrders = await db
        .select({ count: sql `COUNT(*)` })
        .from(schema.purchaseOrders)
        .where(sql `${schema.purchaseOrders.status} IN ('draft','submitted','partial')`);
    return res.json({
        products: {
            total: totalProducts,
            lowStock,
            outOfStock,
            ok: totalProducts - lowStock - outOfStock,
            totalStockValue,
        },
        sales: {
            totalToday: totalSalesToday,
            totalAllTime: totalSalesAll,
            transactionsToday,
            transactionsAll: sales.length,
        },
        recentMovements,
        openShoppingLists: Number(openShoppingLists[0]?.count ?? 0),
        pendingOrders: Number(pendingOrders[0]?.count ?? 0),
    });
});
