import { db, schema } from "../db/client.js";
import { eq, and } from "drizzle-orm";
import { randomBytes } from "crypto";
import { randomUUID } from "crypto";

/**
 * Serviço de Gestão de Convites
 * Responsável por criar, aceitar e gerenciar convites para novos utilizadores
 */
export class InvitationService {
  /**
   * Cria um novo convite para um utilizador
   */
  static async createInvitation(
    companyId: string,
    email: string,
    role: string,
    invitedBy: string
  ) {
    const token = randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 dias

    const invitation = await db.insert(schema.invitations).values({
      id: randomUUID(),
      companyId,
      email,
      role: role as any,
      invitedBy,
      token,
      expiresAt: expiresAt.toISOString(),
    });

    return {
      email,
      role,
      inviteLink: `${process.env.APP_URL}/accept-invite?token=${token}`,
      expiresAt,
    };
  }

  /**
   * Aceita um convite e cria um novo utilizador
   */
  static async acceptInvitation(token: string, password: string, name: string) {
    // Valida o token e verifica se não expirou
    const invitation = await db
      .select()
      .from(schema.invitations)
      .where(eq(schema.invitations.token, token))
      .limit(1);

    if (!invitation || invitation.length === 0) {
      throw new Error("Convite inválido");
    }

    const inv = invitation[0];

    if (inv.status !== "pending") {
      throw new Error("Convite já foi processado");
    }

    if (new Date(inv.expiresAt) < new Date()) {
      throw new Error("Convite expirado");
    }

    // Cria o novo utilizador
    const userId = randomUUID();
    const passwordHash = await require("bcryptjs").hash(password, 10);

    await db.insert(schema.users).values({
      id: userId,
      name,
      email: inv.email,
      passwordHash,
      companyId: inv.companyId,
      role: inv.role as any,
      isActive: true,
    });

    // Marca o convite como aceito
    await db
      .update(schema.invitations)
      .set({
        status: "accepted",
        acceptedAt: new Date().toISOString(),
      })
      .where(eq(schema.invitations.id, inv.id));

    return { userId, email: inv.email, role: inv.role };
  }

  /**
   * Lista todos os convites de uma empresa
   */
  static async listInvitations(companyId: string) {
    const invitations = await db
      .select()
      .from(schema.invitations)
      .where(eq(schema.invitations.companyId, companyId));

    return invitations;
  }

  /**
   * Cancela um convite
   */
  static async cancelInvitation(invitationId: string, companyId: string) {
    const result = await db
      .update(schema.invitations)
      .set({ status: "rejected" })
      .where(
        and(
          eq(schema.invitations.id, invitationId),
          eq(schema.invitations.companyId, companyId)
        )
      );

    return result;
  }

  /**
   * Limpa convites expirados
   */
  static async cleanupExpiredInvitations() {
    const now = new Date().toISOString();
    const result = await db
      .update(schema.invitations)
      .set({ status: "expired" })
      .where(
        and(
          eq(schema.invitations.status, "pending"),
          (col) => col.expiresAt < now
        )
      );

    return result;
  }
}
