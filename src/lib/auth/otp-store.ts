// Cryptographically Secure OTP Generation, Hashing, and Rate Limiting
import crypto from 'crypto';
import {
  OTP_EXPIRY_MS,
  OTP_RESEND_COOLDOWN_MS,
  MAX_OTP_ATTEMPTS,
  MAX_OTP_REQUESTS_IN_WINDOW,
  RATE_LIMIT_WINDOW_MS,
} from './constants';

interface OtpRecord {
  email: string;
  otpHash: string;
  expiresAt: number;
  attempts: number;
  createdAt: number;
  lastRequestedAt: number;
  requestTimestamps: number[];
}

// In-memory OTP registry singleton (persists during node process lifecycle)
// For multi-instance horizontal scaling, this can be backed by Redis or Supabase table
const otpRegistry = new Map<string, OtpRecord>();

/**
 * Hash OTP using SHA-256 for secure storage
 */
export function hashOtp(otp: string): string {
  return crypto.createHash('sha256').update(otp.trim()).digest('hex');
}

/**
 * Generate a cryptographically secure 6-digit numeric OTP
 */
export function generateSecureOtp(): string {
  // Generates integer between 100000 and 999999 inclusive
  return crypto.randomInt(100000, 1000000).toString();
}

/**
 * Checks rate limits before issuing a new OTP
 */
export function checkOtpRateLimit(email: string): {
  allowed: boolean;
  cooldownRemainingSeconds?: number;
  error?: string;
} {
  const normalizedEmail = email.trim().toLowerCase();
  const now = Date.now();
  const record = otpRegistry.get(normalizedEmail);

  if (!record) {
    return { allowed: true };
  }

  // 1. Check 60-second cooldown
  const timeSinceLastRequest = now - record.lastRequestedAt;
  if (timeSinceLastRequest < OTP_RESEND_COOLDOWN_MS) {
    const remainingSeconds = Math.ceil((OTP_RESEND_COOLDOWN_MS - timeSinceLastRequest) / 1000);
    return {
      allowed: false,
      cooldownRemainingSeconds: remainingSeconds,
      error: `Please wait ${remainingSeconds}s before requesting another verification code.`,
    };
  }

  // 2. Check maximum requests in window (e.g. max 3 requests per 10 minutes)
  const windowStart = now - RATE_LIMIT_WINDOW_MS;
  const recentRequests = record.requestTimestamps.filter((ts) => ts > windowStart);

  if (recentRequests.length >= MAX_OTP_REQUESTS_IN_WINDOW) {
    const oldestInWindow = recentRequests[0];
    const waitSeconds = Math.ceil((oldestInWindow + RATE_LIMIT_WINDOW_MS - now) / 1000);
    return {
      allowed: false,
      error: `Too many OTP requests. Please wait ${Math.ceil(waitSeconds / 60)} minutes before requesting again.`,
    };
  }

  return { allowed: true };
}

/**
 * Saves a new OTP record for the email with cryptographic hash
 */
export function saveOtpRecord(email: string, otp: string): void {
  const normalizedEmail = email.trim().toLowerCase();
  const now = Date.now();
  const record = otpRegistry.get(normalizedEmail);

  const windowStart = now - RATE_LIMIT_WINDOW_MS;
  const recentRequests = (record?.requestTimestamps || []).filter((ts) => ts > windowStart);
  recentRequests.push(now);

  otpRegistry.set(normalizedEmail, {
    email: normalizedEmail,
    otpHash: hashOtp(otp),
    expiresAt: now + OTP_EXPIRY_MS,
    attempts: 0,
    createdAt: now,
    lastRequestedAt: now,
    requestTimestamps: recentRequests,
  });
}

/**
 * Verifies the user submitted OTP against stored hash
 */
export function verifyOtpRecord(
  email: string,
  submittedOtp: string
): {
  valid: boolean;
  status: 'SUCCESS' | 'INVALID' | 'EXPIRED' | 'TOO_MANY_ATTEMPTS' | 'NOT_FOUND';
  error?: string;
} {
  const normalizedEmail = email.trim().toLowerCase();
  const record = otpRegistry.get(normalizedEmail);

  if (!record) {
    return {
      valid: false,
      status: 'NOT_FOUND',
      error: 'No active verification code found for this email. Please request a new code.',
    };
  }

  const now = Date.now();

  // Check expiration (5 minutes)
  if (now > record.expiresAt) {
    otpRegistry.delete(normalizedEmail);
    return {
      valid: false,
      status: 'EXPIRED',
      error: 'This verification code has expired. Please request a new code.',
    };
  }

  // Check attempt limits
  if (record.attempts >= MAX_OTP_ATTEMPTS) {
    otpRegistry.delete(normalizedEmail);
    return {
      valid: false,
      status: 'TOO_MANY_ATTEMPTS',
      error: 'Too many failed attempts. For your security, please request a new verification code.',
    };
  }

  const submittedHash = hashOtp(submittedOtp);

  if (submittedHash !== record.otpHash) {
    record.attempts += 1;
    const remainingAttempts = MAX_OTP_ATTEMPTS - record.attempts;
    if (remainingAttempts <= 0) {
      otpRegistry.delete(normalizedEmail);
      return {
        valid: false,
        status: 'TOO_MANY_ATTEMPTS',
        error: 'Too many failed attempts. Please request a new verification code.',
      };
    }
    return {
      valid: false,
      status: 'INVALID',
      error: `Incorrect verification code. ${remainingAttempts} ${remainingAttempts === 1 ? 'attempt' : 'attempts'} remaining.`,
    };
  }

  // Verification succeeded - clear OTP to prevent replay attacks
  otpRegistry.delete(normalizedEmail);

  return {
    valid: true,
    status: 'SUCCESS',
  };
}
