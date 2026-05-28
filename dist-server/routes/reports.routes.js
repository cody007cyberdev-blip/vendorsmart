import { Router } from "express";
import { desc, eq } from "drizzle-orm";
import { z } from "zod";
import { randomUUID } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import ExcelJS from "exceljs";
import { db, schema } from "../db/client.js";
import { requireRole, requireAuth } from "../middleware/auth.middleware.js";
export const reportsRouter = Router();
const REPORTS_DIR = path.resolve("data/reports");
if (!fs.existsSync(REPORTS_DIR))
    fs.mkdirSync(REPORTS_DIR, { recursive: true });
const generateSchema = z.object({
    title: z.string().min(1),
    type: z.enum(["sales", "stock", "movements", "purchases", "suppliers", "custom"]),
    format: z.enum(["csv", "xlsx"]).default("csv"),
    filters: z.record(z.string(), z.unknown()).optional(),
});
async function fetchReportRows(type) {
    switch (type) {
        case "sales": {
            const data = await db
                .select()
                .from(schema.sales)
                .orderBy(desc(schema.sales.createdAt));
            return {
                headers: ["Numero", "Data", "Vendedor", "Total", "Pagamento", "Estado"],
                rows: data.map((s) => [
                    s.saleNumber,
                    s.createdAt,
                    s.vendorId ?? "",
                    s.total,
                    s.paymentMethod,
                    s.status,
                ]),
            };
        }
        case "stock": {
            const data = await db.select().from(schema.products);
            return {
                headers: ["SKU", "Nome", "Stock atual", "Ponto reabastecimento", "Preco custo", "Preco venda", "Estado"],
                rows: data.map((p) => [
                    p.sku,
                    p.name,
                    p.currentStock,
                    p.reorderPoint,
                    p.costPrice,
                    p.sellingPrice,
                    p.status,
                ]),
            };
        }
        case "movements": {
            const data = await db
                .select()
                .from(schema.stockMovements)
                .orderBy(desc(schema.stockMovements.createdAt));
            return {
                headers: ["Data", "Produto", "Tipo", "Quantidade", "Referencia", "Notas"],
                rows: data.map((m) => [
                    m.createdAt,
                    m.productId,
                    m.type,
                    m.quantity,
                    m.reference ?? "",
                    m.notes ?? "",
                ]),
            };
        }
        case "purchases": {
            const data = await db.select().from(schema.purchaseOrders);
            return {
                headers: ["Numero", "Fornecedor", "Estado", "Total", "Entrega prevista"],
                rows: data.map((o) => [
                    o.orderNumber,
                    o.supplierId ?? "",
                    o.status,
                    o.totalCost,
                    o.expectedDelivery ?? "",
                ]),
            };
        }
        case "suppliers": {
            const data = await db.select().from(schema.suppliers);
            return {
                headers: ["Nome", "Contacto", "Email", "Telefone", "Avaliacao", "Activo"],
                rows: data.map((s) => [
                    s.name,
                    s.contactName ?? "",
                    s.email ?? "",
                    s.phone ?? "",
                    s.rating,
                    s.isActive ? "Sim" : "Nao",
                ]),
            };
        }
        default:
            return { headers: ["Mensagem"], rows: [["Relatorio personalizado vazio"]] };
    }
}
function toCsv(headers, rows) {
    const escape = (v) => {
        const s = String(v ?? "");
        if (s.includes(",") || s.includes("\"") || s.includes("\n")) {
            return `"${s.replace(/"/g, '""')}"`;
        }
        return s;
    };
    return [headers.map(escape).join(","), ...rows.map((r) => r.map(escape).join(","))].join("\n");
}
async function toXlsxBuffer(headers, rows) {
    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet("Relatorio");
    ws.addRow(headers);
    rows.forEach((r) => ws.addRow(r));
    ws.getRow(1).font = { bold: true };
    return wb.xlsx.writeBuffer();
}
reportsRouter.post("/generate", requireRole("admin", "manager"), async (req, res) => {
    const parsed = generateSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ error: "Dados invalidos" });
    }
    const { title, type, format, filters } = parsed.data;
    const { headers, rows } = await fetchReportRows(type);
    const id = randomUUID();
    const filename = `${type}-${id}.${format}`;
    const filepath = path.join(REPORTS_DIR, filename);
    if (format === "csv") {
        fs.writeFileSync(filepath, toCsv(headers, rows), "utf-8");
    }
    else {
        const buf = await toXlsxBuffer(headers, rows);
        fs.writeFileSync(filepath, Buffer.from(buf));
    }
    await db.insert(schema.reports).values({
        id,
        title,
        type,
        format,
        filtersJson: JSON.stringify(filters ?? {}),
        filePath: `data/reports/${filename}`,
        rowCount: rows.length,
        generatedById: req.user.uid,
    });
    return res.status(201).json({
        id,
        title,
        type,
        format,
        rowCount: rows.length,
        downloadUrl: `/api/reports/${id}/download`,
    });
});
reportsRouter.get("/", requireAuth, async (_req, res) => {
    const rows = await db
        .select()
        .from(schema.reports)
        .orderBy(desc(schema.reports.createdAt));
    return res.json(rows);
});
reportsRouter.get("/:id/download", requireAuth, async (req, res) => {
    const found = await db
        .select()
        .from(schema.reports)
        .where(eq(schema.reports.id, req.params.id))
        .limit(1);
    if (found.length === 0 || !found[0].filePath) {
        return res.status(404).json({ error: "Relatorio nao encontrado" });
    }
    const filePath = path.resolve(found[0].filePath);
    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: "Ficheiro nao encontrado" });
    }
    const filename = path.basename(filePath);
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    if (filename.endsWith(".csv"))
        res.setHeader("Content-Type", "text/csv; charset=utf-8");
    else if (filename.endsWith(".xlsx"))
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    fs.createReadStream(filePath).pipe(res);
});
