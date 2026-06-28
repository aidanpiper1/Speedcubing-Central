import jwt from 'jsonwebtoken';
import type { Response } from 'express';
import { env, isProd } from '../env.js';

export interface JwtPayload {
  sub: string; // user id
  role: 'GUEST' | 'USER' | 'ADMIN';
}

const ACCESS_TTL = '15m';
const REFRESH_TTL = '7d';

export function signAccessToken(payload: JwtPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: ACCESS_TTL });
}

export function signRefreshToken(payload: JwtPayload): string {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, { expiresIn: REFRESH_TTL });
}

export function verifyAccessToken(token: string): JwtPayload {
  return jwt.verify(token, env.JWT_SECRET) as JwtPayload;
}

export function verifyRefreshToken(token: string): JwtPayload {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as JwtPayload;
}

const cookieBase = {
  httpOnly: true,
  secure: isProd,
  sameSite: 'lax' as const,
  path: '/',
};

export function setAuthCookies(res: Response, payload: JwtPayload): void {
  res.cookie('access_token', signAccessToken(payload), {
    ...cookieBase,
    maxAge: 15 * 60 * 1000,
  });
  res.cookie('refresh_token', signRefreshToken(payload), {
    ...cookieBase,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

export function clearAuthCookies(res: Response): void {
  res.clearCookie('access_token', cookieBase);
  res.clearCookie('refresh_token', cookieBase);
}
