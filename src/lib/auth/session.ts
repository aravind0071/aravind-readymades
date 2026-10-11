// Session Token Generation & Verification using Web Crypto API
// Compatible with both Edge Middleware and Node.js Server Runtimes

import { COOKIE_SESSION_NAME, SESSION_DURATION_MS } from './constants';

export interface UserSession {
  userId: string;
  email: string;
  role: 'host' | 'member';
  iat: number; // issued at (seconds)
  exp: number; // expires at (seconds)
}

const DEFAULT_SECRET = 'aravind_readymade_secure_fallback_session_secret_2026';

function getSecretKey(): string {
  return process.env.SESSION_SECRET || DEFAULT_SECRET;
}

// Helper: Base64URL encoding/decoding
function base64UrlEncode(buffer: ArrayBuffer | Uint8Array | string): string {
  let bytes: Uint8Array;
  if (typeof buffer === 'string') {
    bytes = new TextEncoder().encode(buffer);
  } else if (buffer instanceof Uint8Array) {
    bytes = buffer;
  } else {
    bytes = new Uint8Array(buffer);
  }

  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function base64UrlDecode(str: string): Uint8Array {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

async function getHmacKey(): Promise<CryptoKey> {
  const secret = getSecretKey();
  const keyData = new TextEncoder().encode(secret);
  return crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

/**
 * Creates a signed JWT-like session token
 */
export async function createSessionToken(payload: Omit<UserSession, 'iat' | 'exp'>): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const exp = now + Math.floor(SESSION_DURATION_MS / 1000);

  const fullSession: UserSession = {
    ...payload,
    iat: now,
    exp,
  };

  const header = { alg: 'HS256', typ: 'JWT' };
  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(fullSession));
  const dataToSign = `${encodedHeader}.${encodedPayload}`;

  const key = await getHmacKey();
  const signatureBuffer = await crypto.subtle.sign(
    'HMAC',
    key,
    new TextEncoder().encode(dataToSign)
  );

  const encodedSignature = base64UrlEncode(signatureBuffer);
  return `${dataToSign}.${encodedSignature}`;
}

/**
 * Verifies and decodes a session token. Returns null if invalid or expired.
 */
export async function verifySessionToken(token: string | null | undefined): Promise<UserSession | null> {
  if (!token || typeof token !== 'string') return null;

  const parts = token.split('.');
  if (parts.length !== 3) return null;

  const [encodedHeader, encodedPayload, encodedSignature] = parts;
  const dataToVerify = `${encodedHeader}.${encodedPayload}`;

  try {
    const key = await getHmacKey();
    const signatureBytes = base64UrlDecode(encodedSignature);

    const isValid = await crypto.subtle.verify(
      'HMAC',
      key,
      signatureBytes as unknown as BufferSource,
      new TextEncoder().encode(dataToVerify)
    );

    if (!isValid) return null;

    const payloadBytes = base64UrlDecode(encodedPayload);
    const payloadText = new TextDecoder().decode(payloadBytes);
    const session: UserSession = JSON.parse(payloadText);

    // Check expiration
    const now = Math.floor(Date.now() / 1000);
    if (!session.exp || session.exp < now) {
      return null;
    }

    return session;
  } catch (error) {
    return null;
  }
}

/**
 * Server-side helper to read the current session from Next.js headers/cookies
 */
export async function getServerSession(): Promise<UserSession | null> {
  try {
    // Dynamic import next/headers so this module remains clean in edge/browser contexts
    const { cookies } = await import('next/headers');
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_SESSION_NAME)?.value;
    return await verifySessionToken(token);
  } catch (err) {
    return null;
  }
}
