import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';

// Always read fresh settings, never serve a build-time cached response
export const dynamic = 'force-dynamic';

const SETTINGS_DOC = 'settings';
const FEATURES_DOC_ID = 'features';

export async function GET() {
  try {
    const doc = await db.collection(SETTINGS_DOC).doc(FEATURES_DOC_ID).get();
    const data = doc.exists ? doc.data() : {};

    return NextResponse.json({
      // Defaults to true so behavior is unchanged until an admin turns it off
      gauntletResetEnabled: data?.gauntletResetEnabled !== false
    });
  } catch (error) {
    console.error('Error fetching site settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch site settings' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (typeof body.gauntletResetEnabled !== 'boolean') {
      return NextResponse.json(
        { error: 'gauntletResetEnabled must be a boolean' },
        { status: 400 }
      );
    }

    await db.collection(SETTINGS_DOC).doc(FEATURES_DOC_ID).set(
      {
        gauntletResetEnabled: body.gauntletResetEnabled,
        updatedAt: new Date().toISOString()
      },
      { merge: true }
    );

    return NextResponse.json({ success: true, gauntletResetEnabled: body.gauntletResetEnabled });
  } catch (error) {
    console.error('Error updating site settings:', error);
    return NextResponse.json(
      { error: 'Failed to update site settings' },
      { status: 500 }
    );
  }
}
