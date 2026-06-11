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
  address: text("address").notNull(),
  city: text("city").notNull(),
  postalCode: text("postal_code"),
  country: text("country", { enum: ["PT", "CV"] }).notNull().default("PT"),
  currency: text("currency", { enum: ["EUR", "CVE"] }).notNull().default("EUR"),
  taxRegime: text("tax_regime"), // ex: Regime Geral, Isento
  logoUrl: text("logo_url"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

// ─── 2. users ─────────────────────────────────────────────
export const users = sqliteTable(
  "users",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    passwordHash: text("password_hash").notNull(),
    role: text("role", {
      enum: ["admin", "manager", "vendor", "customer", "requestor", "employee"],
    })
      .notNull()
      .default("customer"),
    companyId: text("company_id").references(() => companies.id, { onDelete: "cascade" }),
    isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  }
);

// ─── 3. employees (Gestão de Funcionários) ────────────────
export const employees = sqliteTable("employees", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }),
  employeeNumber: text("employee_number").notNull().unique(),
  department: text("department"),
  position: text("position"),
  salary: real("salary"),
  hireDate: text("hire_date"),
  status: text("status", { enum: ["active", "on_leave", "terminated"] }).default("active"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

// ─── 4. clients (Gestão de Clientes Avançada) ─────────────
export const clients = sqliteTable("clients", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  nif: text("nif").unique(),
  email: text("email"),
  phone: text("phone"),
  address: text("address"),
  city: text("city"),
  country: text("country", { enum: ["PT", "CV"] }).default("PT"),
  creditLimit: real("credit_limit").default(0),
  currentBalance: real("current_balance").default(0),
  status: text("status", { enum: ["active", "blocked", "inactive"] }).default("active"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

// ─── 5. taxes ─────────────────────────────────────────────
export const taxes = sqliteTable("taxes", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  rate: real("rate").notNull(),
  countryCode: text("country_code").notNull().default("PT"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

// ─── 6. products ──────────────────────────────────────────
export const products = sqliteTable("products", {
  id: text("id").primaryKey(),
  sku: text("sku").notNull().unique(),
  name: text("name").notNull(),
  description: text("description"),
  taxId: text("tax_id").references(() => taxes.id),
  unit: text("unit").notNull().default("un"),
  currentStock: integer("current_stock").notNull().default(0),
  costPrice: real("cost_price").notNull().default(0),
  sellingPrice: real("selling_price").notNull().default(0),
  isCompound: integer("is_compound", { mode: "boolean" }).notNull().default(false),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

// ─── 7. financialDocuments ────────────────────────────────
export const financialDocuments = sqliteTable("financial_documents", {
  id: text("id").primaryKey(),
  type: text("type", { enum: ["invoice", "receipt", "credit_note", "purchase_invoice"] }).notNull(),
  number: text("number").notNull().unique(),
  clientId: text("client_id").references(() => clients.id),
  subtotal: real("subtotal").notNull(),
  taxAmount: real("tax_amount").notNull(),
  total: real("total").notNull(),
  status: text("status", { enum: ["draft", "final", "cancelled"] }).notNull().default("draft"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

// ─── 8. currentAccounts ───────────────────────────────────
export const currentAccounts = sqliteTable("current_accounts", {
  id: text("id").primaryKey(),
  clientId: text("client_id").references(() => clients.id),
  balance: real("balance").notNull().default(0),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

// ─── 9. stockMovements ───────────────────────────────────
export const stockMovements = sqliteTable("stock_movements", {
  id: text("id").primaryKey(),
  productId: text("product_id").notNull().references(() => products.id),
  type: text("type", { enum: ["entry", "exit", "adjustment", "production"] }).notNull(),
  quantity: integer("quantity").notNull(),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});
