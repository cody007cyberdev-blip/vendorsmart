import { sql } from "drizzle-orm";
import { sqliteTable, text, index } from "drizzle-orm/sqlite-core";
import { companies, users } from "./schema.js";

/**
 * Tabela de Convites para Adicionar Utilizadores à Empresa
 * Permite que admins convitem pessoas para se juntarem à empresa
 */
export const invitations = sqliteTable(
  "invitations",
  {
    id: text("id").primaryKey(),
    companyId: text("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
    email: text("email").notNull(),
    role: text("role", {
      enum: ["admin", "manager", "vendor", "employee", "customer"],
    }).notNull().default("employee"),
    invitedBy: text("invited_by").notNull().references(() => users.id, { onDelete: "cascade" }),
    status: text("status", { enum: ["pending", "accepted", "rejected", "expired"] }).notNull().default("pending"),
    token: text("token").notNull().unique(), // Token único para aceitar convite
    expiresAt: text("expires_at").notNull(), // Convite expira em 7 dias
    acceptedAt: text("accepted_at"),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => ({
    companyIdIdx: index("invitations_company_id_idx").on(table.companyId),
    emailIdx: index("invitations_email_idx").on(table.email),
    tokenIdx: index("invitations_token_idx").on(table.token),
  })
);

/**
 * Tabela de Sessões para Refresh Tokens
 * Permite gerenciar sessões de utilizadores e fazer logout global
 */
export const sessions = sqliteTable(
  "sessions",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    companyId: text("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
    refreshToken: text("refresh_token").notNull().unique(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    expiresAt: text("expires_at").notNull(),
    revokedAt: text("revoked_at"), // Null se ativa, timestamp se revogada
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => ({
    userIdIdx: index("sessions_user_id_idx").on(table.userId),
    companyIdIdx: index("sessions_company_id_idx").on(table.companyId),
  })
);
