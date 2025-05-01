'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Particles from '../../../components/Particles';
import { 
  CreditCard, 
  Bitcoin, 
  ChevronDown, 
  ChevronUp, 
  Check 
} from 'lucide-react';

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

export default function PaymentPage() {
  const router = useRouter();
  const [challengeData, setChallengeData] = useState<ChallengeData | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'crypto' | null>(null);
  const [isCardExpanded, setIsCardExpanded] = useState(false);
  const [isCryptoExpanded, setIsCryptoExpanded] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvc: '',
    name: ''
  });
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    const storedData = sessionStorage.getItem('challengeData');
    if (!storedData) {
      router.push('/dashboard/challenge');
      return;
    }
    
    const parsedData = JSON.parse(storedData);
    if (!validateChallengeData(parsedData)) {
      router.push('/dashboard/challenge');
      return;
    }
    
    setChallengeData(parsedData);
  }, [router]);

  const getCryptoPrice = () => {
    if (!challengeData?.price) return 0;
    return Math.round(challengeData.price * 0.9); // 10% discount
  };

  const handlePaymentSelect = (method: 'card' | 'crypto') => {
    if (method === 'card') {
      setIsCardExpanded(!isCardExpanded);
      setIsCryptoExpanded(false);
    } else {
      setIsCryptoExpanded(!isCryptoExpanded);
      setIsCardExpanded(false);
    }
    setPaymentMethod(method);
  };

  const handleCardInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Format card number with spaces
    if (name === 'number') {
      const formattedValue = value
        .replace(/\s/g, '')
        .replace(/(\d{4})/g, '$1 ')
        .trim()
        .slice(0, 19);
      
      setCardDetails(prev => ({ ...prev, number: formattedValue }));
      return;
    }
    
    // Format expiry date with slash
    if (name === 'expiry') {
      const sanitizedValue = value.replace(/[^\d]/g, '');
      let formattedValue = sanitizedValue;
      
      if (sanitizedValue.length > 2) {
        formattedValue = `${sanitizedValue.slice(0, 2)}/${sanitizedValue.slice(2, 4)}`;
      }
      
      setCardDetails(prev => ({ ...prev, expiry: formattedValue }));
      return;
    }
    
    setCardDetails(prev => ({ ...prev, [name]: value }));
  };

  const validateCardDetails = (): boolean => {
    const errors: {[key: string]: string} = {};
    
    if (!cardDetails.number || cardDetails.number.replace(/\s/g, '').length < 16) {
      errors.number = 'Please enter a valid card number';
    }
    
    if (!cardDetails.expiry || cardDetails.expiry.length < 5) {
      errors.expiry = 'Please enter a valid expiry date (MM/YY)';
    }
    
    if (!cardDetails.cvc || cardDetails.cvc.length < 3) {
      errors.cvc = 'Please enter a valid CVC';
    }
    
    if (!cardDetails.name) {
      errors.name = 'Please enter the cardholder name';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCardPayment = async () => {
    if (!validateCardDetails()) {
      return;
    }
    
    setIsProcessingPayment(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Store success data in session storage for the success page
    sessionStorage.setItem('paymentSuccess', JSON.stringify({
      orderId: Math.floor(Math.random() * 10000000).toString(),
      amount: challengeData?.price,
      challengeType: challengeData?.type,
      paymentMethod: 'card'
    }));
    
    router.push('/dashboard/challenge/success');
  };

  const handleCryptoPayment = async () => {
    setIsProcessingPayment(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Store success data in session storage for the success page
    sessionStorage.setItem('paymentSuccess', JSON.stringify({
      orderId: Math.floor(Math.random() * 10000000).toString(),
      amount: getCryptoPrice(),
      challengeType: challengeData?.type,
      paymentMethod: 'crypto'
    }));
    
    router.push('/dashboard/challenge/success');
  };

  if (!challengeData) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-[#0FF1CE] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading payment details...</p>
        </div>
      </div>
    );
  }

  // Add payment processing overlay
  const PaymentProcessingOverlay = () => (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#0D0D0D] p-8 rounded-2xl max-w-md w-full mx-4 text-center border border-[#2F2F2F]/50">
        <div className="w-16 h-16 border-2 border-[#0FF1CE] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <h3 className="text-xl font-semibold mb-2 text-white">Processing Payment</h3>
        <p className="text-gray-400">Please do not close this window. Your payment is being processed...</p>
      </div>
    </div>
  );

  return (
    <div className="relative">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full bg-[#0FF1CE]/[0.02] background-noise"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full md:w-3/4 h-full rounded-full bg-[#0FF1CE]/[0.03] blur-[150px] opacity-60"></div>
      <Particles />

      <div className="relative z-10">
        {isProcessingPayment && <PaymentProcessingOverlay />}
        
        <h1 className="text-2xl font-bold text-white mb-6">Payment</h1>
        
        {/* Order Overview */}
        <div className="max-w-3xl mx-auto bg-[#0D0D0D]/80 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-[#2F2F2F]/50">
          <h2 className="text-xl font-medium mb-6 text-white">Order Overview</h2>
          <div className="space-y-4">
            <div className="flex justify-between py-2 border-b border-[#2F2F2F]/50">
              <span className="text-gray-400">Order number</span>
              <span className="text-white">{Math.floor(Math.random() * 10000000)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-[#2F2F2F]/50">
              <span className="text-gray-400">Account Size</span>
              <span className="text-white">{challengeData.amount}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-[#2F2F2F]/50">
              <span className="text-gray-400">Account Type</span>
              <span className="text-white">{challengeData.type}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-[#2F2F2F]/50">
              <span className="text-gray-400">Platform</span>
              <span className="text-white">{challengeData.platform}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-[#2F2F2F]/50">
              <span className="text-gray-400">Trading Account Currency</span>
              <span className="text-white">USD</span>
            </div>
            <div className="flex justify-between py-2 text-xl font-semibold">
              <span className="text-white">To be paid</span>
              <span className="text-[#0FF1CE]">${challengeData.price}</span>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="max-w-3xl mx-auto mb-8">
          <h2 className="text-xl font-medium mb-4 text-white">Select Payment Method</h2>
          
          {/* Card Payment Button */}
          <div className="space-y-4">
            <div>
              <button
                onClick={() => handlePaymentSelect('card')}
                className={`w-full p-4 rounded-lg transition-colors ${
                  isCardExpanded
                    ? 'border-[#0FF1CE] bg-[#0D0D0D]/80 backdrop-blur-sm rounded-b-none border border-b-0'
                    : 'border border-[#2F2F2F]/50 bg-[#0D0D0D]/80 backdrop-blur-sm hover:border-[#0FF1CE]/30'
                } flex items-center justify-between`}
              >
                <div className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-[#0FF1CE]" />
                  <span className="text-white">Pay with Credit/Debit Card</span>
                </div>
                <div className="flex items-center gap-4">
                  {isCardExpanded ? (
                    <ChevronUp className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  )}
                </div>
              </button>

              {isCardExpanded && (
                <div className="border border-[#0FF1CE] rounded-b-lg bg-[#0D0D0D]/80 backdrop-blur-sm p-6">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Card Number</label>
                      <input
                        type="text"
                        name="number"
                        value={cardDetails.number}
                        onChange={handleCardInputChange}
                        placeholder="4242 4242 4242 4242"
                        maxLength={19}
                        className={`w-full bg-[#151515] border ${formErrors.number ? 'border-red-500' : 'border-[#2F2F2F]'} rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#0FF1CE]/50`}
                      />
                      {formErrors.number && <p className="mt-1 text-sm text-red-500">{formErrors.number}</p>}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Expiry Date</label>
                        <input
                          type="text"
                          name="expiry"
                          value={cardDetails.expiry}
                          onChange={handleCardInputChange}
                          placeholder="MM/YY"
                          maxLength={5}
                          className={`w-full bg-[#151515] border ${formErrors.expiry ? 'border-red-500' : 'border-[#2F2F2F]'} rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#0FF1CE]/50`}
                        />
                        {formErrors.expiry && <p className="mt-1 text-sm text-red-500">{formErrors.expiry}</p>}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">CVC</label>
                        <input
                          type="text"
                          name="cvc"
                          value={cardDetails.cvc}
                          onChange={handleCardInputChange}
                          placeholder="123"
                          maxLength={4}
                          className={`w-full bg-[#151515] border ${formErrors.cvc ? 'border-red-500' : 'border-[#2F2F2F]'} rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#0FF1CE]/50`}
                        />
                        {formErrors.cvc && <p className="mt-1 text-sm text-red-500">{formErrors.cvc}</p>}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Cardholder Name</label>
                      <input
                        type="text"
                        name="name"
                        value={cardDetails.name}
                        onChange={handleCardInputChange}
                        placeholder="John Doe"
                        className={`w-full bg-[#151515] border ${formErrors.name ? 'border-red-500' : 'border-[#2F2F2F]'} rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#0FF1CE]/50`}
                      />
                      {formErrors.name && <p className="mt-1 text-sm text-red-500">{formErrors.name}</p>}
                    </div>
                    
                    <button
                      onClick={handleCardPayment}
                      className="w-full bg-[#0FF1CE] text-black font-bold py-3 rounded-lg hover:bg-[#0FF1CE]/90 transition-colors mt-4"
                    >
                      Pay ${challengeData.price}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Crypto Payment Button */}
            <div>
              <button
                onClick={() => handlePaymentSelect('crypto')}
                className={`w-full p-4 rounded-lg transition-colors ${
                  isCryptoExpanded
                    ? 'border-[#0FF1CE] bg-[#0D0D0D]/80 backdrop-blur-sm rounded-b-none border border-b-0'
                    : 'border border-[#2F2F2F]/50 bg-[#0D0D0D]/80 backdrop-blur-sm hover:border-[#0FF1CE]/30'
                } flex items-center justify-between`}
              >
                <div className="flex items-center gap-3">
                  <Bitcoin className="h-5 w-5 text-[#0FF1CE]" />
                  <div>
                    <span className="text-white">Pay with Cryptocurrency</span>
                    <span className="ml-2 text-xs bg-[#0FF1CE]/20 text-[#0FF1CE] py-0.5 px-2 rounded">10% OFF</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {isCryptoExpanded ? (
                    <ChevronUp className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  )}
                </div>
              </button>

              {isCryptoExpanded && (
                <div className="border border-[#0FF1CE] rounded-b-lg bg-[#0D0D0D]/80 backdrop-blur-sm p-6">
                  <div className="text-center space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-white">Pay with Cryptocurrency</h3>
                      <p className="text-gray-400 mt-1">10% discount applied</p>
                    </div>
                    
                    <div className="bg-[#151515] p-4 rounded-lg inline-block">
                      <p className="text-gray-400 mb-2">BTC Payment Address</p>
                      <div className="flex items-center justify-center gap-2">
                        <p className="text-white font-mono bg-[#0D0D0D] p-2 rounded-lg">bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between py-2">
                        <span className="text-gray-400">Amount to Pay (USD)</span>
                        <span className="text-white">${getCryptoPrice()}</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-gray-400">Discount Applied</span>
                        <span className="text-[#0FF1CE]">10%</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-gray-400 text-sm">
                        Please send the exact amount to the address above. Your account will be created once the payment is confirmed.
                      </p>
                      <p className="text-gray-400 text-sm">
                        Supported cryptocurrencies: BTC, ETH, USDT, USDC
                      </p>
                    </div>
                    
                    <div className="pt-4">
                      <button
                        onClick={handleCryptoPayment}
                        className="w-full bg-[#0FF1CE] text-black font-bold py-3 rounded-lg hover:bg-[#0FF1CE]/90 transition-colors"
                      >
                        I've Sent the Payment
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Security and Support */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-[#0D0D0D]/80 backdrop-blur-sm rounded-2xl p-6 border border-[#2F2F2F]/50">
            <h3 className="text-lg font-medium mb-4 text-white">Payment Security & Support</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-[#0FF1CE]/10 flex items-center justify-center mb-3">
                  <Check className="h-6 w-6 text-[#0FF1CE]" />
                </div>
                <h4 className="text-white font-medium mb-1">Secure Payments</h4>
                <p className="text-gray-400 text-sm">All payments are encrypted and processed securely</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-[#0FF1CE]/10 flex items-center justify-center mb-3">
                  <Check className="h-6 w-6 text-[#0FF1CE]" />
                </div>
                <h4 className="text-white font-medium mb-1">24/7 Support</h4>
                <p className="text-gray-400 text-sm">Our team is available around the clock to assist you</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-[#0FF1CE]/10 flex items-center justify-center mb-3">
                  <Check className="h-6 w-6 text-[#0FF1CE]" />
                </div>
                <h4 className="text-white font-medium mb-1">Money-Back Guarantee</h4>
                <p className="text-gray-400 text-sm">Get a full refund after completing your challenge</p>
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