import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "node:path";
import fs from "node:fs";
import { authenticate } from "./middleware/auth.middleware.js";
import { authRouter } from "./routes/auth.routes.js";
import { productsRouter } from "./routes/products.routes.js";
import { categoriesRouter, suppliersRouter } from "./routes/catalog.routes.js";
import { movementsRouter } from "./routes/movements.routes.js";
import { shoppingRouter, salesRouter } from "./routes/shopping.routes.js";
import { purchaseOrdersRouter } from "./routes/purchaseOrders.routes.js";
import { reportsRouter } from "./routes/reports.routes.js";
import { dashboardRouter } from "./routes/dashboard.routes.js";
import { notificationsRouter } from "./routes/notifications.routes.js";
import { startBackupSchedule } from "./services/backup.service.js";
import { sqliteClient } from "./db/client.js";
const PORT = Number(process.env.PORT) || 3001;
async function bootstrap() {
    // Aplica migracao automaticamente se DB ainda nao tem tabelas
    try {
        const probe = await sqliteClient.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='users' LIMIT 1");
        if (probe.rows.length === 0) {
            console.log("[server] Base de dados vazia. A aplicar migracoes iniciais...");
            const migrationsDir = path.resolve("server/db/migrations");
            const files = fs
                .readdirSync(migrationsDir)
                .filter((f) => f.endsWith(".sql"))
                .sort();
            const splitStatements = (sql) => {
                const cleaned = sql.split(/\r?\n/).map((line) => {
                    const idx = line.indexOf("--");
                    if (idx >= 0 && (line.slice(0, idx).match(/'/g)?.length ?? 0) % 2 === 0) {
                        return line.slice(0, idx);
                    }
                    return line;
                }).join("\n");
                const out = [];
                let buf = "";
                let inStr = false;
                for (let i = 0; i < cleaned.length; i++) {
                    const c = cleaned[i];
                    if (c === "'") {
                        if (cleaned[i + 1] === "'") {
                            buf += "''";
                            i++;
                            continue;
                        }
                        inStr = !inStr;
                        buf += c;
                        continue;
                    }
                    if (c === ";" && !inStr) {
                        const t = buf.trim();
                        if (t)
                            out.push(t);
                        buf = "";
                        continue;
                    }
                    buf += c;
                }
                const last = buf.trim();
                if (last)
                    out.push(last);
                return out;
            };
            for (const f of files) {
                const sqlContent = fs.readFileSync(path.join(migrationsDir, f), "utf-8");
                const stmts = splitStatements(sqlContent);
                for (const stmt of stmts) {
                    await sqliteClient.execute(stmt);
                }
            }
            console.log("[server] Migracoes aplicadas.");
        }
    }
    catch (err) {
        console.error("[server] Falha a verificar/aplicar migracoes:", err);
    }
    const app = express();
    app.use(cors({
        origin: (origin, cb) => cb(null, origin || true),
        credentials: true,
    }));
    app.use(express.json({ limit: "5mb" }));
    app.use(cookieParser());
    app.use(authenticate);
    app.get("/api/health", (_req, res) => res.json({ ok: true, ts: Date.now() }));
    app.use("/api/auth", authRouter);
    app.use("/api/products", productsRouter);
    app.use("/api/categories", categoriesRouter);
    app.use("/api/suppliers", suppliersRouter);
    app.use("/api/stock-movements", movementsRouter);
    app.use("/api/shopping", shoppingRouter);
    app.use("/api/sales", salesRouter);
    app.use("/api/purchase-orders", purchaseOrdersRouter);
    app.use("/api/reports", reportsRouter);
    app.use("/api/dashboard", dashboardRouter);
    app.use("/api/notifications", notificationsRouter);
    // Servir build do frontend em producao
    const distDir = path.resolve("dist");
    if (fs.existsSync(distDir)) {
        app.use(express.static(distDir));
        app.get("*", (req, res, next) => {
            if (req.path.startsWith("/api/"))
                return next();
            res.sendFile(path.join(distDir, "index.html"));
        });
    }
    // Backups automaticos a cada 24h
    startBackupSchedule(24 * 60 * 60 * 1000);
    app.listen(PORT, () => {
        console.log(`[VendorSmart] API a correr em http://localhost:${PORT}`);
    });
}
bootstrap().catch((err) => {
    console.error("[server] Falha ao arrancar:", err);
    process.exit(1);
});
