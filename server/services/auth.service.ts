import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { randomInt } from "node:crypto";

const JWT_SECRET = process.env.JWT_SECRET ?? "vendorsmart-dev-secret-change-me";
const JWT_EXPIRES_IN = "7d";

export interface JwtPayload {
  uid: string;
  role: "admin" | "manager" | "vendor" | "customer";
  email: string;
}

export function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 10);
}

export function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

export function signJwt(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyJwt(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch {
    return null;
  }
}

/** Gera um codigo OTP de 6 digitos. */
export function generateOtp(): string {
  return String(randomInt(100000, 999999));
}

export function otpExpiryIso(minutes = 10): string {
  return new Date(Date.now() + minutes * 60_000).toISOString();
}

export function isOtpExpired(expiresAtIso: string | null): boolean {
  if (!expiresAtIso) return true;
  return new Date(expiresAtIso).getTime() < Date.now();
}
