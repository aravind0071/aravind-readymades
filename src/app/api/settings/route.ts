import { NextRequest, NextResponse } from 'next/server';
import { getStoreSettings, updateStoreSettings } from '@/lib/data/store-service';

export async function GET() {
  try {
    const settings = await getStoreSettings();
    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error('API /settings GET error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch store settings' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const updates = await request.json();
    const updated = await updateStoreSettings(updates);
    return NextResponse.json({ success: true, settings: updated });
  } catch (error) {
    console.error('API /settings PUT error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update store settings' }, { status: 500 });
  }
}
