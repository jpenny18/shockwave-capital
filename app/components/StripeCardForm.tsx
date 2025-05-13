'use client';

import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { Check } from 'lucide-react';
import { createOrder } from '../../lib/firebase';

// Initialize Stripe with publishable key
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_TEST_PUBLISHABLE_KEY || ''
);

interface FormErrors {
  cardNumber?: string;
  cardExpiry?: string;
  cardCvc?: string;
  name?: string;
  general?: string;
}

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: '#ffffff',
      fontFamily: '"Inter", sans-serif',
      fontSize: '16px',
      '::placeholder': {
        color: 'rgba(255, 255, 255, 0.3)',
      },
    },
    invalid: {
      color: '#ff5e5e',
      iconColor: '#ff5e5e',
    },
  },
};

interface CardFormProps {
  clientSecret: string;
  challengeData: {
    type: string;
    amount: string;
    platform: string;
    formData: {
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      country: string;
      discordUsername?: string;
    };
    price: number;
  };
  successRedirectPath: string;
  onProcessingStateChange?: (isProcessing: boolean) => void;
}

const CardForm: React.FC<CardFormProps> = ({
  clientSecret,
  challengeData,
  successRedirectPath,
  onProcessingStateChange,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [cardholderName, setCardholderName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Wait for it to load before proceeding.
      return;
    }

    // Validate cardholder name
    if (!cardholderName.trim()) {
      setFormErrors(prev => ({ ...prev, name: 'Cardholder name is required' }));
      return;
    }

    setIsProcessing(true);
    onProcessingStateChange?.(true);

    try {
      const cardElement = elements.getElement(CardNumberElement);
      
      if (!cardElement) {
        throw new Error('Card element not found');
      }

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: cardholderName,
            email: challengeData.formData.email,
            phone: challengeData.formData.phone,
            address: {
              country: challengeData.formData.country,
            },
          },
        },
      });

      if (result.error) {
        setFormErrors(prev => ({ ...prev, general: result.error.message }));
      } else if (result.paymentIntent && result.paymentIntent.status === 'succeeded') {
        // Payment was successful, store in Firebase
        await createOrder({
          userId: null, // Will be linked to user account if available
          customerEmail: challengeData.formData.email,
          firstName: challengeData.formData.firstName,
          lastName: challengeData.formData.lastName,
          phone: challengeData.formData.phone,
          country: challengeData.formData.country,
          discordUsername: challengeData.formData.discordUsername,
          challengeType: challengeData.type,
          challengeAmount: challengeData.amount,
          platform: challengeData.platform,
          totalAmount: challengeData.price,
          paymentMethod: 'card',
          paymentStatus: 'completed',
          paymentIntentId: result.paymentIntent.id,
        });

        // Store payment success data for the success page
        sessionStorage.setItem('paymentSuccess', JSON.stringify({
          orderId: result.paymentIntent.id,
          amount: challengeData.price,
          challengeType: challengeData.type,
          paymentMethod: 'card',
        }));
        
        // Clear any payment intent data from session storage
        const paymentIntentKey = `payment_intent_${challengeData.type}_${challengeData.amount}_${challengeData.price}_${challengeData.formData.email}`;
        sessionStorage.removeItem(`${paymentIntentKey}_client_secret`);
        sessionStorage.removeItem(`${paymentIntentKey}_payment_intent_id`);

        // Redirect to success page
        window.location.href = successRedirectPath;
      }
    } catch (error) {
      console.error('Payment error:', error);
      setFormErrors(prev => ({ ...prev, general: 'An unexpected error occurred. Please try again.' }));
    } finally {
      setIsProcessing(false);
      onProcessingStateChange?.(false);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCardholderName(event.target.value);
    // Clear name error when user types
    if (formErrors.name) {
      setFormErrors(prev => ({ ...prev, name: undefined }));
    }
  };

  const handleStripeElementChange = (event: any) => {
    // Clear related error when user interacts with Stripe element
    if (event.elementType === 'cardNumber' && formErrors.cardNumber) {
      setFormErrors(prev => ({ ...prev, cardNumber: undefined }));
    } else if (event.elementType === 'cardExpiry' && formErrors.cardExpiry) {
      setFormErrors(prev => ({ ...prev, cardExpiry: undefined }));
    } else if (event.elementType === 'cardCvc' && formErrors.cardCvc) {
      setFormErrors(prev => ({ ...prev, cardCvc: undefined }));
    }
    
    // Clear general error when any element changes
    if (formErrors.general) {
      setFormErrors(prev => ({ ...prev, general: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Card Number */}
      <div className="mb-4">
        <label htmlFor="cardNumber" className="block text-sm font-medium text-white/70 mb-1">
          Card Number
        </label>
        <div className="bg-[#101010] border border-[#2F2F2F]/50 rounded-lg px-4 py-2">
          <CardNumberElement
            id="cardNumber"
            options={CARD_ELEMENT_OPTIONS}
            onChange={handleStripeElementChange}
          />
        </div>
        {formErrors.cardNumber && (
          <p className="text-red-500 text-xs mt-1">{formErrors.cardNumber}</p>
        )}
      </div>

      {/* Expiry and CVC */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="cardExpiry" className="block text-sm font-medium text-white/70 mb-1">
            Expiry Date
          </label>
          <div className="bg-[#101010] border border-[#2F2F2F]/50 rounded-lg px-4 py-2">
            <CardExpiryElement
              id="cardExpiry"
              options={CARD_ELEMENT_OPTIONS}
              onChange={handleStripeElementChange}
            />
          </div>
          {formErrors.cardExpiry && (
            <p className="text-red-500 text-xs mt-1">{formErrors.cardExpiry}</p>
          )}
        </div>
        <div>
          <label htmlFor="cardCvc" className="block text-sm font-medium text-white/70 mb-1">
            CVC
          </label>
          <div className="bg-[#101010] border border-[#2F2F2F]/50 rounded-lg px-4 py-2">
            <CardCvcElement
              id="cardCvc"
              options={CARD_ELEMENT_OPTIONS}
              onChange={handleStripeElementChange}
            />
          </div>
          {formErrors.cardCvc && (
            <p className="text-red-500 text-xs mt-1">{formErrors.cardCvc}</p>
          )}
        </div>
      </div>

      {/* Cardholder Name */}
      <div className="mb-4">
        <label htmlFor="name" className="block text-sm font-medium text-white/70 mb-1">
          Cardholder Name
        </label>
        <input
          type="text"
          id="name"
          value={cardholderName}
          onChange={handleInputChange}
          placeholder="John Doe"
          className={`w-full bg-[#101010] border ${formErrors.name ? 'border-red-500' : 'border-[#2F2F2F]/50'} rounded-lg px-4 py-2 text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-[#0FF1CE]/50`}
        />
        {formErrors.name && (
          <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>
        )}
      </div>

      {/* Secure Payment Note */}
      <div className="flex items-center mb-6 text-white/50 text-sm">
        <Check className="text-green-500 mr-2" size={16} />
        <span>Your payment information is secure and encrypted</span>
      </div>

      {/* Display General Error */}
      {formErrors.general && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
          {formErrors.general}
        </div>
      )}

      {/* Pay Now Button */}
      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full bg-[#0FF1CE] hover:bg-[#0FF1CE]/90 text-black font-semibold py-3 px-4 rounded-lg transition duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isProcessing ? 'Processing...' : `Pay $${challengeData.price.toFixed(2)}`}
      </button>
    </form>
  );
};

interface StripeCardFormProps {
  clientSecret: string; // Now required prop
  challengeData: CardFormProps['challengeData'];
  successRedirectPath: string;
  onProcessingStateChange?: (isProcessing: boolean) => void;
}

// Simplified StripeCardForm without internal payment intent fetching
const StripeCardForm: React.FC<StripeCardFormProps> = ({
  clientSecret,
  challengeData,
  successRedirectPath,
  onProcessingStateChange,
}) => {
  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <CardForm
        clientSecret={clientSecret}
        challengeData={challengeData}
        successRedirectPath={successRedirectPath}
        onProcessingStateChange={onProcessingStateChange}
      />
    </Elements>
  );
};

export default StripeCardForm; 