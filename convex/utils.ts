import bcrypt from "bcryptjs";
import { v4 as uuid } from "uuid";

export function hashPassword(password: string) {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
}

export function verifyPassword(password: string, passwordHash: string) {
  return bcrypt.compareSync(password, passwordHash);
}

export function generateSessionToken() {
  return uuid();
}

export function now() {
  return Date.now();
}

export function sessionExpiry(days = 30) {
  return now() + days * 24 * 60 * 60 * 1000;
}
