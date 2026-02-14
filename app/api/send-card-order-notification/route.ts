import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export async function POST(request: NextRequest) {
  try {
    const orderData = await request.json();
    
    const { data, error } = await resend.emails.send({
      from: 'support@shockwave-capital.com',
      to: 'support@shockwave-capital.com',
      subject: `New Card Order: ${orderData.challengeType} Challenge (${orderData.challengeAmount})`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
          <div style="background-color: #0D0D0D; padding: 15px; margin-bottom: 20px; border-radius: 5px;">
            <h1 style="color: #0FF1CE; margin: 0; font-size: 24px;">New Card Order Received</h1>
          </div>
          
          <div style="margin-bottom: 30px;">
            <p style="margin-bottom: 5px;"><strong>Status:</strong> <span style="color: #FFA500;">Pending Payment</span></p>
            <p style="margin-bottom: 5px;"><strong>Date:</strong> ${new Date().toLocaleString()}</p>
          </div>
          
          <div style="margin-bottom: 30px;">
            <h2 style="color: #0FF1CE; font-size: 18px; margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 5px;">Customer Details</h2>
            <p style="margin-bottom: 5px;"><strong>Name:</strong> ${orderData.firstName} ${orderData.lastName}</p>
            <p style="margin-bottom: 5px;"><strong>Email:</strong> ${orderData.customerEmail}</p>
            <p style="margin-bottom: 5px;"><strong>Phone:</strong> ${orderData.phone}</p>
            <p style="margin-bottom: 5px;"><strong>Country:</strong> ${orderData.country}</p>
            ${orderData.discordUsername ? `<p style="margin-bottom: 5px;"><strong>Discord:</strong> ${orderData.discordUsername}</p>` : ''}
          </div>
          
          <div style="margin-bottom: 30px;">
            <h2 style="color: #0FF1CE; font-size: 18px; margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 5px;">Order Details</h2>
            <p style="margin-bottom: 5px;"><strong>Challenge Type:</strong> ${orderData.challengeType}</p>
            <p style="margin-bottom: 5px;"><strong>Account Size:</strong> ${orderData.challengeAmount}</p>
            <p style="margin-bottom: 5px;"><strong>Platform:</strong> ${orderData.platform}</p>
            <p style="margin-bottom: 5px;"><strong>Payment Method:</strong> Credit/Debit Card (Whop)</p>
            <p style="margin-bottom: 5px;"><strong>Amount:</strong> ${formatCurrency(orderData.totalAmount)}</p>
            ${orderData.addOns && orderData.addOns.length > 0 ? `<p style="margin-bottom: 5px;"><strong>Add-ons:</strong> ${orderData.addOns.join(', ')}</p>` : ''}
          </div>
          
          <div style="background-color: #FFF9E6; padding: 15px; border-radius: 5px; border-left: 4px solid #FFA500; margin-bottom: 20px;">
            <p style="margin: 0; color: #666;"><strong>Note:</strong> Customer has been redirected to Whop checkout. Monitor the card-orders dashboard for payment confirmation.</p>
          </div>
          
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; text-align: center; font-size: 12px; color: #666;">
            <p>This is an automated notification from Shockwave Capital.</p>
          </div>
        </div>
      `,
      text: `
        New Card Order Received
        
        Status: Pending Payment
        Date: ${new Date().toLocaleString()}
        
        Customer Details:
        Name: ${orderData.firstName} ${orderData.lastName}
        Email: ${orderData.customerEmail}
        Phone: ${orderData.phone}
        Country: ${orderData.country}
        ${orderData.discordUsername ? `Discord: ${orderData.discordUsername}` : ''}
        
        Order Details:
        Challenge Type: ${orderData.challengeType}
        Account Size: ${orderData.challengeAmount}
        Platform: ${orderData.platform}
        Payment Method: Credit/Debit Card (Whop)
        Amount: ${formatCurrency(orderData.totalAmount)}
        ${orderData.addOns && orderData.addOns.length > 0 ? `Add-ons: ${orderData.addOns.join(', ')}` : ''}
        
        Note: Customer has been redirected to Whop checkout. Monitor the card-orders dashboard for payment confirmation.
      `,
    });

    if (error) {
      console.error('Error sending card order notification:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, emailId: data?.id },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error sending card order notification:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send notification' },
      { status: 500 }
    );
  }
}
