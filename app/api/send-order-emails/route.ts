import { NextRequest, NextResponse } from 'next/server';
import { sendAdminNotificationEmail, sendCustomerReceiptEmail } from '../../../lib/email';

export async function POST(request: NextRequest) {
  try {
    // Get order data from request body
    const orderData = await request.json();
    
    if (!orderData || !orderData.customerEmail) {
      return NextResponse.json(
        { success: false, error: 'Invalid order data' },
        { status: 400 }
      );
    }
    
    console.log('API: Processing order email notifications for:', orderData.id);

    // Convert date strings to Firebase-like timestamp objects if needed
    const orderWithDates = {
      ...orderData,
      createdAt: orderData.createdAt?.toDate ? 
        orderData.createdAt : 
        { toDate: () => new Date(orderData.createdAt || Date.now()) },
      updatedAt: orderData.updatedAt?.toDate ? 
        orderData.updatedAt : 
        { toDate: () => new Date(orderData.updatedAt || Date.now()) }
    };

    // Send admin notification email
    const adminEmailResult = await sendAdminNotificationEmail(orderWithDates);
    
    // Send customer receipt email
    const customerEmailResult = await sendCustomerReceiptEmail(orderWithDates);
    
    // Return results
    return NextResponse.json({
      success: true,
      adminEmail: adminEmailResult,
      customerEmail: customerEmailResult
    });
  } catch (error) {
    console.error('API: Error sending order emails:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send emails' },
      { status: 500 }
    );
  }
} 