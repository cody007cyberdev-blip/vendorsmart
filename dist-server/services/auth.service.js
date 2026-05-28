import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { randomInt } from "node:crypto";
const JWT_SECRET = process.env.JWT_SECRET ?? "vendorsmart-dev-secret-change-me";
const JWT_EXPIRES_IN = "7d";
export function hashPassword(plain) {
    return bcrypt.hash(plain, 10);
}
export function verifyPassword(plain, hash) {
    return bcrypt.compare(plain, hash);
}
export function signJwt(payload) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}
export function verifyJwt(token) {
    try {
        return jwt.verify(token, JWT_SECRET);
    }
    catch {
        return null;
    }
}
/** Gera um codigo OTP de 6 digitos. */
export function generateOtp() {
    return String(randomInt(100000, 999999));
}
export function otpExpiryIso(minutes = 10) {
    return new Date(Date.now() + minutes * 60_000).toISOString();
}
export function isOtpExpired(expiresAtIso) {
    if (!expiresAtIso)
        return true;
    return new Date(expiresAtIso).getTime() < Date.now();
}
