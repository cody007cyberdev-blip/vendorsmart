import { Request, Response, NextFunction } from "express";
import { jwtVerify } from "../lib/jwt.js";

/**
 * Estende a interface Express Request para incluir contexto de tenant
 */
declare global {
  namespace Express {
    interface Request {
      tenantId?: string; // companyId do utilizador
      userId?: string;
      userRole?: string;
    }
  }
}

/**
 * Middleware de Contexto de Tenant
 * Extrai o companyId do token JWT e o adiciona ao contexto da requisição
 * Garante que todas as queries subsequentes são filtradas por tenant
 */
export async function tenantMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Token não fornecido" });
    }

    const token = authHeader.slice(7);
    const decoded = await jwtVerify(token);

    // Adiciona o contexto de tenant à requisição
    req.tenantId = decoded.companyId;
    req.userId = decoded.id;
    req.userRole = decoded.role;

    next();
  } catch (err) {
    return res.status(401).json({ error: "Token inválido ou expirado" });
  }
}

/**
 * Middleware de Verificação de Tenant
 * Verifica se o utilizador tem acesso ao tenant solicitado
 * Útil para rotas que recebem um tenantId como parâmetro
 */
export function verifyTenantAccess(req: Request, res: Response, next: NextFunction) {
  const requestedTenantId = req.params.tenantId || req.query.tenantId;

  if (!req.tenantId) {
    return res.status(401).json({ error: "Contexto de tenant não encontrado" });
  }

  if (requestedTenantId && requestedTenantId !== req.tenantId) {
    return res.status(403).json({ error: "Acesso negado a este tenant" });
  }

  next();
}

/**
 * Middleware de Verificação de Permissão de Admin
 * Garante que apenas administradores podem acessar certos endpoints
 */
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (req.userRole !== "admin") {
    return res.status(403).json({ error: "Apenas administradores podem acessar este recurso" });
  }

  next();
}

/**
 * Middleware de Verificação de Permissão de Manager
 * Garante que apenas managers ou admins podem acessar certos endpoints
 */
export function requireManager(req: Request, res: Response, next: NextFunction) {
  if (req.userRole !== "manager" && req.userRole !== "admin") {
    return res.status(403).json({ error: "Apenas managers podem acessar este recurso" });
  }

  next();
}
