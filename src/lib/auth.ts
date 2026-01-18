import 'server-only';
import crypto from 'crypto';

export const AUTH_COOKIE_NAME = 'auth-token';
export const SESSION_TTL_SECONDS = 60 * 60 * 4;

export interface AuthSession {
  email: string;
  exp: number;
}

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is not set`);
  }
  return value;
}

const AUTH_SECRET = requireEnv('AUTH_SECRET');

function base64UrlEncode(input: string | Buffer): string {
  const buffer = typeof input === 'string' ? Buffer.from(input, 'utf8') : input;
  return buffer
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
}

function base64UrlDecode(input: string): string {
  const normalized = input.replace(/-/g, '+').replace(/_/g, '/');
  const padLength = normalized.length % 4 ? 4 - (normalized.length % 4) : 0;
  const padded = normalized + '='.repeat(padLength);
  return Buffer.from(padded, 'base64').toString('utf8');
}

function sign(payload: string): string {
  const signature = crypto.createHmac('sha256', AUTH_SECRET).update(payload).digest();
  return base64UrlEncode(signature);
}

export function createAuthToken(email: string): string {
  const exp = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  const payload = JSON.stringify({
    email,
    exp,
    nonce: crypto.randomBytes(16).toString('hex'),
  });
  const payloadEncoded = base64UrlEncode(payload);
  const signature = sign(payloadEncoded);
  return `${payloadEncoded}.${signature}`;
}

export function verifyAuthToken(token: string): AuthSession | null {
  const [payloadEncoded, signature] = token.split('.');
  if (!payloadEncoded || !signature) return null;

  const expectedSignature = sign(payloadEncoded);
  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (signatureBuffer.length !== expectedBuffer.length) return null;
  if (!crypto.timingSafeEqual(signatureBuffer, expectedBuffer)) return null;

  try {
    const payloadJson = base64UrlDecode(payloadEncoded);
    const payload = JSON.parse(payloadJson) as AuthSession;
    if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

function parseCookies(cookieHeader: string): Record<string, string> {
  return cookieHeader
    .split(';')
    .map((cookie) => cookie.trim())
    .filter(Boolean)
    .reduce((acc, cookie) => {
      const index = cookie.indexOf('=');
      if (index === -1) return acc;
      const name = cookie.slice(0, index).trim();
      const value = cookie.slice(index + 1).trim();
      acc[name] = value;
      return acc;
    }, {} as Record<string, string>);
}

export function getAdminSession(request: Request): AuthSession | null {
  const cookieHeader = request.headers.get('cookie') || '';
  const cookies = parseCookies(cookieHeader);
  const token = cookies[AUTH_COOKIE_NAME];
  if (!token) return null;
  return verifyAuthToken(token);
}
