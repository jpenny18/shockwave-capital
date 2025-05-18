import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { updateOrderPaymentStatus, getOrdersByPaymentIntentId } from '../../../lib/firebase';
import { sendAdminNotificationEmail, sendCustomerReceiptEmail } from '../../../lib/email';

// Initialize Stripe with secret key
const stripeSecretKey = process.env.NODE_ENV === 'production'
  ? process.env.STRIPE_SECRET_KEY
  : process.env.STRIPE_TEST_SECRET_KEY;

const webhookSecret = process.env.NODE_ENV === 'production'
  ? process.env.STRIPE_WEBHOOK_SECRET
  : process.env.STRIPE_TEST_WEBHOOK_SECRET;

// Check if required environment variables are set
if (!stripeSecretKey) {
  console.error('Missing Stripe secret key. Please check your environment variables.');
}

if (!webhookSecret) {
  console.error('Missing Stripe webhook secret. Please check your environment variables.');
}

const stripe = new Stripe(stripeSecretKey || '');

// Function to send email notifications for successful payments
async function sendEmailsForSuccessfulPayment(paymentIntentId: string): Promise<{ success: boolean, emailCount: number }> {
  console.log(`[WebhookHandler] Starting email notifications for payment: ${paymentIntentId}`);
  
  // Check if Resend API key is available
  if (!process.env.RESEND_API_KEY) {
    console.error('[WebhookHandler] Missing Resend API key, cannot send emails');
    return { success: false, emailCount: 0 };
  }
  
  try {
    // Get orders associated with this payment intent
    const orders = await getOrdersByPaymentIntentId(paymentIntentId);
    console.log(`[WebhookHandler] Found ${orders.length} orders for payment intent ${paymentIntentId}`);
    
    if (!orders || orders.length === 0) {
      console.warn(`[WebhookHandler] No orders found for payment intent: ${paymentIntentId}`);
      return { success: false, emailCount: 0 };
    }
    
    let emailsSent = 0;
    
    // Send notification emails for each order
    for (const order of orders) {
      if (!order.id) {
        console.warn(`[WebhookHandler] Order has no ID, skipping emails: ${JSON.stringify(order)}`);
        continue;
      }
      
      console.log(`[WebhookHandler] Processing emails for order: ${order.id}`);
      
      try {
        // Send admin notification
        console.log(`[WebhookHandler] Sending admin notification for order: ${order.id}`);
        const adminEmailResult = await sendAdminNotificationEmail(order);
        
        if (adminEmailResult.success) {
          console.log(`[WebhookHandler] Admin email sent successfully for order ${order.id}`);
          emailsSent++;
        } else {
          console.error(`[WebhookHandler] Failed to send admin email for order ${order.id}:`, adminEmailResult.error);
        }
        
        // Send customer receipt
        console.log(`[WebhookHandler] Sending customer receipt to ${order.customerEmail} for order: ${order.id}`);
        const customerEmailResult = await sendCustomerReceiptEmail(order);
        
        if (customerEmailResult.success) {
          console.log(`[WebhookHandler] Customer email sent successfully to ${order.customerEmail}`);
          emailsSent++;
        } else {
          console.error(`[WebhookHandler] Failed to send customer email for order ${order.id}:`, customerEmailResult.error);
        }
      } catch (emailError) {
        console.error(`[WebhookHandler] Error sending emails for order ${order.id}:`, emailError);
      }
    }
    
    console.log(`[WebhookHandler] Email notification process completed. Emails sent: ${emailsSent}`);
    return { success: emailsSent > 0, emailCount: emailsSent };
  } catch (error) {
    console.error('[WebhookHandler] Error in sendEmailsForSuccessfulPayment:', error);
    return { success: false, emailCount: 0 };
  }
}

// Handle Stripe webhook events
export async function POST(request: NextRequest) {
  console.log('[WebhookHandler] Received Stripe webhook event');
  
  // Verify environment variables
  if (!stripeSecretKey) {
    console.error('[WebhookHandler] Missing Stripe secret key');
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
  }
  
  if (!webhookSecret) {
    console.error('[WebhookHandler] Missing Stripe webhook secret');
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
  }
  
  if (!process.env.RESEND_API_KEY) {
    console.warn('[WebhookHandler] Missing Resend API key - emails will not be sent');
  }

  try {
    // Get the signature from the headers
    const signature = request.headers.get('stripe-signature');
    
    if (!signature) {
      console.error('[WebhookHandler] No Stripe signature found in request headers');
      return NextResponse.json(
        { error: 'Missing Stripe signature' },
        { status: 400 }
      );
    }

    // Get the raw body as text
    const body = await request.text();
    
    // Verify and parse the webhook
    console.log('[WebhookHandler] Verifying Stripe webhook signature');
    let event: Stripe.Event;
    
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('[WebhookHandler] Error verifying webhook:', err);
      return NextResponse.json(
        { error: 'Invalid webhook signature' },
        { status: 400 }
      );
    }

    // Handle the event
    console.log(`[WebhookHandler] Processing event: ${event.type}`);
    
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log(`[WebhookHandler] Payment succeeded: ${paymentIntent.id}`);
        
        // Update order status in Firestore
        const orders = await getOrdersByPaymentIntentId(paymentIntent.id);
        if (orders && orders.length > 0) {
          console.log(`[WebhookHandler] Updating ${orders.length} orders to completed status`);
          
          for (const order of orders) {
            await updateOrderPaymentStatus(
              order.id,
              'completed',
              paymentIntent.id
            );
            console.log(`[WebhookHandler] Updated order ${order.id} to completed status`);
          }
          
          // Send email notifications
          console.log('[WebhookHandler] Initiating email notifications...');
          const emailResult = await sendEmailsForSuccessfulPayment(paymentIntent.id);
          console.log(`[WebhookHandler] Email notification result: ${emailResult.success ? 'Success' : 'Failed'}, ${emailResult.emailCount} emails sent`);
        } else {
          console.warn(`[WebhookHandler] No orders found for payment intent: ${paymentIntent.id}`);
        }
        
        break;
      }
      
      case 'payment_intent.payment_failed': {
        const failedPaymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log(`[WebhookHandler] Payment failed: ${failedPaymentIntent.id}`);
        
        // Update order status in Firestore
        const failedOrders = await getOrdersByPaymentIntentId(failedPaymentIntent.id);
        if (failedOrders && failedOrders.length > 0) {
          console.log(`[WebhookHandler] Updating ${failedOrders.length} orders to failed status`);
          
          for (const order of failedOrders) {
            await updateOrderPaymentStatus(
              order.id,
              'failed',
              failedPaymentIntent.id
            );
            console.log(`[WebhookHandler] Updated order ${order.id} to failed status`);
          }
        } else {
          console.warn(`[WebhookHandler] No orders found for failed payment intent: ${failedPaymentIntent.id}`);
        }
        
        break;
      }
      
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log(`[WebhookHandler] Checkout session completed: ${session.id}`);
        
        if (session.payment_intent) {
          const paymentIntentId = session.payment_intent.toString();
          
          // Update order status in Firestore
          const orders = await getOrdersByPaymentIntentId(paymentIntentId);
          if (orders && orders.length > 0) {
            console.log(`[WebhookHandler] Updating ${orders.length} orders to completed status after checkout completion`);
            
            for (const order of orders) {
              await updateOrderPaymentStatus(
                order.id,
                'completed',
                paymentIntentId
              );
              console.log(`[WebhookHandler] Updated order ${order.id} to completed status after checkout`);
            }
            
            // Send email notifications
            console.log('[WebhookHandler] Initiating email notifications after checkout...');
            const emailResult = await sendEmailsForSuccessfulPayment(paymentIntentId);
            console.log(`[WebhookHandler] Checkout email notification result: ${emailResult.success ? 'Success' : 'Failed'}, ${emailResult.emailCount} emails sent`);
          } else {
            console.warn(`[WebhookHandler] No orders found for checkout session with payment intent: ${paymentIntentId}`);
          }
        } else {
          console.warn('[WebhookHandler] Checkout session has no payment intent');
        }
        
        break;
      }
      
      default:
        console.log(`[WebhookHandler] Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('[WebhookHandler] Error handling webhook:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Handle preflight requests
export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
} 