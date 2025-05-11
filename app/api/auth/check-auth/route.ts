import { NextResponse } from 'next/server';
import { auth } from '@/lib/firebase';

export async function GET() {
  try {
    const user = auth.currentUser;
    
    if (user) {
      return NextResponse.json({ authenticated: true });
    } else {
      return NextResponse.json({ authenticated: false });
    }
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json({ authenticated: false, error: 'Failed to check authentication status' });
  }
} 