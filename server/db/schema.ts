import { sql } from "drizzle-orm";
import {
  sqliteTable,
  text,
  integer,
  real,
  index,
} from "drizzle-orm/sqlite-core";

// ─── 1. users ─────────────────────────────────────────────
export const users = sqliteTable(
  "users",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    passwordHash: text("password_hash").notNull(),
    role: text("role", {
      enum: ["admin", "manager", "vendor", "customer", "requestor"],
    })
      .notNull()
      .default("customer"),
    phone: text("phone"),
    isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (t) => ({
    roleIdx: index("users_role_idx").on(t.role),
    emailIdx: index("users_email_idx").on(t.email),
  }),
);

// ─── 2. taxes (RF10) ──────────────────────────────────────
export const taxes = sqliteTable("taxes", {
  id: text("id").primaryKey(),
  name: text("name").notNull(), // ex: IVA 23%
  rate: real("rate").notNull(), // ex: 23.00
  countryCode: text("country_code").notNull().default("PT"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

// ─── 3. categories ────────────────────────────────────────
export const categories = sqliteTable("categories", {
  id: text("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
  parentId: text("parent_id"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

// ─── 4. suppliers ─────────────────────────────────────────
export const suppliers = sqliteTable("suppliers", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  contactName: text("contact_name"),
  email: text("email"),
  phone: text("phone"),
  address: text("address"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

// ─── 5. locations ─────────────────────────────────────────
export const locations = sqliteTable("locations", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  parentId: text("parent_id").references((): any => locations.id, { onDelete: "set null" }),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

// ─── 6. products ──────────────────────────────────────────
export const products = sqliteTable(
  "products",
  {
    id: text("id").primaryKey(),
    sku: text("sku").notNull().unique(),
    name: text("name").notNull(),
    description: text("description"),
    categoryId: text("category_id").references(() => categories.id, { onDelete: "set null" }),
    supplierId: text("supplier_id").references(() => suppliers.id, { onDelete: "set null" }),
    taxId: text("tax_id").references(() => taxes.id, { onDelete: "set null" }), // RF10
    unit: text("unit").notNull().default("un"),
    currentStock: integer("current_stock").notNull().default(0),
    reorderPoint: integer("reorder_point").notNull().default(0),
    costPrice: real("cost_price").notNull().default(0),
    sellingPrice: real("selling_price").notNull().default(0),
    isCompound: integer("is_compound", { mode: "boolean" }).notNull().default(false), // RF04
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  }
);

// ─── 7. productBatches (RF06) ─────────────────────────────
export const productBatches = sqliteTable("product_batches", {
  id: text("id").primaryKey(),
  productId: text("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  batchNumber: text("batch_number").notNull(),
  expirationDate: text("expiration_date"),
  currentStock: integer("current_stock").notNull().default(0),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

// ─── 8. billOfMaterials (RF04) ────────────────────────────
export const billOfMaterials = sqliteTable("bill_of_materials", {
  id: text("id").primaryKey(),
  productId: text("product_id").notNull().references(() => products.id, { onDelete: "cascade" }), // Produto final
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const bomItems = sqliteTable("bom_items", {
  id: text("id").primaryKey(),
  bomId: text("bom_id").notNull().references(() => billOfMaterials.id, { onDelete: "cascade" }),
  rawMaterialId: text("raw_material_id").notNull().references(() => products.id, { onDelete: "restrict" }),
  quantityRequired: real("quantity_required").notNull(),
});

// ─── 9. financialDocuments (RF02, RF03) ───────────────────
export const financialDocuments = sqliteTable("financial_documents", {
  id: text("id").primaryKey(),
  type: text("type", { enum: ["invoice", "receipt", "credit_note", "purchase_invoice"] }).notNull(),
  number: text("number").notNull().unique(),
  entityId: text("entity_id").notNull(), // userId ou supplierId
  entityType: text("entity_type", { enum: ["customer", "supplier"] }).notNull(),
  subtotal: real("subtotal").notNull(),
  taxAmount: real("tax_amount").notNull(),
  total: real("total").notNull(),
  status: text("status", { enum: ["draft", "final", "cancelled"] }).notNull().default("draft"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

// ─── 10. currentAccounts (RF02, RF03) ─────────────────────
export const currentAccounts = sqliteTable("current_accounts", {
  id: text("id").primaryKey(),
  entityId: text("entity_id").notNull().unique(),
  entityType: text("entity_type", { enum: ["customer", "supplier"] }).notNull(),
  balance: real("balance").notNull().default(0),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

// ─── 11. stockMovements ───────────────────────────────────
export const stockMovements = sqliteTable("stock_movements", {
  id: text("id").primaryKey(),
  productId: text("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  batchId: text("batch_id").references(() => productBatches.id, { onDelete: "set null" }), // RF06
  type: text("type", { enum: ["entry", "exit", "adjustment", "transfer", "production"] }).notNull(),
  quantity: integer("quantity").notNull(),
  reference: text("reference"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});
