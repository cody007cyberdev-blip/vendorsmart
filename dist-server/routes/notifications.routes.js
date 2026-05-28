import { Router } from "express";
import { eq, and, or, isNull, desc } from "drizzle-orm";
import { db, schema } from "../db/client.js";
import { requireAuth } from "../middleware/auth.middleware.js";
export const notificationsRouter = Router();
notificationsRouter.get("/", requireAuth, async (req, res) => {
    const rows = await db
        .select()
        .from(schema.notifications)
        .where(or(eq(schema.notifications.userId, req.user.uid), isNull(schema.notifications.userId)))
        .orderBy(desc(schema.notifications.createdAt))
        .limit(100);
    return res.json(rows);
});
notificationsRouter.post("/:id/read", requireAuth, async (req, res) => {
    await db
        .update(schema.notifications)
        .set({ isRead: true })
        .where(and(eq(schema.notifications.id, req.params.id), or(eq(schema.notifications.userId, req.user.uid), isNull(schema.notifications.userId))));
    return res.json({ success: true });
});
notificationsRouter.post("/read-all", requireAuth, async (req, res) => {
    await db
        .update(schema.notifications)
        .set({ isRead: true })
        .where(or(eq(schema.notifications.userId, req.user.uid), isNull(schema.notifications.userId)));
    return res.json({ success: true });
});
