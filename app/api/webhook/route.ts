import { NextRequest, NextResponse } from 'next/server';
import { Stripe } from 'stripe';
import { handleStripeWebhook } from '../../../lib/stripe';
import { updateOrderPaymentStatus } from '../../../lib/firebase';

// Initialize Stripe with the appropriate API key based on environment
const stripeSecretKey = process.env.NODE_ENV === 'production' 
  ? process.env.STRIPE_SECRET_KEY 
  : process.env.STRIPE_TEST_SECRET_KEY;

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

if (!stripeSecretKey) {
  throw new Error('Missing Stripe secret key. Please check your environment variables.');
}

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2023-10-16',
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature || !webhookSecret) {
      return NextResponse.json(
        { error: 'Missing signature or webhook secret' },
        { status: 400 }
      );
    }

    // Verify the webhook signature
    let event: Stripe.Event;
    
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json(
        { error: 'Webhook signature verification failed' },
        { status: 400 }
      );
    }

    // Handle the webhook event
    try {
      switch (event.type) {
        case 'payment_intent.succeeded':
          const paymentIntent = event.data.object as Stripe.PaymentIntent;
          console.log(`Payment succeeded: ${paymentIntent.id}`);
          
          // Update order status in the database
          await updateOrderPaymentStatus(
            paymentIntent.id, 
            'completed', 
            paymentIntent.id
          );
          break;
          
        case 'payment_intent.payment_failed':
          const failedPaymentIntent = event.data.object as Stripe.PaymentIntent;
          console.log(`Payment failed: ${failedPaymentIntent.id}`);
          
          // Update order status in the database
          await updateOrderPaymentStatus(
            failedPaymentIntent.id, 
            'failed', 
            failedPaymentIntent.id
          );
          break;
          
        // Add more event handlers as needed
          
        default:
          console.log(`Unhandled event type: ${event.type}`);
      }

      // Forward the event to the general webhook handler
      await handleStripeWebhook(event);
      
      return NextResponse.json({ received: true });
    } catch (error) {
      console.error('Error handling webhook event:', error);
      return NextResponse.json(
        { error: 'Error handling webhook event' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Error processing webhook' },
      { status: 500 }
    );
  }
}

// Handle preflight requests
export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
} 