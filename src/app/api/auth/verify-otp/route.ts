import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { COOKIE_SESSION_NAME, SESSION_DURATION_MS, resolveUserRole, isValidEmail } from '@/lib/auth/constants';
import { verifyOtpRecord } from '@/lib/auth/otp-store';
import { upsertUserProfile } from '@/lib/auth/profile';
import { createSessionToken } from '@/lib/auth/session';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = body?.email;
    const otp = body?.otp;

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Please enter your email address.' },
        { status: 400 }
      );
    }

    const trimmedEmail = email.trim().toLowerCase();

    if (!isValidEmail(trimmedEmail)) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    if (!otp || typeof otp !== 'string' || !/^\d{6}$/.test(otp.trim())) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid 6-digit verification code.' },
        { status: 400 }
      );
    }

    // Verify OTP against secure hash store
    const verification = verifyOtpRecord(trimmedEmail, otp.trim());

    if (!verification.valid) {
      const statusCode =
        verification.status === 'EXPIRED'
          ? 410
          : verification.status === 'TOO_MANY_ATTEMPTS'
          ? 429
          : 400;

      return NextResponse.json(
        {
          success: false,
          status: verification.status,
          error: verification.error || 'Invalid verification code.',
        },
        { status: statusCode }
      );
    }

    // STRICT SERVER-SIDE ROLE DETERMINATION
    // Never trust client-provided role!
    const role = resolveUserRole(trimmedEmail);

    // Sync / Upsert User Profile
    const profile = await upsertUserProfile(trimmedEmail, role);

    // Generate Cryptographically Signed Session Token
    const sessionToken = await createSessionToken({
      userId: profile.id,
      email: profile.email,
      role: profile.role,
    });

    // Set Secure HTTP-Only Cookie
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_SESSION_NAME, sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: Math.floor(SESSION_DURATION_MS / 1000),
    });

    const redirectUrl = role === 'host' ? '/admin/dashboard' : '/account';

    return NextResponse.json({
      success: true,
      message: 'Authentication successful.',
      user: {
        id: profile.id,
        email: profile.email,
        role: profile.role,
      },
      redirectUrl,
    });
  } catch (error: any) {
    console.error('API /api/auth/verify-otp error:', error);
    return NextResponse.json(
      { success: false, error: 'Something went wrong during verification. Please try again.' },
      { status: 500 }
    );
  }
}
