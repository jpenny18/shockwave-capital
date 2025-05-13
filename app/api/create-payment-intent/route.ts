import { NextRequest, NextResponse } from 'next/server';
import { createPaymentIntent, getPaymentIntent } from '../../../lib/stripe';
import { getOrdersByPaymentIntentId, db } from '../../../lib/firebase';
import { StripeError } from '@stripe/stripe-js';
import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';

async function validateDiscount(discountId: string, discountCode: string) {
  try {
    const discountRef = doc(db, 'discounts', discountId);
    const discountSnap = await getDoc(discountRef);
    
    if (!discountSnap.exists()) {
      throw new Error('Discount code not found');
    }
    
    const discount = discountSnap.data();
    
    // Validate the code matches
    if (discount.code !== discountCode) {
      throw new Error('Invalid discount code');
    }
    
    // Check if active
    if (!discount.active) {
      throw new Error('Discount code is inactive');
    }
    
    // Check expiration
    if (discount.expiresAt && new Date() > discount.expiresAt.toDate()) {
      throw new Error('Discount code has expired');
    }
    
    // Check usage limit
    if (discount.usageLimit !== null && discount.usageCount >= discount.usageLimit) {
      throw new Error('Discount code has reached its usage limit');
    }
    
    return discount;
  } catch (error) {
    console.error('Error validating discount:', error);
    throw error;
  }
}

async function incrementDiscountUsage(discountId: string) {
  try {
    const discountRef = doc(db, 'discounts', discountId);
    await updateDoc(discountRef, {
      usageCount: increment(1)
    });
  } catch (error) {
    console.error('Error incrementing discount usage:', error);
    // Don't throw here as this is not critical for the payment process
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, email, metadata } = body;
    
    // Log the request data for debugging
    console.log('Payment intent request:', { amount, email, metadata });

    // Validate amount
    if (!amount) {
      console.error('Missing required field: amount');
      return NextResponse.json(
        { error: 'Missing required field: amount' },
        { status: 400 }
      );
    }

    // Validate discount if provided
    if (metadata?.discountId && metadata?.discountCode) {
      try {
        await validateDiscount(metadata.discountId, metadata.discountCode);
      } catch (error) {
        return NextResponse.json(
          { error: error instanceof Error ? error.message : 'Invalid discount code' },
          { status: 400 }
        );
      }
    }

    const customerEmail = email || 'customer@example.com';
    
    // Check for existing payment intent
    if (metadata?.existingPaymentIntentId) {
      try {
        console.log('Found existing payment intent ID:', metadata.existingPaymentIntentId);
        
        const existingOrders = await getOrdersByPaymentIntentId(metadata.existingPaymentIntentId);
        
        if (existingOrders.length > 0) {
          console.log('Order exists in database for payment intent:', metadata.existingPaymentIntentId);
          
          try {
            const paymentIntent = await getPaymentIntent(metadata.existingPaymentIntentId);
            
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
          }
        }
      } catch (error) {
        console.error('Error checking existing payment intent:', error);
      }
    }
    
    // Create a new payment intent
    try {
      const paymentIntent = await createPaymentIntent(
        amount,
        customerEmail,
        {
          ...metadata,
          originalAmount: metadata?.originalAmount || amount
        }
      );
      
      // If successful and there's a discount, increment its usage
      if (metadata?.discountId) {
        await incrementDiscountUsage(metadata.discountId);
      }
      
      console.log('Payment intent created:', paymentIntent.id);
      
      return NextResponse.json({
        paymentIntentId: paymentIntent.id,
        clientSecret: paymentIntent.client_secret,
      });
    } catch (stripeError: unknown) {
      console.error('Stripe API error:', stripeError);
      const errorMessage = stripeError instanceof Error ? stripeError.message : 'Unknown error';
      return NextResponse.json(
        { error: `Stripe API error: ${errorMessage}` },
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