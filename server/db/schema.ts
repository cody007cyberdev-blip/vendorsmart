import { sql } from "drizzle-orm";
import {
  sqliteTable,
  text,
  integer,
  real,
  index,
} from "drizzle-orm/sqlite-core";

/**
 * VendorSmart - Schema das 11 tabelas obrigatorias.
 * SQLite via @libsql/client. Todas as datas guardadas como ISO strings (UTC).
 */

// ─── 1. users ─────────────────────────────────────────────
export const users = sqliteTable(
  "users",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    passwordHash: text("password_hash").notNull(),
    role: text("role", {
      enum: ["admin", "manager", "vendor", "customer"],
    })
      .notNull()
      .default("customer"),
    phone: text("phone"),
    isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
    twoFactorEnabled: integer("two_factor_enabled", { mode: "boolean" })
      .notNull()
      .default(false),
    twoFactorCode: text("two_factor_code"),
    twoFactorExpiresAt: text("two_factor_expires_at"),
    lastLoginAt: text("last_login_at"),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (t) => ({
    roleIdx: index("users_role_idx").on(t.role),
    emailIdx: index("users_email_idx").on(t.email),
  }),
);

// ─── 2. categories ────────────────────────────────────────
export const categories = sqliteTable("categories", {
  id: text("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
  parentId: text("parent_id"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

// ─── 3. suppliers ─────────────────────────────────────────
export const suppliers = sqliteTable("suppliers", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  contactName: text("contact_name"),
  email: text("email"),
  phone: text("phone"),
  address: text("address"),
  leadTimeDays: integer("lead_time_days").notNull().default(7),
  rating: real("rating").notNull().default(0),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  notes: text("notes"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

// ─── 4. products ──────────────────────────────────────────
export const products = sqliteTable(
  "products",
  {
    id: text("id").primaryKey(),
    sku: text("sku").notNull().unique(),
    barcode: text("barcode"),
    name: text("name").notNull(),
    description: text("description"),
    categoryId: text("category_id").references(() => categories.id, {
      onDelete: "set null",
    }),
    supplierId: text("supplier_id").references(() => suppliers.id, {
      onDelete: "set null",
    }),
    unit: text("unit").notNull().default("un"),
    currentStock: integer("current_stock").notNull().default(0),
    reorderPoint: integer("reorder_point").notNull().default(0),
    reorderQuantity: integer("reorder_quantity").notNull().default(0),
    costPrice: real("cost_price").notNull().default(0),
    sellingPrice: real("selling_price").notNull().default(0),
    status: text("status", {
      enum: ["active", "discontinued", "archived"],
    })
      .notNull()
      .default("active"),
    imageUrl: text("image_url"),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (t) => ({
    categoryIdx: index("products_category_idx").on(t.categoryId),
    supplierIdx: index("products_supplier_idx").on(t.supplierId),
    statusIdx: index("products_status_idx").on(t.status),
  }),
);

// ─── 5. stockMovements ────────────────────────────────────
export const stockMovements = sqliteTable(
  "stock_movements",
  {
    id: text("id").primaryKey(),
    productId: text("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    type: text("type", {
      enum: ["entry", "exit", "adjustment", "transfer"],
    }).notNull(),
    quantity: integer("quantity").notNull(),
    fromLocation: text("from_location"),
    toLocation: text("to_location"),
    reference: text("reference"),
    notes: text("notes"),
    performedById: text("performed_by_id").references(() => users.id, {
      onDelete: "set null",
    }),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (t) => ({
    productIdx: index("movements_product_idx").on(t.productId),
    typeIdx: index("movements_type_idx").on(t.type),
  }),
);

// ─── 6. shoppingLists ─────────────────────────────────────
export const shoppingLists = sqliteTable(
  "shopping_lists",
  {
    id: text("id").primaryKey(),
    publicToken: text("public_token").notNull().unique(),
    customerId: text("customer_id").references(() => users.id, {
      onDelete: "set null",
    }),
    customerName: text("customer_name"),
    customerPhone: text("customer_phone"),
    status: text("status", {
      enum: ["open", "ready", "processing", "completed", "cancelled"],
    })
      .notNull()
      .default("open"),
    notes: text("notes"),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (t) => ({
    tokenIdx: index("shopping_lists_token_idx").on(t.publicToken),
    statusIdx: index("shopping_lists_status_idx").on(t.status),
  }),
);

// ─── 7. shoppingListItems ─────────────────────────────────
export const shoppingListItems = sqliteTable(
  "shopping_list_items",
  {
    id: text("id").primaryKey(),
    listId: text("list_id")
      .notNull()
      .references(() => shoppingLists.id, { onDelete: "cascade" }),
    productId: text("product_id").references(() => products.id, {
      onDelete: "set null",
    }),
    productName: text("product_name").notNull(),
    quantity: integer("quantity").notNull().default(1),
    unitPrice: real("unit_price").notNull().default(0),
    notes: text("notes"),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (t) => ({
    listIdx: index("shopping_items_list_idx").on(t.listId),
  }),
);

// ─── 8. sales ─────────────────────────────────────────────
export const sales = sqliteTable(
  "sales",
  {
    id: text("id").primaryKey(),
    saleNumber: text("sale_number").notNull().unique(),
    vendorId: text("vendor_id").references(() => users.id, {
      onDelete: "set null",
    }),
    customerId: text("customer_id").references(() => users.id, {
      onDelete: "set null",
    }),
    shoppingListId: text("shopping_list_id").references(
      () => shoppingLists.id,
      { onDelete: "set null" },
    ),
    /** itens em JSON: Array<{ productId, name, quantity, unitPrice, subtotal }> */
    itemsJson: text("items_json").notNull().default("[]"),
    subtotal: real("subtotal").notNull().default(0),
    discount: real("discount").notNull().default(0),
    total: real("total").notNull().default(0),
    paymentMethod: text("payment_method", {
      enum: ["cash", "card", "transfer", "other"],
    })
      .notNull()
      .default("cash"),
    status: text("status", {
      enum: ["pending", "completed", "cancelled", "refunded"],
    })
      .notNull()
      .default("completed"),
    notes: text("notes"),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (t) => ({
    vendorIdx: index("sales_vendor_idx").on(t.vendorId),
    statusIdx: index("sales_status_idx").on(t.status),
    dateIdx: index("sales_date_idx").on(t.createdAt),
  }),
);

// ─── 9. purchaseOrders ────────────────────────────────────
export const purchaseOrders = sqliteTable(
  "purchase_orders",
  {
    id: text("id").primaryKey(),
    orderNumber: text("order_number").notNull().unique(),
    supplierId: text("supplier_id").references(() => suppliers.id, {
      onDelete: "set null",
    }),
    status: text("status", {
      enum: ["draft", "submitted", "partial", "received", "cancelled"],
    })
      .notNull()
      .default("draft"),
    totalCost: real("total_cost").notNull().default(0),
    expectedDelivery: text("expected_delivery"),
    receivedAt: text("received_at"),
    notes: text("notes"),
    createdById: text("created_by_id").references(() => users.id, {
      onDelete: "set null",
    }),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (t) => ({
    supplierIdx: index("po_supplier_idx").on(t.supplierId),
    statusIdx: index("po_status_idx").on(t.status),
  }),
);

// ─── 10. purchaseOrderItems ───────────────────────────────
export const purchaseOrderItems = sqliteTable(
  "purchase_order_items",
  {
    id: text("id").primaryKey(),
    purchaseOrderId: text("purchase_order_id")
      .notNull()
      .references(() => purchaseOrders.id, { onDelete: "cascade" }),
    productId: text("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "restrict" }),
    quantityOrdered: integer("quantity_ordered").notNull(),
    quantityReceived: integer("quantity_received").notNull().default(0),
    unitCost: real("unit_cost").notNull().default(0),
  },
  (t) => ({
    poIdx: index("po_items_po_idx").on(t.purchaseOrderId),
  }),
);

// ─── 11. reports ──────────────────────────────────────────
export const reports = sqliteTable(
  "reports",
  {
    id: text("id").primaryKey(),
    title: text("title").notNull(),
    type: text("type", {
      enum: ["sales", "stock", "movements", "purchases", "suppliers", "custom"],
    }).notNull(),
    format: text("format", { enum: ["csv", "xlsx", "pdf", "json"] })
      .notNull()
      .default("csv"),
    /** JSON com filtros aplicados */
    filtersJson: text("filters_json").notNull().default("{}"),
    /** caminho relativo do ficheiro gerado em data/reports */
    filePath: text("file_path"),
    rowCount: integer("row_count").notNull().default(0),
    generatedById: text("generated_by_id").references(() => users.id, {
      onDelete: "set null",
    }),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (t) => ({
    typeIdx: index("reports_type_idx").on(t.type),
    dateIdx: index("reports_date_idx").on(t.createdAt),
  }),
);

// ─── Tabela auxiliar de notificacoes (in-app) ─────────────
export const notifications = sqliteTable(
  "notifications",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").references(() => users.id, {
      onDelete: "cascade",
    }),
    type: text("type", {
      enum: [
        "low_stock",
        "zero_stock",
        "po_reminder",
        "po_received",
        "new_sale",
        "shopping_list_ready",
        "system",
      ],
    }).notNull(),
    title: text("title").notNull(),
    message: text("message").notNull(),
    link: text("link"),
    referenceId: text("reference_id"),
    isRead: integer("is_read", { mode: "boolean" }).notNull().default(false),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (t) => ({
    userIdx: index("notif_user_idx").on(t.userId),
    readIdx: index("notif_read_idx").on(t.isRead),
  }),
);

// ─── Tipos exportados ─────────────────────────────────────
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;
export type Supplier = typeof suppliers.$inferSelect;
export type NewSupplier = typeof suppliers.$inferInsert;
export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export type StockMovement = typeof stockMovements.$inferSelect;
export type NewStockMovement = typeof stockMovements.$inferInsert;
export type ShoppingList = typeof shoppingLists.$inferSelect;
export type NewShoppingList = typeof shoppingLists.$inferInsert;
export type ShoppingListItem = typeof shoppingListItems.$inferSelect;
export type NewShoppingListItem = typeof shoppingListItems.$inferInsert;
export type Sale = typeof sales.$inferSelect;
export type NewSale = typeof sales.$inferInsert;
export type PurchaseOrder = typeof purchaseOrders.$inferSelect;
export type NewPurchaseOrder = typeof purchaseOrders.$inferInsert;
export type PurchaseOrderItem = typeof purchaseOrderItems.$inferSelect;
export type NewPurchaseOrderItem = typeof purchaseOrderItems.$inferInsert;
export type Report = typeof reports.$inferSelect;
export type NewReport = typeof reports.$inferInsert;
export type Notification = typeof notifications.$inferSelect;
export type NewNotification = typeof notifications.$inferInsert;
