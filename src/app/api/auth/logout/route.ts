import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { COOKIE_SESSION_NAME } from '@/lib/auth/constants';

export async function POST() {
  try {
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_SESSION_NAME, '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0, // Immediately expire cookie
    });

    return NextResponse.json({ success: true, message: 'Logged out successfully.' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to logout.' }, { status: 500 });
  }
}
