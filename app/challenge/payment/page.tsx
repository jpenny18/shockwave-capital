'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Particles from '../../components/Particles';
import { 
  CreditCard, 
  Bitcoin, 
  ChevronDown, 
  ChevronUp, 
  Check,
  Shield,
  RefreshCcw,
  HeadphonesIcon,
  Mail
} from 'lucide-react';
import BitcoinPayment from '../../components/BitcoinPayment';
import StripeCardForm from '../../components/StripeCardForm';

interface ChallengeData {
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
  discount?: {
    id: string;
    code: string;
    type: 'percentage' | 'fixed';
    value: number;
  };
}

const validateChallengeData = (data: ChallengeData | null): boolean => {
  if (!data) return false;
  
  // Required fields
  const requiredFields = [
    data.type,
    data.amount,
    data.platform,
    data.price,
    data.formData.firstName,
    data.formData.lastName,
    data.formData.email,
    data.formData.phone,
    data.formData.country
  ];
  
  return requiredFields.every(field => field && String(field).trim() !== '');
};

const PaymentProcessingOverlay = () => (
  <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 rounded-2xl">
    <div className="text-center">
      <div className="w-12 h-12 border-2 border-[#0FF1CE] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-white">Processing payment...</p>
    </div>
  </div>
);

const PriceDisplay = ({ originalPrice, finalPrice, discount }: { 
  originalPrice: number;
  finalPrice: number;
  discount?: ChallengeData['discount'];
}) => (
  <div className="mb-6 p-4 bg-[#151515] rounded-lg">
    <div className="flex justify-between items-center">
      <div>
        <div className="text-gray-400">Total Amount</div>
        {discount && (
          <div className="text-[#0FF1CE] text-sm mt-1 flex items-center gap-2">
            <Check size={14} />
            <span>
              {discount.code} ({discount.type === 'percentage' 
                ? `${discount.value}% off` 
                : `$${discount.value.toFixed(2)} off`})
            </span>
          </div>
        )}
      </div>
      <div className="text-right">
        {discount && (
          <div className="text-gray-400 line-through text-sm mb-1">
            ${originalPrice.toFixed(2)}
          </div>
        )}
        <div className="text-2xl font-bold text-[#0FF1CE]">
          ${finalPrice.toFixed(2)}
        </div>
      </div>
    </div>
  </div>
);

export default function PaymentPage() {
  const CRYPTO_PAYMENTS_ENABLED = false; // Feature flag for crypto payments
  
  const router = useRouter();
  const [challengeData, setChallengeData] = useState<ChallengeData | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'crypto' | null>(null);
  const [isCardExpanded, setIsCardExpanded] = useState(false);
  const [isCryptoExpanded, setIsCryptoExpanded] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [isLoadingPaymentIntent, setIsLoadingPaymentIntent] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  useEffect(() => {
    const storedData = sessionStorage.getItem('challengeData');
    if (!storedData) {
      router.push('/challenge');
      return;
    }
    
    const parsedData = JSON.parse(storedData);
    if (!validateChallengeData(parsedData)) {
      router.push('/challenge');
      return;
    }
    
    setChallengeData(parsedData);
  }, [router]);

  // Function to create a payment intent
  const createPaymentIntent = async () => {
    if (!challengeData) return;
    
    try {
      setIsLoadingPaymentIntent(true);
      setPaymentError(null);
      
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: challengeData.price,
          email: challengeData.formData.email,
          metadata: {
            challengeType: challengeData.type,
            challengeAmount: challengeData.amount,
            platform: challengeData.platform,
            customerName: `${challengeData.formData.firstName} ${challengeData.formData.lastName}`,
            existingPaymentIntentId: paymentIntentId || undefined,
            discountCode: challengeData.discount?.code,
            discountId: challengeData.discount?.id,
            originalAmount: challengeData.discount ? Math.round(challengeData.price / (1 - challengeData.discount.value / 100)) : challengeData.price
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create payment intent');
      }

      const data = await response.json();
      console.log('Payment intent created in parent component:', data.paymentIntentId);
      
      setClientSecret(data.clientSecret);
      setPaymentIntentId(data.paymentIntentId);
      
    } catch (error) {
      console.error('Error creating payment intent:', error);
      setPaymentError(error instanceof Error ? error.message : 'Failed to initialize payment. Please try again later.');
    } finally {
      setIsLoadingPaymentIntent(false);
    }
  };

  const getCryptoPrice = () => {
    if (!challengeData?.price) return 0;
    return Math.round(challengeData.price * 0.9); // 10% discount
  };

  const handlePaymentSelect = async (method: 'card' | 'crypto') => {
    if (method === 'card') {
      const wasExpanded = isCardExpanded;
      setIsCardExpanded(!wasExpanded);
      setIsCryptoExpanded(false);
      
      // If expanding the card section and we don't have a client secret yet, create a payment intent
      if (!wasExpanded && !clientSecret) {
        await createPaymentIntent();
      }
    } else {
      setIsCryptoExpanded(!isCryptoExpanded);
      setIsCardExpanded(false);
    }
    setPaymentMethod(method);
  };

  if (!challengeData) {
    return (
      <div className="bg-gradient-to-b from-[#0D0D0D] via-[#121212] to-[#151515] text-white min-h-screen font-sans">
        <Particles />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex justify-center items-center min-h-[60vh]">
            <div className="animate-spin w-12 h-12 border-2 border-[#0FF1CE] border-t-transparent rounded-full"></div>
          </div>
        </div>
      </div>
    );
  }

  // Render card payment form or loading state
  const renderCardPaymentSection = () => {
    if (isLoadingPaymentIntent) {
      return (
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin w-8 h-8 border-2 border-[#0FF1CE] border-t-transparent rounded-full"></div>
          <span className="ml-3 text-white/70">Initializing payment...</span>
        </div>
      );
    }
    
    if (paymentError) {
      return (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
          {paymentError}
          <button
            className="mt-4 px-4 py-2 bg-[#0FF1CE]/10 hover:bg-[#0FF1CE]/20 text-white rounded-lg"
            onClick={createPaymentIntent}
          >
            Try Again
          </button>
        </div>
      );
    }
    
    if (!clientSecret) {
      return (
        <div className="p-6 text-center">
          <p className="text-white/70">Unable to initialize payment. Please try again.</p>
          <button
            className="mt-4 px-4 py-2 bg-[#0FF1CE]/10 hover:bg-[#0FF1CE]/20 text-white rounded-lg"
            onClick={createPaymentIntent}
          >
            Initialize Payment
          </button>
        </div>
      );
    }
    
    // Only render the StripeCardForm when clientSecret is available
    return (
      <StripeCardForm
        clientSecret={clientSecret}
        challengeData={challengeData}
        successRedirectPath="/challenge/success"
        onProcessingStateChange={setIsProcessingPayment}
      />
    );
  };

  // Add this where you want to display the price information
  const renderPriceSection = () => {
    if (!challengeData) return null;

    const originalPrice = challengeData.discount 
      ? Math.round(challengeData.price / (1 - challengeData.discount.value / 100))
      : challengeData.price;

    return (
      <PriceDisplay
        originalPrice={originalPrice}
        finalPrice={challengeData.price}
        discount={challengeData.discount}
      />
    );
  };

  return (
    <div className="bg-gradient-to-b from-[#0D0D0D] via-[#121212] to-[#151515] text-white min-h-screen font-sans">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full bg-[#0FF1CE]/[0.02] background-noise"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full md:w-3/4 h-full rounded-full bg-[#0FF1CE]/[0.03] blur-[150px] opacity-60"></div>
      <Particles />

      {/* Main Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">Complete Your Payment</h1>

        {/* Payment Support Notice */}
        <div className="mb-8 bg-[#1A1A1A] rounded-xl border border-[#0FF1CE]/30 overflow-hidden">
          <div className="px-4 py-3 bg-[#0FF1CE]/10 border-b border-[#0FF1CE]/20">
            <h3 className="text-[#0FF1CE] font-medium">Having trouble with your payment?</h3>
          </div>
          <div className="p-4 flex items-start gap-3">
            <Mail className="text-[#0FF1CE] w-5 h-5 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-gray-300">
              If your card declines or you encounter any payment issues, please email{' '}
              <a href="mailto:support@shockwave-capital.com" className="text-[#0FF1CE] hover:underline">
                support@shockwave-capital.com
              </a>
              {' '}for alternative payment methods or assistance.
            </p>
          </div>
        </div>

        {renderPriceSection()}

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left Column - Payment Methods */}
          <div className="lg:col-span-3">
            <div className="bg-[#0D0D0D]/80 backdrop-blur-sm rounded-2xl p-6 border border-[#2F2F2F]/50 mb-8">
              <h2 className="text-xl font-semibold mb-6">Payment Methods</h2>

              {/* Credit Card Payment Option */}
              <div className="mb-4">
              <button
                onClick={() => handlePaymentSelect('card')}
                  className="w-full bg-[#1A1A1A] hover:bg-[#212121] border border-[#2F2F2F]/50 rounded-xl p-4 transition duration-200"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <CreditCard className="text-[#0FF1CE] mr-3" size={20} />
                      <span className="font-medium">Credit/Debit Card</span>
                    </div>
                    <div className="flex items-center">
                      <span className="mr-2">${challengeData.price.toFixed(2)}</span>
                      {isCardExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                  </div>
                </button>

                {isCardExpanded && (
                  <div className="mt-4 relative">
                    {isProcessingPayment && <PaymentProcessingOverlay />}
                    <div className="bg-[#151515] rounded-xl p-5 border border-[#2F2F2F]/50">
                      {renderCardPaymentSection()}
                    </div>
                  </div>
                )}

                {/* Trust Badges */}
                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="bg-[#151515] rounded-xl p-4 text-center border border-[#2F2F2F]/50 hover:border-[#0FF1CE]/50 transition-colors group">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[#0FF1CE]/10 flex items-center justify-center group-hover:bg-[#0FF1CE]/20 transition-colors">
                      <Shield className="text-[#0FF1CE]" size={24} />
                    </div>
                    <div className="text-[#0FF1CE] font-medium mb-1 text-xs">Secure Payment</div>
                    <div className="text-[0.5rem] text-gray-400 leading-relaxed">256-bit SSL encryption for maximum security</div>
                  </div>
                  
                  <div className="bg-[#151515] rounded-xl p-4 text-center border border-[#2F2F2F]/50 hover:border-[#0FF1CE]/50 transition-colors group">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[#0FF1CE]/10 flex items-center justify-center group-hover:bg-[#0FF1CE]/20 transition-colors">
                      <RefreshCcw className="text-[#0FF1CE]" size={24} />
                    </div>
                    <div className="text-[#0FF1CE] font-medium mb-1 text-xs">Money Back Guarantee</div>
                    <div className="text-[0.5rem] text-gray-400 leading-relaxed">Full refund after successfully completing the challenge</div>
                  </div>

                  <div className="bg-[#151515] rounded-xl p-4 text-center border border-[#2F2F2F]/50 hover:border-[#0FF1CE]/50 transition-colors group">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[#0FF1CE]/10 flex items-center justify-center group-hover:bg-[#0FF1CE]/20 transition-colors">
                      <HeadphonesIcon className="text-[#0FF1CE]" size={24} />
                    </div>
                    <div className="text-[#0FF1CE] font-medium mb-1 text-xs">24/7 Support</div>
                    <div className="text-[0.5rem] text-gray-400 leading-relaxed">Round-the-clock customer service assistance</div>
                  </div>
                </div>
              </div>
              
              {/* Crypto Payment Option - Only render if enabled */}
              {CRYPTO_PAYMENTS_ENABLED && (
                      <div>
                  <button
                    onClick={() => handlePaymentSelect('crypto')}
                    className="w-full bg-[#1A1A1A] hover:bg-[#212121] border border-[#2F2F2F]/50 rounded-xl p-4 transition duration-200"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Bitcoin className="text-[#0FF1CE] mr-3" size={20} />
                        <span className="font-medium">Bitcoin (10% Off)</span>
                      </div>
                      <div className="flex items-center">
                        <span className="mr-2">${getCryptoPrice()}</span>
                        {isCryptoExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </div>
                    </div>
                  </button>

                  {isCryptoExpanded && (
                    <div className="mt-4">
                      <div className="bg-[#151515] rounded-xl border border-[#2F2F2F]/50 relative">
                        {isProcessingPayment && <PaymentProcessingOverlay />}
                        {/* Bitcoin Payment Component */}
                        <BitcoinPayment
                          challengeData={challengeData}
                          successRedirectPath="/challenge/success"
                          onProcessingStateChange={setIsProcessingPayment}
                          discountPercentage={10}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-2">
            <div className="bg-[#0D0D0D]/80 backdrop-blur-sm rounded-2xl p-6 border border-[#2F2F2F]/50 sticky top-8">
              <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
              
              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-white/70">Challenge Type:</span>
                  <span className="font-medium">{challengeData.type}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-white/70">Account Size:</span>
                  <span className="font-medium">{challengeData.amount}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-white/70">Platform:</span>
                  <span className="font-medium">{challengeData.platform}</span>
                    </div>
                    </div>
                    
              <div className="border-t border-[#2F2F2F]/50 pt-4 mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-white/70">Subtotal:</span>
                  <span className="font-medium">${challengeData.price.toFixed(2)}</span>
                </div>
                {CRYPTO_PAYMENTS_ENABLED && paymentMethod === 'crypto' && (
                  <div className="flex justify-between mb-2 text-green-400">
                    <span>Crypto Discount (10%):</span>
                    <span>-${(challengeData.price - getCryptoPrice()).toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-semibold mt-4">
                  <span>Total:</span>
                  <span className="text-[#0FF1CE]">
                    ${((CRYPTO_PAYMENTS_ENABLED && paymentMethod === 'crypto') ? getCryptoPrice() : challengeData.price).toFixed(2)}
                  </span>
                </div>
              </div>
              
              <div className="text-sm text-white/60">
                <p className="mb-2">By completing this purchase, you agree to our Terms of Service and acknowledge that all sales are final.</p>
                <p>Need help? <a href="#" className="text-[#0FF1CE] hover:underline">Contact Support</a></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 