// Authentication Constants & Configuration for ARAVIND READYMADE

export const COOKIE_SESSION_NAME = 'aravind_session';

// Session duration: 7 days in milliseconds
export const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

// OTP validity: 5 minutes in milliseconds
export const OTP_EXPIRY_MS = 5 * 60 * 1000;

// Resend OTP cooldown: 60 seconds
export const OTP_RESEND_COOLDOWN_MS = 60 * 1000;

// Maximum OTP verification attempts before invalidating
export const MAX_OTP_ATTEMPTS = 5;

// Maximum OTP requests allowed in rate-limit window (10 minutes)
export const MAX_OTP_REQUESTS_IN_WINDOW = 3;
export const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;

/**
 * Resolves the role strictly on the server based on environment configuration.
 * Default Host Email: aravindadabala007@gmail.com
 */
export function resolveUserRole(email: string): 'host' | 'member' {
  if (!email) return 'member';
  const configuredHost = (process.env.HOST_EMAIL || 'aravindadabala007@gmail.com').trim().toLowerCase();
  const normalizedEmail = email.trim().toLowerCase();
  return normalizedEmail === configuredHost ? 'host' : 'member';
}

/**
 * Validates standard email address syntax
 */
export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  const trimmed = email.trim();
  // Standard RFC 5322 compliant regex for practical email validation
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return emailRegex.test(trimmed);
}

/**
 * Masks an email for safe user-facing display (e.g., a****@gmail.com)
 */
export function maskEmail(email: string): string {
  if (!email) return '';
  const [localPart, domain] = email.split('@');
  if (!domain) return email;
  if (localPart.length <= 2) {
    return `${localPart[0] || ''}****@${domain}`;
  }
  return `${localPart[0]}****${localPart[localPart.length - 1]}@${domain}`;
}
