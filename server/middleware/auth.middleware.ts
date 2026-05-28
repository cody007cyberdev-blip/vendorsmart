import type { Request, Response, NextFunction } from "express";
import { verifyJwt, type JwtPayload } from "../services/auth.service.js";

export type Role = "admin" | "manager" | "vendor" | "customer";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const SESSION_COOKIE = "vs_session";

export function authenticate(req: Request, _res: Response, next: NextFunction) {
  const cookieToken = req.cookies?.[SESSION_COOKIE];
  const authHeader = req.headers.authorization;
  let token: string | undefined = cookieToken;
  if (!token && authHeader?.startsWith("Bearer ")) {
    token = authHeader.slice(7);
  }
  if (token) {
    const payload = verifyJwt(token);
    if (payload) req.user = payload;
  }
  next();
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ error: "Nao autenticado" });
  }
  next();
}

export function requireRole(...roles: Role[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: "Nao autenticado" });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Permissao insuficiente" });
    }
    next();
  };
}
