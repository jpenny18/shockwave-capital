import Stripe from 'stripe';

// Initialize Stripe with the appropriate API key based on environment
const stripeSecretKey = process.env.NODE_ENV === 'production' 
  ? process.env.STRIPE_SECRET_KEY 
  : process.env.STRIPE_TEST_SECRET_KEY;

if (!stripeSecretKey) {
  throw new Error('Missing Stripe secret key. Please check your environment variables.');
}

// Initialize the Stripe client
const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2023-10-16',
});

/**
 * Create a payment intent for a challenge purchase
 * @param amount Amount in cents (e.g., 1999 for $19.99)
 * @param customerEmail Customer's email address
 * @param metadata Additional metadata for the payment intent
 * @returns The created payment intent
 */
export async function createPaymentIntent(
  amount: number,
  customerEmail: string,
  metadata: Record<string, string> = {}
) {
  try {
    // Convert the amount to cents
    const amountInCents = Math.round(amount * 100);
    
    // Create the payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'usd',
      receipt_email: customerEmail,
      metadata: {
        ...metadata,
        integration_check: 'shockwave_capital_payment'
      },
    });
    
    return paymentIntent;
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw error;
  }
}

/**
 * Create a setup intent for saving a customer's payment method
 * @param customerEmail Customer's email address
 * @returns The created setup intent
 */
export async function createSetupIntent(customerEmail: string) {
  try {
    // First, create or retrieve a customer
    const customers = await stripe.customers.list({
      email: customerEmail,
      limit: 1,
    });
    
    let customer;
    
    if (customers.data.length > 0) {
      customer = customers.data[0];
    } else {
      customer = await stripe.customers.create({
        email: customerEmail,
      });
    }
    
    // Create the setup intent
    const setupIntent = await stripe.setupIntents.create({
      customer: customer.id,
      usage: 'off_session',
    });
    
    return setupIntent;
  } catch (error) {
    console.error('Error creating setup intent:', error);
    throw error;
  }
}

/**
 * Get payment intent details
 * @param paymentIntentId The ID of the payment intent to retrieve
 * @returns The payment intent details
 */
export async function getPaymentIntent(paymentIntentId: string) {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    return paymentIntent;
  } catch (error) {
    console.error('Error retrieving payment intent:', error);
    throw error;
  }
}

/**
 * Webhook handler for Stripe events
 * @param event The Stripe event to handle
 */
export async function handleStripeWebhook(event: Stripe.Event) {
  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log(`Payment succeeded: ${paymentIntent.id}`);
        // Process successful payment (update database, send confirmation, etc.)
        break;
      case 'payment_intent.payment_failed':
        const failedPaymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log(`Payment failed: ${failedPaymentIntent.id}`);
        // Handle failed payment
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  } catch (error) {
    console.error('Error handling Stripe webhook:', error);
    throw error;
  }
}

export default stripe; 