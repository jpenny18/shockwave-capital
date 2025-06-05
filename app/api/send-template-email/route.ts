import { NextResponse } from 'next/server';
import { sendTemplateEmail } from '@/lib/email';

export async function POST(req: Request) {
  try {
    const { template, user, testValues } = await req.json();

    // Validate required fields
    if (!template || !user || !user.email) {
      return NextResponse.json(
        { error: 'Template, user, and user email are required' },
        { status: 400 }
      );
    }

    // Send email using the email utility function
    const result = await sendTemplateEmail(template, user, testValues);

    if (!result.success) {
      const errorMessage = typeof result.error === 'string' ? result.error : 'Failed to send email';
      throw new Error(errorMessage);
    }

    return NextResponse.json({ success: true, data: result.data });
  } catch (error) {
    console.error('Error in send-template-email route:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
} 