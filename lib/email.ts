import { Resend } from 'resend';
import { OrderData } from './firebase';

// Initialize Resend with API key (only used in server components/API routes)
const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Format currency as USD
 * @param amount Amount to format
 * @returns Formatted amount string
 */
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

/**
 * Send notification email to admin when a new order is placed
 * @param order Order details
 * @returns Email send result
 */
export async function sendAdminNotificationEmail(order: OrderData & { id?: string }) {
  try {
    console.log('Sending admin notification email for order:', order.id || 'unknown');
    
    const { data, error } = await resend.emails.send({
      from: 'support@shockwave-capital.com',
      to: 'support@shockwave-capital.com',
      subject: `New Order: ${order.challengeType} Challenge (${order.challengeAmount})`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
          <div style="background-color: #0D0D0D; padding: 15px; margin-bottom: 20px; border-radius: 5px;">
            <h1 style="color: #0FF1CE; margin: 0; font-size: 24px;">New Shockwave Capital Order</h1>
          </div>
          
          <div style="margin-bottom: 30px;">
            <p style="margin-bottom: 5px;"><strong>Order ID:</strong> ${order.id || 'N/A'}</p>
            <p style="margin-bottom: 5px;"><strong>Payment ID:</strong> ${order.transactionId || order.paymentIntentId || 'N/A'}</p>
            <p style="margin-bottom: 5px;"><strong>Date:</strong> ${order.createdAt.toDate().toLocaleString()}</p>
            <p style="margin-bottom: 5px;"><strong>Status:</strong> ${order.paymentStatus}</p>
          </div>
          
          <div style="margin-bottom: 30px;">
            <h2 style="color: #0FF1CE; font-size: 18px; margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 5px;">Customer Details</h2>
            <p style="margin-bottom: 5px;"><strong>Name:</strong> ${order.firstName} ${order.lastName}</p>
            <p style="margin-bottom: 5px;"><strong>Email:</strong> ${order.customerEmail}</p>
            <p style="margin-bottom: 5px;"><strong>Phone:</strong> ${order.phone}</p>
            <p style="margin-bottom: 5px;"><strong>Country:</strong> ${order.country}</p>
            ${order.discordUsername ? `<p style="margin-bottom: 5px;"><strong>Discord:</strong> ${order.discordUsername}</p>` : ''}
          </div>
          
          <div style="margin-bottom: 30px;">
            <h2 style="color: #0FF1CE; font-size: 18px; margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 5px;">Order Details</h2>
            <p style="margin-bottom: 5px;"><strong>Challenge Type:</strong> ${order.challengeType}</p>
            <p style="margin-bottom: 5px;"><strong>Account Size:</strong> ${order.challengeAmount}</p>
            <p style="margin-bottom: 5px;"><strong>Platform:</strong> ${order.platform}</p>
            <p style="margin-bottom: 5px;"><strong>Payment Method:</strong> ${order.paymentMethod === 'card' ? 'Credit/Debit Card' : 'Cryptocurrency'}</p>
            <p style="margin-bottom: 5px;"><strong>Amount Paid:</strong> ${formatCurrency(order.totalAmount)}</p>
          </div>
          
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; text-align: center; font-size: 12px; color: #666;">
            <p>This is an automated notification from Shockwave Capital.</p>
          </div>
        </div>
      `,
      text: `
        New Shockwave Capital Order
        
        Order ID: ${order.id || 'N/A'}
        Payment ID: ${order.transactionId || order.paymentIntentId || 'N/A'}
        Date: ${order.createdAt.toDate().toLocaleString()}
        Status: ${order.paymentStatus}
        
        Customer Details:
        Name: ${order.firstName} ${order.lastName}
        Email: ${order.customerEmail}
        Phone: ${order.phone}
        Country: ${order.country}
        ${order.discordUsername ? `Discord: ${order.discordUsername}` : ''}
        
        Order Details:
        Challenge Type: ${order.challengeType}
        Account Size: ${order.challengeAmount}
        Platform: ${order.platform}
        Payment Method: ${order.paymentMethod === 'card' ? 'Credit/Debit Card' : 'Cryptocurrency'}
        Amount Paid: ${formatCurrency(order.totalAmount)}
      `,
    });

    if (error) {
      console.error('Error sending admin notification email:', error);
      return { success: false, error };
    }

    console.log('Admin email sent successfully:', data?.id);
    return { success: true, data };
  } catch (error) {
    console.error('Error sending admin notification email:', error);
    return { success: false, error };
  }
}

/**
 * Send receipt email to customer with order details and next steps
 * @param order Order details
 * @returns Email send result
 */
export async function sendCustomerReceiptEmail(order: OrderData & { id?: string }) {
  try {
    console.log('Sending customer receipt email to:', order.customerEmail);
    
    const { data, error } = await resend.emails.send({
      from: 'support@shockwave-capital.com',
      to: order.customerEmail,
      subject: `Your Shockwave Capital ${order.challengeType} Challenge Order`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
          <div style="background-color: #0D0D0D; padding: 20px; margin-bottom: 20px; border-radius: 5px; text-align: center;">
            <h1 style="color: #0FF1CE; margin: 0; font-size: 24px;">Thanks for your order!</h1>
          </div>
          
          <div style="margin-bottom: 30px;">
            <p>Hello ${order.firstName},</p>
            <p>Thank you for purchasing our ${order.challengeType} Challenge. We're excited to see how you perform!</p>
            <p>Your payment has been processed successfully, and we're preparing your trading account credentials now.</p>
          </div>
          
          <div style="margin-bottom: 30px; background-color: #f9f9f9; padding: 15px; border-radius: 5px;">
            <h2 style="color: #333; font-size: 18px; margin-bottom: 15px; border-bottom: 1px solid #ddd; padding-bottom: 5px;">Order Summary</h2>
            <p style="margin-bottom: 5px;"><strong>Order ID:</strong> ${order.id || 'N/A'}</p>
            <p style="margin-bottom: 5px;"><strong>Date:</strong> ${order.createdAt.toDate().toLocaleString()}</p>
            <p style="margin-bottom: 5px;"><strong>Challenge Type:</strong> ${order.challengeType}</p>
            <p style="margin-bottom: 5px;"><strong>Account Size:</strong> ${order.challengeAmount}</p>
            <p style="margin-bottom: 5px;"><strong>Platform:</strong> ${order.platform}</p>
            <p style="margin-bottom: 5px;"><strong>Amount Paid:</strong> ${formatCurrency(order.totalAmount)}</p>
          </div>
          
          <div style="margin-bottom: 30px;">
            <h2 style="color: #0FF1CE; font-size: 18px; margin-bottom: 15px;">Next Steps</h2>
            
            <div style="margin-bottom: 15px; display: flex; align-items: flex-start;">
              <div style="background-color: #0FF1CE; color: #000; border-radius: 50%; width: 25px; height: 25px; display: flex; justify-content: center; align-items: center; margin-right: 10px; flex-shrink: 0;">1</div>
              <div>
                <h3 style="margin: 0 0 5px 0; color: #333;">Receive Your Login Credentials</h3>
                <p style="margin: 0; color: #666;">We'll send your login credentials to this email address within the next few hours. During busy periods, this may take up to 24 hours.</p>
              </div>
            </div>
            
            <div style="margin-bottom: 15px; display: flex; align-items: flex-start;">
              <div style="background-color: #0FF1CE; color: #000; border-radius: 50%; width: 25px; height: 25px; display: flex; justify-content: center; align-items: center; margin-right: 10px; flex-shrink: 0;">2</div>
              <div>
                <h3 style="margin: 0 0 5px 0; color: #333;">Log Into Your Trading Platform</h3>
                <p style="margin: 0; color: #666;">Download and install ${order.platform} if you haven't already, then log in using the credentials we'll provide.</p>
              </div>
            </div>
            
            <div style="margin-bottom: 15px; display: flex; align-items: flex-start;">
              <div style="background-color: #0FF1CE; color: #000; border-radius: 50%; width: 25px; height: 25px; display: flex; justify-content: center; align-items: center; margin-right: 10px; flex-shrink: 0;">3</div>
              <div>
                <h3 style="margin: 0 0 5px 0; color: #333;">Start Trading</h3>
                <p style="margin: 0; color: #666;">Begin trading with your new account. Remember to follow the challenge rules to maximize your chances of success!</p>
              </div>
            </div>
          </div>
          
          <div style="margin-bottom: 30px;">
            <p>If you have any questions or need assistance, please contact our support team at <a href="mailto:support@shockwave-capital.com" style="color: #0FF1CE;">support@shockwave-capital.com</a>.</p>
            <p style="margin-bottom: 0;">Best regards,</p>
            <p style="margin-top: 5px;"><strong>The Shockwave Capital Team</strong></p>
          </div>
          
          <div style="background-color: #0D0D0D; padding: 15px; border-radius: 5px; text-align: center; font-size: 12px; color: #999;">
            <p style="margin-bottom: 5px;">© ${new Date().getFullYear()} Shockwave Capital. All rights reserved.</p>
            <p style="margin: 0;">This is an automated email, please do not reply.</p>
          </div>
        </div>
      `,
      text: `
        Thanks for your order!
        
        Hello ${order.firstName},
        
        Thank you for purchasing our ${order.challengeType} Challenge. We're excited to see how you perform!
        Your payment has been processed successfully, and we're preparing your trading account credentials now.
        
        Order Summary:
        Order ID: ${order.id || 'N/A'}
        Date: ${order.createdAt.toDate().toLocaleString()}
        Challenge Type: ${order.challengeType}
        Account Size: ${order.challengeAmount}
        Platform: ${order.platform}
        Amount Paid: ${formatCurrency(order.totalAmount)}
        
        Next Steps:
        
        1. Receive Your Login Credentials
           We'll send your login credentials to this email address within the next few hours. 
           During busy periods, this may take up to 24 hours.
        
        2. Log Into Your Trading Platform
           Download and install ${order.platform} if you haven't already, then log in using the credentials we'll provide.
        
        3. Start Trading
           Begin trading with your new account. Remember to follow the challenge rules to maximize your chances of success!
        
        If you have any questions or need assistance, please contact our support team at support@shockwave-capital.com.
        
        Best regards,
        The Shockwave Capital Team
      `,
    });

    if (error) {
      console.error('Error sending customer receipt email:', error);
      return { success: false, error };
    }

    console.log('Customer receipt email sent successfully:', data?.id);
    return { success: true, data };
  } catch (error) {
    console.error('Error sending customer receipt email:', error);
    return { success: false, error };
  }
}

/**
 * Send challenge email to customer
 */
export async function sendChallengeEmail(data: {
  type: string;
  amount: string;
  platform: string;
  email: string;
  name: string;
}) {
  try {
    const result = await resend.emails.send({
      from: 'support@shockwave-capital.com',
      to: data.email,
      subject: `Your Shockwave Capital ${data.type} Challenge`,
      html: `
        <p>Hello ${data.name},</p>
        <p>Your ${data.type} Challenge (${data.amount}) has been confirmed.</p>
        <p>We will send your ${data.platform} login credentials shortly.</p>
        <p>Best regards,<br>The Shockwave Capital Team</p>
      `
    });

    if ('error' in result && result.error) {
      console.error('Error sending challenge email:', result.error);
      return { success: false, error: result.error };
    }

    return { success: true, data: result };
  } catch (error) {
    console.error('Error sending challenge email:', error);
    return { success: false, error };
  }
}

/**
 * Send notification email for crypto order
 * @param order Crypto order details
 * @returns Email send result
 */
export async function sendCryptoOrderEmail(order: {
  id: string;
  status: string;
  cryptoType: string;
  cryptoAmount: string;
  cryptoAddress: string;
  usdAmount: number;
  verificationPhrase: string;
  challengeType: string;
  challengeAmount: string;
  platform: string;
  customerEmail: string;
  customerName: string;
  customerPhone: string;
  customerCountry: string;
  customerDiscordUsername?: string;
  createdAt: string;
}) {
  try {
    console.log('Sending crypto order notification emails for:', order.id);
    
    // Send admin notification
    const adminResult = await resend.emails.send({
      from: 'support@shockwave-capital.com',
      to: 'support@shockwave-capital.com',
      subject: order.status === 'COMPLETED' 
        ? `Crypto Payment Confirmed: ${order.challengeType} Challenge (${order.challengeAmount})`
        : `New Crypto Order: ${order.challengeType} Challenge (${order.challengeAmount})`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
          <div style="background-color: #0D0D0D; padding: 15px; margin-bottom: 20px; border-radius: 5px;">
            <h1 style="color: #0FF1CE; margin: 0; font-size: 24px;">
              ${order.status === 'COMPLETED' ? 'Crypto Payment Confirmed' : 'New Crypto Order Received'}
            </h1>
          </div>
          
          <div style="margin-bottom: 30px;">
            <p style="margin-bottom: 5px;"><strong>Order ID:</strong> ${order.id}</p>
            <p style="margin-bottom: 5px;"><strong>Date:</strong> ${new Date(order.createdAt).toLocaleString()}</p>
            <p style="margin-bottom: 5px;"><strong>Status:</strong> ${order.status}</p>
          </div>
          
          <div style="margin-bottom: 30px;">
            <h2 style="color: #0FF1CE; font-size: 18px; margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 5px;">Customer Details</h2>
            <p style="margin-bottom: 5px;"><strong>Name:</strong> ${order.customerName}</p>
            <p style="margin-bottom: 5px;"><strong>Email:</strong> ${order.customerEmail}</p>
            <p style="margin-bottom: 5px;"><strong>Phone:</strong> ${order.customerPhone}</p>
            <p style="margin-bottom: 5px;"><strong>Country:</strong> ${order.customerCountry}</p>
            ${order.customerDiscordUsername ? `<p style="margin-bottom: 5px;"><strong>Discord:</strong> ${order.customerDiscordUsername}</p>` : ''}
          </div>
          
          <div style="margin-bottom: 30px;">
            <h2 style="color: #0FF1CE; font-size: 18px; margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 5px;">Order Details</h2>
            <p style="margin-bottom: 5px;"><strong>Challenge Type:</strong> ${order.challengeType}</p>
            <p style="margin-bottom: 5px;"><strong>Account Size:</strong> ${order.challengeAmount}</p>
            <p style="margin-bottom: 5px;"><strong>Platform:</strong> ${order.platform}</p>
            <p style="margin-bottom: 5px;"><strong>Payment Method:</strong> Cryptocurrency (${order.cryptoType})</p>
            <p style="margin-bottom: 5px;"><strong>Crypto Amount:</strong> ${order.cryptoAmount} ${order.cryptoType}</p>
            <p style="margin-bottom: 5px;"><strong>USD Amount:</strong> $${order.usdAmount.toFixed(2)}</p>
            <p style="margin-bottom: 5px;"><strong>Wallet Address:</strong> ${order.cryptoAddress}</p>
            <p style="margin-bottom: 5px;"><strong>Verification Phrase:</strong> ${order.verificationPhrase}</p>
          </div>
        </div>
      `
    });

    // Send customer notification
    const customerResult = await resend.emails.send({
      from: 'support@shockwave-capital.com',
      to: order.customerEmail,
      subject: order.status === 'COMPLETED'
        ? `Payment Confirmed - Your Shockwave Capital ${order.challengeType} Challenge`
        : `Your Shockwave Capital ${order.challengeType} Challenge Order`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
          <div style="background-color: #0D0D0D; padding: 20px; margin-bottom: 20px; border-radius: 5px; text-align: center;">
            <h1 style="color: #0FF1CE; margin: 0; font-size: 24px;">
              ${order.status === 'COMPLETED' ? 'Payment Confirmed!' : 'Thanks for your order!'}
            </h1>
          </div>
          
          <div style="margin-bottom: 30px;">
            <p>Hello ${order.customerName.split(' ')[0]},</p>
            ${order.status === 'COMPLETED' 
              ? `<p>Great news! We've confirmed your crypto payment for the ${order.challengeType} Challenge. Your order is now being processed.</p>
                 <p>Due to high demand, please allow up to 1 hour for your login credentials to be generated. In some cases, this might take up to 24 hours.</p>`
              : `<p>Thank you for purchasing our ${order.challengeType} Challenge. We're excited to see how you perform!</p>
                 <p>We've received your crypto payment request and will verify the transaction. Once confirmed, we'll prepare your trading account credentials.</p>`
            }
          </div>
          
          <div style="margin-bottom: 30px; background-color: #f9f9f9; padding: 15px; border-radius: 5px;">
            <h2 style="color: #333; font-size: 18px; margin-bottom: 15px; border-bottom: 1px solid #ddd; padding-bottom: 5px;">Order Summary</h2>
            <p style="margin-bottom: 5px;"><strong>Order ID:</strong> ${order.id}</p>
            <p style="margin-bottom: 5px;"><strong>Date:</strong> ${new Date(order.createdAt).toLocaleString()}</p>
            <p style="margin-bottom: 5px;"><strong>Challenge Type:</strong> ${order.challengeType}</p>
            <p style="margin-bottom: 5px;"><strong>Account Size:</strong> ${order.challengeAmount}</p>
            <p style="margin-bottom: 5px;"><strong>Platform:</strong> ${order.platform}</p>
            <p style="margin-bottom: 5px;"><strong>Payment Amount:</strong> ${order.cryptoAmount} ${order.cryptoType}</p>
            <p style="margin-bottom: 5px;"><strong>USD Value:</strong> $${order.usdAmount.toFixed(2)}</p>
          </div>
          
          ${order.status !== 'COMPLETED' ? `
          <div style="margin-bottom: 30px; background-color: #f9f9f9; padding: 15px; border-radius: 5px;">
            <h2 style="color: #333; font-size: 18px; margin-bottom: 15px; border-bottom: 1px solid #ddd; padding-bottom: 5px;">Payment Verification Details</h2>
            <p style="margin-bottom: 5px;"><strong>Verification Phrase:</strong> <span style="font-family: monospace; background-color: #eee; padding: 2px 4px; border-radius: 3px;">${order.verificationPhrase}</span></p>
            <p style="margin-top: 10px; color: #666; font-size: 14px;">Please keep these details for your records. They help us match your payment to your order.</p>
          </div>
          ` : ''}
          
          <div style="margin-bottom: 30px;">
            <h2 style="color: #0FF1CE; font-size: 18px; margin-bottom: 15px;">Next Steps</h2>
            
            ${order.status === 'COMPLETED' ? `
            <div style="margin-bottom: 15px; display: flex; align-items: flex-start;">
              <div style="background-color: #0FF1CE; color: #000; border-radius: 50%; width: 25px; height: 25px; display: flex; justify-content: center; align-items: center; margin-right: 10px; flex-shrink: 0;">1</div>
              <div>
                <h3 style="margin: 0 0 5px 0; color: #333;">Receive Your Login Credentials</h3>
                <p style="margin: 0; color: #666;">We're preparing your login credentials now. You'll receive them in a separate email within 1-24 hours.</p>
              </div>
            </div>
            
            <div style="margin-bottom: 15px; display: flex; align-items: flex-start;">
              <div style="background-color: #0FF1CE; color: #000; border-radius: 50%; width: 25px; height: 25px; display: flex; justify-content: center; align-items: center; margin-right: 10px; flex-shrink: 0;">2</div>
              <div>
                <h3 style="margin: 0 0 5px 0; color: #333;">Start Trading</h3>
                <p style="margin: 0; color: #666;">Once you receive your credentials, you can begin trading. Remember to follow the challenge rules to maximize your chances of success!</p>
              </div>
            </div>
            ` : `
            <div style="margin-bottom: 15px; display: flex; align-items: flex-start;">
              <div style="background-color: #0FF1CE; color: #000; border-radius: 50%; width: 25px; height: 25px; display: flex; justify-content: center; align-items: center; margin-right: 10px; flex-shrink: 0;">1</div>
              <div>
                <h3 style="margin: 0 0 5px 0; color: #333;">Payment Verification</h3>
                <p style="margin: 0; color: #666;">We'll verify your crypto payment. This usually takes 30-60 minutes but may take longer depending on network conditions.</p>
              </div>
            </div>
            
            <div style="margin-bottom: 15px; display: flex; align-items: flex-start;">
              <div style="background-color: #0FF1CE; color: #000; border-radius: 50%; width: 25px; height: 25px; display: flex; justify-content: center; align-items: center; margin-right: 10px; flex-shrink: 0;">2</div>
              <div>
                <h3 style="margin: 0 0 5px 0; color: #333;">Receive Your Login Credentials</h3>
                <p style="margin: 0; color: #666;">Once payment is confirmed, we'll send your login credentials to this email address.</p>
              </div>
            </div>
            
            <div style="margin-bottom: 15px; display: flex; align-items: flex-start;">
              <div style="background-color: #0FF1CE; color: #000; border-radius: 50%; width: 25px; height: 25px; display: flex; justify-content: center; align-items: center; margin-right: 10px; flex-shrink: 0;">3</div>
              <div>
                <h3 style="margin: 0 0 5px 0; color: #333;">Start Trading</h3>
                <p style="margin: 0; color: #666;">Begin trading with your new account. Remember to follow the challenge rules to maximize your chances of success!</p>
              </div>
            </div>
            `}
          </div>
          
          <div style="margin-bottom: 30px;">
            <p>If you have any questions or need assistance, please contact our support team at <a href="mailto:support@shockwave-capital.com" style="color: #0FF1CE;">support@shockwave-capital.com</a>.</p>
            <p style="margin-bottom: 0;">Best regards,</p>
            <p style="margin-top: 5px;"><strong>The Shockwave Capital Team</strong></p>
          </div>
          
          <div style="background-color: #0D0D0D; padding: 15px; border-radius: 5px; text-align: center; font-size: 12px; color: #999;">
            <p style="margin-bottom: 5px;">© ${new Date().getFullYear()} Shockwave Capital. All rights reserved.</p>
            <p style="margin: 0;">This is an automated email, please do not reply.</p>
          </div>
        </div>
      `
    });

    return {
      success: true,
      adminEmail: adminResult,
      customerEmail: customerResult
    };
  } catch (error) {
    console.error('Error sending crypto order emails:', error);
    return { success: false, error };
  }
} 