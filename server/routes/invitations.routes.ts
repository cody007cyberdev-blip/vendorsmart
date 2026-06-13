import { Router, Request, Response } from "express";
import { z } from "zod";
import { tenantMiddleware, requireAdmin } from "../middleware/tenant.middleware.js";
import { InvitationService } from "../services/invitation.service.js";

export const invitationsRouter = Router();

// Aplicar middleware de tenant a todas as rotas
invitationsRouter.use(tenantMiddleware);

/**
 * Criar um novo convite
 * POST /api/invitations
 */
invitationsRouter.post("/", requireAdmin, async (req: Request, res: Response) => {
  const schema = z.object({
    email: z.string().email(),
    role: z.enum(["admin", "manager", "vendor", "employee", "customer"]),
  });

  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Dados inválidos" });
  }

  try {
    const invitation = await InvitationService.createInvitation(
      req.tenantId!,
      parsed.data.email,
      parsed.data.role,
      req.userId!
    );

    res.status(201).json({
      success: true,
      message: "Convite enviado com sucesso",
      invitation,
    });
  } catch (err) {
    res.status(500).json({ error: "Erro ao criar convite" });
  }
});

/**
 * Listar convites da empresa
 * GET /api/invitations
 */
invitationsRouter.get("/", requireAdmin, async (req: Request, res: Response) => {
  try {
    const invitations = await InvitationService.listInvitations(req.tenantId!);

    res.json({
      success: true,
      invitations,
    });
  } catch (err) {
    res.status(500).json({ error: "Erro ao listar convites" });
  }
});

/**
 * Aceitar um convite
 * POST /api/invitations/accept
 */
invitationsRouter.post("/accept", async (req: Request, res: Response) => {
  const schema = z.object({
    token: z.string(),
    password: z.string().min(8),
    name: z.string().min(2),
  });

  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Dados inválidos" });
  }

  try {
    const user = await InvitationService.acceptInvitation(
      parsed.data.token,
      parsed.data.password,
      parsed.data.name
    );

    res.json({
      success: true,
      message: "Convite aceito com sucesso",
      user,
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * Cancelar um convite
 * DELETE /api/invitations/:id
 */
invitationsRouter.delete("/:id", requireAdmin, async (req: Request, res: Response) => {
  try {
    await InvitationService.cancelInvitation(req.params.id, req.tenantId!);

    res.json({
      success: true,
      message: "Convite cancelado com sucesso",
    });
  } catch (err) {
    res.status(500).json({ error: "Erro ao cancelar convite" });
  }
});
