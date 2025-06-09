'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Particles from '../../components/Particles';
import { 
  Bitcoin, 
  ChevronDown, 
  ChevronUp, 
  Check,
  Shield,
  RefreshCcw,
  HeadphonesIcon,
  Mail
} from 'lucide-react';
import CryptoPayment from '../../components/CryptoPayment';

interface ResetData {
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
  isReset: boolean;
}

interface CryptoPrice {
  BTC: number;
  ETH: number;
  USDT: number;
  USDC: number;
}

const validateResetData = (data: ResetData | null): boolean => {
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
    data.formData.country,
    data.isReset
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
  discount?: ResetData['discount'];
}) => (
  <div className="mb-6 p-4 bg-[#151515] rounded-lg">
    <div className="flex justify-between items-center">
      <div>
        <div className="text-gray-400">Reset Price</div>
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

export default function ResetPaymentPage() {
  const router = useRouter();
  const [resetData, setResetData] = useState<ResetData | null>(null);
  const [isCryptoExpanded, setIsCryptoExpanded] = useState(true);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [cryptoPrices, setCryptoPrices] = useState<CryptoPrice>({ BTC: 0, ETH: 0, USDT: 1, USDC: 1 });

  useEffect(() => {
    const storedData = sessionStorage.getItem('resetData');
    if (!storedData) {
      router.push('/reset');
      return;
    }
    
    const parsedData = JSON.parse(storedData);
    if (!validateResetData(parsedData)) {
      router.push('/reset');
      return;
    }
    
    setResetData(parsedData);
  }, [router]);

  // Fetch crypto prices every 15 minutes
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await fetch('/api/crypto/prices');
        const data = await response.json();
        setCryptoPrices(data);
      } catch (error) {
        console.error('Error fetching crypto prices:', error);
      }
    };

    fetchPrices(); // Initial fetch
    const interval = setInterval(fetchPrices, 15 * 60 * 1000); // Fetch every 15 minutes

    return () => clearInterval(interval);
  }, []);

  const handleCryptoToggle = () => {
    setIsCryptoExpanded(!isCryptoExpanded);
  };

  if (!resetData) {
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

  // Add this where you want to display the price information
  const renderPriceSection = () => {
    if (!resetData) return null;

    const originalPrice = resetData.discount 
      ? Math.round(resetData.price / (1 - resetData.discount.value / 100))
      : resetData.price;

    return (
      <PriceDisplay
        originalPrice={originalPrice}
        finalPrice={resetData.price}
        discount={resetData.discount}
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
        <h1 className="text-3xl font-bold text-white mb-8 text-center">Complete Your Account Reset</h1>

        {/* Payment Support Notice */}
        <div className="mb-8 bg-[#1A1A1A] rounded-xl border border-[#0FF1CE]/30 overflow-hidden">
          <div className="px-4 py-3 bg-[#0FF1CE]/10 border-b border-[#0FF1CE]/20">
            <h3 className="text-[#0FF1CE] font-medium">Having trouble with your payment?</h3>
          </div>
          <div className="p-4 flex items-start gap-3">
            <Mail className="text-[#0FF1CE] w-5 h-5 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-gray-300">
              If you encounter any payment issues, please email{' '}
              <a href="mailto:support@shockwave-capital.com" className="text-[#0FF1CE] hover:underline">
                support@shockwave-capital.com
              </a>
              {' '}for alternative payment methods or assistance.
            </p>
          </div>
        </div>

        {/* Reset Confirmation Notice */}
        <div className="mb-8 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-xl border border-orange-500/20 p-4">
          <div className="flex items-start gap-3">
            <RefreshCw className="text-orange-500 w-5 h-5 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-orange-500 font-medium mb-1">Account Reset Confirmation</h3>
              <p className="text-sm text-gray-300">
                You're about to reset your {resetData.type} Challenge ({resetData.amount}) account. 
                Upon payment confirmation, you'll receive fresh account credentials within minutes.
              </p>
            </div>
          </div>
        </div>

        {renderPriceSection()}

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left Column - Payment Methods */}
          <div className="lg:col-span-3">
            <div className="bg-[#0D0D0D]/80 backdrop-blur-sm rounded-2xl p-6 border border-[#2F2F2F]/50 mb-8">
              <h2 className="text-xl font-semibold mb-6">Payment Method</h2>

              {/* Crypto Payment Option */}
              <div className="mb-4">
                <button
                  onClick={handleCryptoToggle}
                  className="w-full bg-[#1A1A1A] hover:bg-[#212121] border border-[#2F2F2F]/50 rounded-xl p-4 transition duration-200"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Bitcoin className="text-[#0FF1CE] mr-3" size={20} />
                      <span className="font-medium">Cryptocurrency</span>
                    </div>
                    <div className="flex items-center">
                      <span className="mr-2">${resetData.price.toFixed(2)}</span>
                      {isCryptoExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                  </div>
                </button>

                {isCryptoExpanded && (
                  <div className="mt-4">
                    <div className="bg-[#151515] rounded-xl border border-[#2F2F2F]/50 relative">
                      {isProcessingPayment && <PaymentProcessingOverlay />}
                      <CryptoPayment
                        challengeData={resetData}
                        successRedirectPath="/reset/success"
                        onProcessingStateChange={setIsProcessingPayment}
                        cryptoPrices={cryptoPrices}
                      />
                    </div>
                  </div>
                )}
              </div>

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
                  <div className="text-[#0FF1CE] font-medium mb-1 text-xs">Instant Reset</div>
                  <div className="text-[0.5rem] text-gray-400 leading-relaxed">Fresh account credentials delivered immediately</div>
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
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-2">
            <div className="bg-[#0D0D0D]/80 backdrop-blur-sm rounded-2xl p-6 border border-[#2F2F2F]/50 sticky top-8">
              <h2 className="text-xl font-semibold mb-6">Reset Summary</h2>
              
              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-white/70">Challenge Type:</span>
                  <span className="font-medium">{resetData.type}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-white/70">Account Size:</span>
                  <span className="font-medium">{resetData.amount}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-white/70">Platform:</span>
                  <span className="font-medium">{resetData.platform}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-white/70">Service:</span>
                  <span className="font-medium text-orange-500">Account Reset</span>
                </div>
              </div>
              
              <div className="border-t border-[#2F2F2F]/50 pt-4 mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-white/70">Reset Price:</span>
                  <span className="font-medium">${resetData.price.toFixed(2)}</span>
                </div>
                {resetData.discount && (
                  <div className="flex justify-between mb-2 text-green-400">
                    <span>Discount ({resetData.discount.code}):</span>
                    <span>
                      -{resetData.discount.type === 'percentage' 
                        ? `${resetData.discount.value}%` 
                        : `$${resetData.discount.value.toFixed(2)}`}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-semibold mt-4">
                  <span>Total:</span>
                  <span className="text-[#0FF1CE]">${resetData.price.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-[#0FF1CE]/10 to-[#00D4FF]/10 p-4 rounded-lg border border-[#0FF1CE]/20 mb-4">
                <h3 className="text-[#0FF1CE] font-medium mb-2 text-sm">What You Get:</h3>
                <ul className="text-xs text-gray-300 space-y-1">
                  <li>• Fresh account with clean drawdown</li>
                  <li>• New login credentials within minutes</li>
                  <li>• All trading rules reset to zero</li>
                  <li>• Same challenge objectives</li>
                  <li>• Full platform access immediately</li>
                </ul>
              </div>
              
              <div className="text-sm text-white/60">
                <p className="mb-2">By completing this reset, you agree that your previous account will be permanently closed and cannot be recovered.</p>
                <p>Need help? <a href="mailto:support@shockwave-capital.com" className="text-[#0FF1CE] hover:underline">Contact Support</a></p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .background-noise {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 250 250' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E");
          opacity: 0.15;
        }
      `}</style>
    </div>
  );
} 