import { Router } from "express";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { randomUUID } from "node:crypto";
import { db, schema } from "../db/client.js";
import { hashPassword, verifyPassword, signJwt, generateOtp, otpExpiryIso, isOtpExpired, } from "../services/auth.service.js";
import { SESSION_COOKIE, requireAuth, } from "../middleware/auth.middleware.js";
export const authRouter = Router();
const cookieOptions = {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
};
// ─── Registo (cliente por defeito; admin pode criar outras roles) ─
const registerSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
    phone: z.string().optional(),
    role: z.enum(["admin", "manager", "vendor", "customer"]).optional(),
});
authRouter.post("/register", async (req, res) => {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ error: "Dados invalidos", details: parsed.error.flatten() });
    }
    const { name, email, password, phone, role } = parsed.data;
    const existing = await db
        .select()
        .from(schema.users)
        .where(eq(schema.users.email, email.toLowerCase()))
        .limit(1);
    if (existing.length > 0) {
        return res.status(409).json({ error: "Email ja registado" });
    }
    const passwordHash = await hashPassword(password);
    const id = randomUUID();
    const finalRole = role ?? "customer";
    await db.insert(schema.users).values({
        id,
        name,
        email: email.toLowerCase(),
        passwordHash,
        role: finalRole,
        phone,
    });
    return res.status(201).json({
        id,
        name,
        email: email.toLowerCase(),
        role: finalRole,
    });
});
// ─── Login (passo 1) ────────────────────────────────────
const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
});
authRouter.post("/login", async (req, res) => {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ error: "Dados invalidos" });
    }
    const { email, password } = parsed.data;
    const found = await db
        .select()
        .from(schema.users)
        .where(eq(schema.users.email, email.toLowerCase()))
        .limit(1);
    if (found.length === 0) {
        return res.status(401).json({ error: "Credenciais invalidas" });
    }
    const user = found[0];
    if (!user.isActive) {
        return res.status(403).json({ error: "Conta desativada" });
    }
    const ok = await verifyPassword(password, user.passwordHash);
    if (!ok) {
        return res.status(401).json({ error: "Credenciais invalidas" });
    }
    // Se 2FA esta ativo: gera OTP e devolve required = true
    if (user.twoFactorEnabled) {
        const code = generateOtp();
        const expiresAt = otpExpiryIso(10);
        await db
            .update(schema.users)
            .set({
            twoFactorCode: code,
            twoFactorExpiresAt: expiresAt,
            updatedAt: new Date().toISOString(),
        })
            .where(eq(schema.users.id, user.id));
        // Em producao seria enviado por email/SMS. Em dev devolvemos no log.
        console.log(`[auth] OTP para ${user.email}: ${code} (expira em 10 min)`);
        return res.json({
            twoFactorRequired: true,
            userId: user.id,
            // devCode incluido apenas se NODE_ENV !== production
            devCode: process.env.NODE_ENV === "production" ? undefined : code,
        });
    }
    // Sem 2FA: emite JWT diretamente
    const token = signJwt({ uid: user.id, role: user.role, email: user.email });
    await db
        .update(schema.users)
        .set({ lastLoginAt: new Date().toISOString() })
        .where(eq(schema.users.id, user.id));
    res.cookie(SESSION_COOKIE, token, cookieOptions);
    return res.json({
        twoFactorRequired: false,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
    });
});
// ─── 2FA (passo 2) ──────────────────────────────────────
const verify2faSchema = z.object({
    userId: z.string().min(1),
    code: z.string().length(6),
});
authRouter.post("/verify-2fa", async (req, res) => {
    const parsed = verify2faSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ error: "Dados invalidos" });
    }
    const { userId, code } = parsed.data;
    const found = await db
        .select()
        .from(schema.users)
        .where(eq(schema.users.id, userId))
        .limit(1);
    if (found.length === 0) {
        return res.status(404).json({ error: "Utilizador nao encontrado" });
    }
    const user = found[0];
    if (!user.twoFactorCode || isOtpExpired(user.twoFactorExpiresAt)) {
        return res.status(401).json({ error: "Codigo expirado, repita o login" });
    }
    if (user.twoFactorCode !== code) {
        return res.status(401).json({ error: "Codigo incorreto" });
    }
    await db
        .update(schema.users)
        .set({
        twoFactorCode: null,
        twoFactorExpiresAt: null,
        lastLoginAt: new Date().toISOString(),
    })
        .where(eq(schema.users.id, user.id));
    const token = signJwt({ uid: user.id, role: user.role, email: user.email });
    res.cookie(SESSION_COOKIE, token, cookieOptions);
    return res.json({
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
    });
});
// ─── Logout ─────────────────────────────────────────────
authRouter.post("/logout", (req, res) => {
    res.clearCookie(SESSION_COOKIE, { ...cookieOptions, maxAge: 0 });
    return res.json({ success: true });
});
// ─── Sessao actual ──────────────────────────────────────
authRouter.get("/me", requireAuth, async (req, res) => {
    const found = await db
        .select()
        .from(schema.users)
        .where(eq(schema.users.id, req.user.uid))
        .limit(1);
    if (found.length === 0) {
        return res.status(404).json({ error: "Utilizador nao encontrado" });
    }
    const u = found[0];
    return res.json({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        phone: u.phone,
        twoFactorEnabled: u.twoFactorEnabled,
        lastLoginAt: u.lastLoginAt,
    });
});
// ─── Activar / desactivar 2FA ───────────────────────────
authRouter.post("/2fa/enable", requireAuth, async (req, res) => {
    await db
        .update(schema.users)
        .set({ twoFactorEnabled: true, updatedAt: new Date().toISOString() })
        .where(eq(schema.users.id, req.user.uid));
    return res.json({ success: true, twoFactorEnabled: true });
});
authRouter.post("/2fa/disable", requireAuth, async (req, res) => {
    await db
        .update(schema.users)
        .set({
        twoFactorEnabled: false,
        twoFactorCode: null,
        twoFactorExpiresAt: null,
        updatedAt: new Date().toISOString(),
    })
        .where(eq(schema.users.id, req.user.uid));
    return res.json({ success: true, twoFactorEnabled: false });
});
