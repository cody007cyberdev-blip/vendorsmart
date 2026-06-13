import { sql } from "drizzle-orm";
import {
  sqliteTable,
  text,
  integer,
  real,
  index,
} from "drizzle-orm/sqlite-core";

// ─── 1. companies (RF01 - Cadastro de Empresa CV/PT) ──────
export const companies = sqliteTable("companies", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  legalName: text("legal_name").notNull(),
  nif: text("nif").notNull().unique(), // NIF (PT) ou NIF (CV)
  email: text("email").notNull(),
  phone: text("phone"),
  website: text("website"),
  address: text("address"),
  city: text("city"),
  postalCode: text("postal_code"),
  country: text("country", { enum: ["PT", "CV"] }).notNull().default("PT"),
  currency: text("currency", { enum: ["EUR", "CVE"] }).notNull().default("EUR"),
  taxRegime: text("tax_regime"), // ex: Regime Geral, Isento
  logoUrl: text("logo_url"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  licenseStatus: text("license_status", { enum: ["trial", "active", "expired", "suspended"] }).notNull().default("trial"),
  licenseExpiresAt: text("license_expires_at"),
});

// ─── 2. users ─────────────────────────────────────────────
export const users = sqliteTable(
  "users",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    passwordHash: text("password_hash").notNull(),
    phone: text("phone"),
    role: text("role", {
      enum: ["admin", "manager", "vendor", "customer", "requestor", "employee"],
    })
      .notNull()
      .default("customer"),
    companyId: text("company_id").references(() => companies.id, { onDelete: "cascade" }), // Multi-tenancy (nullable for initial setup)
    isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
    
    // 2FA and Auth Fields
    twoFactorEnabled: integer("two_factor_enabled", { mode: "boolean" }).notNull().default(false),
    twoFactorCode: text("two_factor_code"),
    twoFactorExpiresAt: text("two_factor_expires_at"),
    lastLoginAt: text("last_login_at"),
    
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => ({
    companyIdIdx: index("users_company_id_idx").on(table.companyId), // Multi-tenancy index
  })
);

// ─── 3. employees (Gestão de Funcionários) ────────────────
export const employees = sqliteTable(
  "employees",
  {
    id: text("id").primaryKey(),
    companyId: text("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }), // Multi-tenancy
    userId: text("user_id").references(() => users.id, { onDelete: "cascade" }),
    employeeNumber: text("employee_number").notNull(),
    department: text("department"),
    position: text("position"),
    salary: real("salary"),
    hireDate: text("hire_date"),
    status: text("status", { enum: ["active", "on_leave", "terminated"] }).default("active"),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => ({
    companyIdIdx: index("employees_company_id_idx").on(table.companyId), // Multi-tenancy index
  })
);

// ─── 4. clients (Gestão de Clientes Avançada) ─────────────
export const clients = sqliteTable(
  "clients",
  {
    id: text("id").primaryKey(),
    companyId: text("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }), // Multi-tenancy
    name: text("name").notNull(),
    nif: text("nif"),
    email: text("email"),
    phone: text("phone"),
    address: text("address"),
    city: text("city"),
    country: text("country", { enum: ["PT", "CV"] }).default("PT"),
    creditLimit: real("credit_limit").default(0),
    currentBalance: real("current_balance").default(0),
    status: text("status", { enum: ["active", "blocked", "inactive"] }).default("active"),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => ({
    companyIdIdx: index("clients_company_id_idx").on(table.companyId), // Multi-tenancy index
  })
);

// ─── 5. taxes ─────────────────────────────────────────────
export const taxes = sqliteTable(
  "taxes",
  {
    id: text("id").primaryKey(),
    companyId: text("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }), // Multi-tenancy
    name: text("name").notNull(),
    rate: real("rate").notNull(),
    countryCode: text("country_code").notNull().default("PT"),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => ({
    companyIdIdx: index("taxes_company_id_idx").on(table.companyId), // Multi-tenancy index
  })
);

// ─── 6. products ──────────────────────────────────────────
export const products = sqliteTable(
  "products",
  {
    id: text("id").primaryKey(),
    companyId: text("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }), // Multi-tenancy
    sku: text("sku").notNull(),
    name: text("name").notNull(),
    description: text("description"),
    taxId: text("tax_id").references(() => taxes.id),
    unit: text("unit").notNull().default("un"),
    currentStock: integer("current_stock").notNull().default(0),
    costPrice: real("cost_price").notNull().default(0),
    sellingPrice: real("selling_price").notNull().default(0),
    isCompound: integer("is_compound", { mode: "boolean" }).notNull().default(false),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => ({
    companyIdIdx: index("products_company_id_idx").on(table.companyId), // Multi-tenancy index
    skuIdx: index("products_sku_idx").on(table.sku),
  })
);

// ─── 7. financialDocuments ────────────────────────────────
export const financialDocuments = sqliteTable(
  "financial_documents",
  {
    id: text("id").primaryKey(),
    companyId: text("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }), // Multi-tenancy
    type: text("type", { enum: ["invoice", "receipt", "credit_note", "purchase_invoice"] }).notNull(),
    number: text("number").notNull(),
    clientId: text("client_id").references(() => clients.id),
    subtotal: real("subtotal").notNull(),
    taxAmount: real("tax_amount").notNull(),
    total: real("total").notNull(),
    status: text("status", { enum: ["draft", "final", "cancelled"] }).notNull().default("draft"),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => ({
    companyIdIdx: index("financial_documents_company_id_idx").on(table.companyId), // Multi-tenancy index
  })
);

// ─── 8. currentAccounts ───────────────────────────────────
export const currentAccounts = sqliteTable(
  "current_accounts",
  {
    id: text("id").primaryKey(),
    companyId: text("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }), // Multi-tenancy
    clientId: text("client_id").references(() => clients.id),
    balance: real("balance").notNull().default(0),
    updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => ({
    companyIdIdx: index("current_accounts_company_id_idx").on(table.companyId), // Multi-tenancy index
  })
);

// ─── 9. stockMovements ───────────────────────────────────
export const stockMovements = sqliteTable(
  "stock_movements",
  {
    id: text("id").primaryKey(),
    companyId: text("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }), // Multi-tenancy
    productId: text("product_id").notNull().references(() => products.id),
    type: text("type", { enum: ["entry", "exit", "adjustment", "production"] }).notNull(),
    quantity: integer("quantity").notNull(),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => ({
    companyIdIdx: index("stock_movements_company_id_idx").on(table.companyId), // Multi-tenancy index
  })
);

// ─── 10. categories ───────────────────────────────────────
export const categories = sqliteTable(
  "categories",
  {
    id: text("id").primaryKey(),
    companyId: text("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }), // Multi-tenancy
    name: text("name").notNull(),
    description: text("description"),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => ({
    companyIdIdx: index("categories_company_id_idx").on(table.companyId), // Multi-tenancy index
  })
);

// ─── 11. suppliers ────────────────────────────────────────
export const suppliers = sqliteTable(
  "suppliers",
  {
    id: text("id").primaryKey(),
    companyId: text("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }), // Multi-tenancy
    name: text("name").notNull(),
    contactPerson: text("contact_person"),
    email: text("email"),
    phone: text("phone"),
    address: text("address"),
    city: text("city"),
    postalCode: text("postal_code"),
    country: text("country"),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => ({
    companyIdIdx: index("suppliers_company_id_idx").on(table.companyId), // Multi-tenancy index
  })
);

// ─── 12. licenses (Gestão de Licenças) ────────────────────
export const licenses = sqliteTable(
  "licenses",
  {
    id: text("id").primaryKey(),
    companyId: text("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
    plan: text("plan", { enum: ["vendedor", "loja", "minimercado_supermercado"] }).notNull(),
    status: text("status", { enum: ["active", "expired", "suspended"] }).notNull().default("active"),
    amount: integer("amount").notNull(),
    currency: text("currency", { enum: ["EUR", "CVE"] }).notNull(),
    nextBillingDate: text("next_billing_date").notNull(),
    lastPaymentDate: text("last_payment_date"),
    paymentMethod: text("payment_method"),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  }
);

// ─── 13. notifications ────────────────────────────────────
export const notifications = sqliteTable(
  "notifications",
  {
    id: text("id").primaryKey(),
    companyId: text("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }), // Multi-tenancy
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    message: text("message").notNull(),
    type: text("type", { enum: ["info", "warning", "error", "success"] }).default("info"),
    isRead: integer("is_read", { mode: "boolean" }).notNull().default(false),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => ({
    companyIdIdx: index("notifications_company_id_idx").on(table.companyId), // Multi-tenancy index
  })
);

// ─── 14. auditLogs (Rastreamento de Ações) ────────────────
export const auditLogs = sqliteTable(
  "audit_logs",
  {
    id: text("id").primaryKey(),
    companyId: text("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }), // Multi-tenancy
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    action: text("action").notNull(),
    entity: text("entity").notNull(),
    entityId: text("entity_id"),
    changes: text("changes"), // JSON
    ipAddress: text("ip_address"),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => ({
    companyIdIdx: index("audit_logs_company_id_idx").on(table.companyId), // Multi-tenancy index
  })
);
