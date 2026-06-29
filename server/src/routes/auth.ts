import { Router } from 'express';
import bcrypt from 'bcryptjs';
import axios from 'axios';
import { z } from 'zod';
import { prisma } from '../prisma.js';
import { env } from '../env.js';
import {
  setAuthCookies,
  clearAuthCookies,
  verifyRefreshToken,
  type JwtPayload,
} from '../auth/jwt.js';
import { requireAuth } from '../auth/middleware.js';
import { toPublicUser } from '../util/dto.js';

const router = Router();

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  displayName: z.string().min(1).max(40),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

// POST /api/auth/register
router.post('/register', async (req, res, next) => {
  try {
    const { email, password, displayName } = registerSchema.parse(req.body);
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      res.status(409).json({ error: 'Email already registered' });
      return;
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, passwordHash, displayName, role: 'USER' },
    });
    const payload: JwtPayload = { sub: user.id, role: user.role as JwtPayload['role'] };
    setAuthCookies(res, payload);
    res.status(201).json({ user: toPublicUser(user) });
  } catch (e) {
    next(e);
  }
});

// POST /api/auth/login
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.passwordHash) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }
    const payload: JwtPayload = { sub: user.id, role: user.role as JwtPayload['role'] };
    setAuthCookies(res, payload);
    res.json({ user: toPublicUser(user) });
  } catch (e) {
    next(e);
  }
});

// POST /api/auth/logout
router.post('/logout', (_req, res) => {
  clearAuthCookies(res);
  res.json({ ok: true });
});

// POST /api/auth/refresh
router.post('/refresh', async (req, res) => {
  const token = req.cookies?.refresh_token;
  if (!token) {
    res.status(401).json({ error: 'No refresh token' });
    return;
  }
  try {
    const payload = verifyRefreshToken(token);
    // Re-read role in case it changed.
    const user = await prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user) {
      res.status(401).json({ error: 'User no longer exists' });
      return;
    }
    const fresh: JwtPayload = { sub: user.id, role: user.role as JwtPayload['role'] };
    setAuthCookies(res, fresh);
    res.json({ user: toPublicUser(user) });
  } catch {
    res.status(401).json({ error: 'Invalid refresh token' });
  }
});

// GET /api/auth/me — current user (used by client on boot)
router.get('/me', requireAuth, async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user!.sub } });
    if (!user) {
      res.status(404).json({ error: 'Not found' });
      return;
    }
    res.json({ user: toPublicUser(user) });
  } catch (e) {
    next(e);
  }
});

// ---- Account updates ----

const changeEmailSchema = z.object({ email: z.string().email() });

// PUT /api/auth/email — change email (requires auth)
router.put('/email', requireAuth, async (req, res, next) => {
  try {
    const { email } = changeEmailSchema.parse(req.body);
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing && existing.id !== req.user!.sub) {
      res.status(409).json({ error: 'Email already in use' });
      return;
    }
    const user = await prisma.user.update({ where: { id: req.user!.sub }, data: { email } });
    res.json({ user: toPublicUser(user) });
  } catch (e) { next(e); }
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8),
});

// PUT /api/auth/password — change password (requires auth + current password)
router.put('/password', requireAuth, async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = changePasswordSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { id: req.user!.sub } });
    if (!user) { res.status(404).json({ error: 'Not found' }); return; }
    if (!user.passwordHash) {
      res.status(400).json({ error: 'WCA-only accounts cannot set a password here' });
      return;
    }
    const ok = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!ok) { res.status(401).json({ error: 'Current password is incorrect' }); return; }
    const passwordHash = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({ where: { id: user.id }, data: { passwordHash } });
    res.json({ ok: true });
  } catch (e) { next(e); }
});

// ---- WCA OAuth ----

// GET /api/auth/config — lets the client know which login methods are available
router.get('/config', (_req, res) => {
  res.json({ wcaEnabled: Boolean(env.WCA_CLIENT_ID && env.WCA_CLIENT_SECRET) });
});

// GET /api/auth/wca — redirect to WCA's authorize endpoint
router.get('/wca', (_req, res) => {
  // If WCA OAuth isn't configured, bounce back with a clear in-app message
  // rather than sending the user to WCA's "Missing required parameter" error.
  if (!env.WCA_CLIENT_ID) {
    res.redirect(`${env.FRONTEND_URL}/login?error=wca_not_configured`);
    return;
  }
  const url = new URL(`${env.WCA_BASE}/oauth/authorize`);
  url.searchParams.set('client_id', env.WCA_CLIENT_ID);
  url.searchParams.set('redirect_uri', env.WCA_REDIRECT_URI);
  url.searchParams.set('response_type', 'code');
  // WCA OAuth: 'public' is the only valid scope and is the default.
  // Omitting scope avoids "invalid scope" errors on some WCA environments.
  res.redirect(url.toString());
});

// GET /api/auth/wca/callback — exchange code, fetch profile, upsert user
router.get('/wca/callback', async (req, res) => {
  const code = req.query.code as string | undefined;
  if (!code) {
    res.redirect(`${env.FRONTEND_URL}/login?error=wca_no_code`);
    return;
  }
  try {
    const tokenResp = await axios.post(`${env.WCA_BASE}/oauth/token`, {
      grant_type: 'authorization_code',
      client_id: env.WCA_CLIENT_ID,
      client_secret: env.WCA_CLIENT_SECRET,
      redirect_uri: env.WCA_REDIRECT_URI,
      code,
    });
    const accessToken = tokenResp.data.access_token as string;

    const meResp = await axios.get(`${env.WCA_API_BASE}/me`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const me = meResp.data.me;
    const wcaId: string | null = me.wca_id ?? null;
    const displayName: string = me.name ?? 'WCA User';
    const email: string | null = me.email ?? null;
    const country: string | null = me.country_iso2 ?? me.country?.iso2 ?? null;
    const avatarUrl: string | null = me.avatar?.url ?? null;

    // Upsert by wcaId (preferred) then email.
    let user = wcaId ? await prisma.user.findUnique({ where: { wcaId } }) : null;
    if (!user && email) {
      user = await prisma.user.findUnique({ where: { email } });
    }
    if (user) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { wcaId, displayName, country, avatarUrl, email: email ?? user.email },
      });
    } else {
      user = await prisma.user.create({
        data: { wcaId, displayName, email, country, avatarUrl, role: 'USER' },
      });
    }

    const payload: JwtPayload = { sub: user.id, role: user.role as JwtPayload['role'] };
    setAuthCookies(res, payload);
    res.redirect(`${env.FRONTEND_URL}/profile`);
  } catch (e) {
    const msg = axios.isAxiosError(e) ? e.message : 'wca_error';
    console.error('[wca] callback error:', msg);
    res.redirect(`${env.FRONTEND_URL}/login?error=wca_failed`);
  }
});

export default router;
