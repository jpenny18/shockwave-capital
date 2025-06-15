import { NextRequest, NextResponse } from 'next/server';
import { sendFundedFailEmail, sendFundedDrawdownWarningEmail } from '../../../lib/email';

// Simple delay function
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function POST(request: NextRequest) {
  try {
    const { emailType } = await request.json();
    
    const testEmails = ['joshpenny6@gmail.com', 'support@shockwave-capital.com'];
    const results = [];
    
    if (emailType === 'fail' || emailType === 'both') {
      console.log('Sending funded account fail emails...');
      
      for (const email of testEmails) {
        console.log(`Sending fail email to: ${email}`);
        
        const result = await sendFundedFailEmail({
          email: email,
          name: 'Test User',
          accountSize: 100000,
          breachType: 'riskViolation',
          dailyDrawdown: 3.5
        });
        
        results.push({
          type: 'fail',
          email: email,
          success: result.success,
          error: result.error || null
        });
        
        // 3 second delay to avoid rate limits
        await delay(3000);
      }
    }
    
    if (emailType === 'warning' || emailType === 'both') {
      console.log('Sending funded account warning emails...');
      
      for (const email of testEmails) {
        console.log(`Sending warning email to: ${email}`);
        
        const result = await sendFundedDrawdownWarningEmail({
          email: email,
          name: 'Test User',
          accountSize: 100000,
          currentDrawdown: 12.5,
          warningType: 'approaching-risk-limit'
        });
        
        results.push({
          type: 'warning',
          email: email,
          success: result.success,
          error: result.error || null
        });
        
        // 3 second delay to avoid rate limits
        await delay(3000);
      }
    }
    
    return NextResponse.json({
      success: true,
      message: `Sent ${emailType} emails successfully`,
      results: results
    });
    
  } catch (error) {
    console.error('Error sending test emails:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
} 