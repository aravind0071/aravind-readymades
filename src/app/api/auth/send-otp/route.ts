import { NextRequest, NextResponse } from 'next/server';
import { isValidEmail, maskEmail } from '@/lib/auth/constants';
import { checkOtpRateLimit, generateSecureOtp, saveOtpRecord } from '@/lib/auth/otp-store';
import { sendOtpEmail } from '@/lib/auth/email-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = body?.email;

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

    // Check rate limits & 60s cooldown
    const rateCheck = checkOtpRateLimit(trimmedEmail);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: rateCheck.error,
          cooldownRemainingSeconds: rateCheck.cooldownRemainingSeconds,
        },
        { status: 429 }
      );
    }

    // Generate secure 6-digit OTP & record it
    const otp = generateSecureOtp();
    saveOtpRecord(trimmedEmail, otp);

    // Send email via SMTP
    const emailResult = await sendOtpEmail(trimmedEmail, otp);

    if (!emailResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: emailResult.error || 'Failed to send verification email. Please try again.',
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Verification code sent successfully.',
      maskedEmail: maskEmail(trimmedEmail),
      devCode: emailResult.devCode,
      simulated: emailResult.simulated,
    });
  } catch (error: any) {
    console.error('API /api/auth/send-otp error:', error);
    return NextResponse.json(
      { success: false, error: 'Something went wrong. Please try again later.' },
      { status: 500 }
    );
  }
}
