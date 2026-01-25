import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const isPending = body.isPending || false;

    // Format account information
    let accountInfo = '';
    if (body.subscriptionTier) {
      // Subscription-based order
      accountInfo = `
        <h3>Subscription Details:</h3>
        <p><strong>Tier:</strong> ${body.subscriptionTier} ($${body.subscriptionPrice}/month)</p>
        <p><strong>Active Accounts:</strong> ${body.accountsCount}</p>
        <h4>Account Configurations:</h4>
        <ul>
          ${body.accounts.map((acc: any, idx: number) => `
            <li>
              <strong>Account ${idx + 1}:</strong> ${acc.type} - ${acc.amount} - ${acc.platform}
            </li>
          `).join('')}
        </ul>
      `;
    } else {
      // Legacy single account order
      accountInfo = `
        <p><strong>Challenge Type:</strong> ${body.challengeType}</p>
        <p><strong>Account Size:</strong> ${body.challengeAmount}</p>
        <p><strong>Platform:</strong> ${body.platform}</p>
      `;
    }

    if (isPending) {
      // Send notification email to admin for PENDING order (payment initiated)
      await resend.emails.send({
        from: 'support@shockwave-capital.com',
        to: 'support@shockwave-capital.com',
        subject: `🔔 Card Payment Initiated - ${body.customerName}`,
        html: `
          <h2>Card Payment Initiated</h2>
          <p style="color: #FFA500;"><strong>⚠️ Status: PENDING PAYMENT</strong></p>
          <p>A customer has started the checkout process. Payment is pending completion.</p>
          <hr>
          <p><strong>Order ID:</strong> ${body.orderId}</p>
          <p><strong>Customer:</strong> ${body.customerName}</p>
          <p><strong>Email:</strong> ${body.customerEmail}</p>
          <p><strong>Phone:</strong> ${body.customerPhone}</p>
          <p><strong>Country:</strong> ${body.customerCountry}</p>
          ${body.customerDiscordUsername ? `<p><strong>Discord:</strong> ${body.customerDiscordUsername}</p>` : ''}
          ${accountInfo}
          <p><strong>Expected Amount:</strong> $${body.subscriptionPrice}/month</p>
          <p><strong>Payment Method:</strong> Card (Whop)</p>
          <p><strong>Plan ID:</strong> ${body.subscriptionPlanId}</p>
          <hr>
          <p><em>This order will be updated to COMPLETED once payment is confirmed.</em></p>
        `
      });
    } else {
      // Send confirmation email to customer for COMPLETED order
      await resend.emails.send({
        from: 'support@shockwave-capital.com',
        to: body.customerEmail,
        subject: 'Order Confirmation - Shockwave Capital',
        html: `
          <h2>Thank you for your purchase!</h2>
          <p>Hi ${body.customerName},</p>
          <p>Your subscription has been confirmed. Here are your order details:</p>
          ${accountInfo}
          <p><strong>Total Amount:</strong> $${body.totalAmount || body.subscriptionPrice}/month</p>
          <p><strong>Receipt ID:</strong> ${body.receiptId}</p>
          <p>You will receive your account credentials via email within 24 hours.</p>
          <p>If you have any questions, please contact us at support@shockwave-capital.com</p>
          <p>Best regards,<br>The Shockwave Capital Team</p>
        `
      });

      // Send notification email to admin for COMPLETED order
      await resend.emails.send({
        from: 'support@shockwave-capital.com',
        to: 'support@shockwave-capital.com',
        subject: `✅ Card Order Completed - ${body.customerName}`,
        html: `
          <h2>Card Order Completed</h2>
          <p style="color: #00FF00;"><strong>✅ Status: COMPLETED</strong></p>
          <hr>
          <p><strong>Order ID:</strong> ${body.orderId}</p>
          <p><strong>Customer:</strong> ${body.customerName}</p>
          <p><strong>Email:</strong> ${body.customerEmail}</p>
          <p><strong>Phone:</strong> ${body.customerPhone}</p>
          <p><strong>Country:</strong> ${body.customerCountry}</p>
          ${body.customerDiscordUsername ? `<p><strong>Discord:</strong> ${body.customerDiscordUsername}</p>` : ''}
          ${accountInfo}
          <p><strong>Total Amount:</strong> $${body.totalAmount || body.subscriptionPrice}/month</p>
          <p><strong>Payment Method:</strong> Card</p>
          <p><strong>Receipt ID:</strong> ${body.receiptId}</p>
          <p><strong>Plan ID:</strong> ${body.planId}</p>
        `
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending card order emails:', error);
    return NextResponse.json(
      { error: 'Failed to send emails' },
      { status: 500 }
    );
  }
}
