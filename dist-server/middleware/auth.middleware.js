import { verifyJwt } from "../services/auth.service.js";
export const SESSION_COOKIE = "vs_session";
export function authenticate(req, _res, next) {
    const cookieToken = req.cookies?.[SESSION_COOKIE];
    const authHeader = req.headers.authorization;
    let token = cookieToken;
    if (!token && authHeader?.startsWith("Bearer ")) {
        token = authHeader.slice(7);
    }
    if (token) {
        const payload = verifyJwt(token);
        if (payload)
            req.user = payload;
    }
    next();
}
export function requireAuth(req, res, next) {
    if (!req.user) {
        return res.status(401).json({ error: "Nao autenticado" });
    }
    next();
}
export function requireRole(...roles) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: "Nao autenticado" });
        }
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ error: "Permissao insuficiente" });
        }
        next();
    };
}
