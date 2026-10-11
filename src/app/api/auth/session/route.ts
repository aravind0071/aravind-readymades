import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { COOKIE_SESSION_NAME } from '@/lib/auth/constants';
import { verifySessionToken } from '@/lib/auth/session';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_SESSION_NAME)?.value;

    if (!token) {
      return NextResponse.json({ authenticated: false, user: null });
    }

    const session = await verifySessionToken(token);

    if (!session) {
      return NextResponse.json({ authenticated: false, user: null });
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: session.userId,
        email: session.email,
        role: session.role,
      },
    });
  } catch (error) {
    return NextResponse.json({ authenticated: false, user: null });
  }
}
