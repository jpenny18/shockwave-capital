import { NextRequest, NextResponse } from 'next/server';
import { createPaymentIntent, getPaymentIntent } from '../../../lib/stripe';
import { getOrdersByPaymentIntentId } from '../../../lib/firebase';
import { StripeError } from '@stripe/stripe-js';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, email, metadata } = body;
    
    // Log the request data for debugging
    console.log('Payment intent request:', { amount, email, metadata });

    // Less strict validation - only check if amount exists
    if (!amount) {
      console.error('Missing required field: amount');
      return NextResponse.json(
        { error: 'Missing required field: amount' },
        { status: 400 }
      );
    }

    // Optional email check
    const customerEmail = email || 'customer@example.com';
    
    // Check if we already have a payment intent for this email and metadata (prevent duplicates)
    // This is a simple approach, in production you might want a more sophisticated deduplication strategy
    // such as using idempotency keys with Stripe
    if (metadata?.existingPaymentIntentId) {
      try {
        console.log('Found existing payment intent ID:', metadata.existingPaymentIntentId);
        
        // Check if the payment intent already exists in our database
        const existingOrders = await getOrdersByPaymentIntentId(metadata.existingPaymentIntentId);
        
        if (existingOrders.length > 0) {
          console.log('Order exists in database for payment intent:', metadata.existingPaymentIntentId);
          
          // Retrieve the payment intent from Stripe to get its current status and client secret
          try {
            const paymentIntent = await getPaymentIntent(metadata.existingPaymentIntentId);
            
            // Only reuse payment intents that are not yet completed or canceled
            if (['succeeded', 'canceled'].includes(paymentIntent.status)) {
              console.log('Payment intent already completed or canceled, creating new one');
            } else {
              console.log('Reusing existing payment intent:', paymentIntent.id);
              return NextResponse.json({
                paymentIntentId: paymentIntent.id,
                clientSecret: paymentIntent.client_secret,
                message: 'Using existing payment intent',
              });
            }
          } catch (stripeError) {
            console.error('Error retrieving existing payment intent from Stripe:', stripeError);
            // Continue with creating a new payment intent if we can't retrieve the existing one
          }
        }
      } catch (error) {
        console.error('Error checking existing payment intent:', error);
        // Continue with creating a new payment intent
      }
    }
    
    // Create a new payment intent
    try {
      const paymentIntent = await createPaymentIntent(
        amount,
        customerEmail,
        metadata || {}
      );
      
      console.log('Payment intent created:', paymentIntent.id);
      
      return NextResponse.json({
        paymentIntentId: paymentIntent.id,
        clientSecret: paymentIntent.client_secret,
      });
    } catch (stripeError: unknown) {
      console.error('Stripe API error:', stripeError);
      const errorMessage = stripeError instanceof Error ? stripeError.message : 'Unknown error';
      return NextResponse.json(
        { 
          error: `Stripe API error: ${errorMessage}` 
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error creating payment intent:', error);
    
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    );
  }
}

// Handle preflight requests
export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
} 