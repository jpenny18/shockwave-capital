'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import Particles from '../components/Particles';
import Header from '../components/Header';
import { Check, ChevronDown, ChevronUp, Bitcoin, Copy } from 'lucide-react';
import CryptoPayment from '../components/CryptoPayment';

interface CryptoPrice {
  BTC: number;
  ETH: number;
  USDT: number;
  USDC: number;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  discordUsername?: string;
}

interface ActivationOption {
  level: string;
  price: number;
  features: string[];
}

const ACTIVATION_OPTIONS: ActivationOption[] = [
  {
    level: '$10k',
    price: 99,
    features: [
      '$10,000 Simulated Capital',
      '15% Max Drawdown',
      '8% Daily Drawdown',
      '1:200 Leverage',
      'No Trading Restrictions',
      'Weekend Holding Allowed'
    ]
  },
  {
    level: '$25k',
    price: 199,
    features: [
      '$25,000 Simulated Capital',
      '15% Max Drawdown',
      '8% Daily Drawdown',
      '1:200 Leverage',
      'No Trading Restrictions',
      'Weekend Holding Allowed'
    ]
  },
  {
    level: '$50k',
    price: 399,
    features: [
      '$50,000 Simulated Capital',
      '15% Max Drawdown',
      '8% Daily Drawdown',
      '1:200 Leverage',
      'No Trading Restrictions',
      'Weekend Holding Allowed'
    ]
  },
  {
    level: '$100k',
    price: 499,
    features: [
      '$100,000 Simulated Capital',
      '15% Max Drawdown',
      '8% Daily Drawdown',
      '1:200 Leverage',
      'No Trading Restrictions',
      'Weekend Holding Allowed'
    ]
  },
  {
    level: '$200k',
    price: 999,
    features: [
      '$200,000 Simulated Capital',
      '15% Max Drawdown',
      '8% Daily Drawdown',
      '1:200 Leverage',
      'No Trading Restrictions',
      'Weekend Holding Allowed'
    ]
  }
];

export default function GauntletActivationPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState<ActivationOption | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    country: '',
    discordUsername: ''
  });
  const [formErrors, setFormErrors] = useState<Partial<FormData>>({});
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [cryptoPrices, setCryptoPrices] = useState<CryptoPrice>({ BTC: 0, ETH: 0, USDT: 1, USDC: 1 });
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user && !loading) {
        router.push('/access');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router, loading]);

  // Fetch crypto prices
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

    fetchPrices();
    const interval = setInterval(fetchPrices, 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0D0D0D]">
        <div className="w-8 h-8 border-4 border-[#0FF1CE] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const validateForm = (): boolean => {
    const errors: Partial<FormData> = {};

    if (!formData.firstName.trim()) errors.firstName = 'First name is required';
    if (!formData.lastName.trim()) errors.lastName = 'Last name is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Invalid email format';
    if (!formData.phone.trim()) errors.phone = 'Phone number is required';
    if (!formData.country.trim()) errors.country = 'Country is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name as keyof FormData]) {
      setFormErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSelectOption = (option: ActivationOption) => {
    setSelectedOption(option);
    setShowPayment(false);
  };

  const handleProceedToPayment = () => {
    if (!selectedOption) return;
    
    if (validateForm()) {
      setShowPayment(true);
    }
  };

  const getChallengeData = () => {
    if (!selectedOption) return null;
    
    return {
      type: 'gauntlet-activation',
      amount: selectedOption.level,
      platform: 'MT4/MT5',
      formData,
      price: selectedOption.price,
      addOns: []
    };
  };

  if (showPayment && selectedOption) {
    return (
      <div className="bg-gradient-to-b from-[#0D0D0D] via-[#121212] to-[#151515] text-white min-h-screen font-sans">
        <Header />
        <Particles />
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="bg-[#0D0D0D]/80 backdrop-blur-sm rounded-2xl border border-[#2F2F2F]/50 overflow-hidden">
            {isProcessingPayment && (
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 rounded-2xl">
                <div className="text-center">
                  <div className="w-12 h-12 border-2 border-[#FF6B6B] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-white">Processing payment...</p>
                </div>
              </div>
            )}
            
            <div className="p-6 md:p-8 border-b border-[#2F2F2F]/50">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-[#FF6B6B]">🔥 Activate Your Gauntlet Account</h2>
                  <p className="text-gray-400 mt-1">Gauntlet Activation - {selectedOption.level}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-[#FF6B6B]">${selectedOption.price.toLocaleString()}</div>
                  <div className="text-gray-400 text-sm">Activation Fee</div>
                </div>
              </div>
            </div>

            <CryptoPayment
              challengeData={getChallengeData()}
              successRedirectPath="/gauntlet-activation/pending"
              onProcessingStateChange={setIsProcessingPayment}
              cryptoPrices={cryptoPrices}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-[#0D0D0D] via-[#121212] to-[#151515] text-white min-h-screen font-sans">
      <Header />
      
      {/* Hero Section */}
      <section className="relative px-4 md:px-6 pt-24 md:pt-40 pb-16 md:pb-32 text-center overflow-hidden bg-gradient-to-b from-[#121212] to-[#131313]">
        <div className="absolute top-0 left-0 w-full h-full bg-[#FF6B6B]/[0.02] background-noise"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full md:w-3/4 h-full rounded-full bg-[#FF6B6B]/[0.03] blur-[150px] opacity-60"></div>
        <Particles />
        
        <div className="relative z-10 max-w-5xl mx-auto">
          <div className="inline-block bg-gradient-to-r from-[#FF6B6B] to-[#EE5A24] text-white px-4 py-2 rounded-full text-sm font-bold mb-4 animate-pulse">
            🔥 GAUNTLET ACTIVATION
          </div>
          
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-[#FF6B6B] mb-4 md:mb-6">
            Activate Your Funded Account
          </h1>
          <p className="text-base md:text-lg lg:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Congratulations on passing the Gauntlet Challenge! Now pay your activation fee to unlock your funded account with zero restrictions.
          </p>
          <p className="text-sm md:text-base lg:text-lg text-gray-400 max-w-3xl mx-auto mt-2">
            Choose your account size and start trading with no limits.
          </p>
        </div>
      </section>

      {/* Activation Options Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-[#131313] to-[#111111] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-[#131313] to-transparent"></div>
        <div className="relative z-10">
          <h2 className="text-4xl font-bold text-center text-[#FF6B6B] mb-16">Choose Your Activation Level</h2>
          
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {ACTIVATION_OPTIONS.map((option, index) => (
              <div
                key={option.level}
                className={`group relative bg-gradient-to-br from-[#FF6B6B]/10 to-[#EE5A24]/5 backdrop-blur-sm rounded-2xl p-6 hover:scale-105 transition-all duration-300 cursor-pointer ${
                  selectedOption?.level === option.level ? 'ring-2 ring-[#FF6B6B]' : ''
                }`}
                style={{
                  boxShadow: '0 0 20px rgba(255, 107, 107, 0.1)'
                }}
                onClick={() => handleSelectOption(option)}
              >
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#FF6B6B] mb-2">{option.level}</div>
                  <div className="text-3xl font-bold text-white">${option.price.toLocaleString()}</div>
                  <div className="text-sm text-gray-400 mt-1">Activation Fee</div>
                </div>

                {selectedOption?.level === option.level && (
                  <div className="absolute top-2 right-2">
                    <div className="w-6 h-6 bg-[#FF6B6B] rounded-full flex items-center justify-center">
                      <Check size={14} className="text-white" />
                    </div>
                  </div>
                )}

                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#FF6B6B]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form Section */}
      {selectedOption && (
        <section className="py-20 px-6 bg-gradient-to-b from-[#111111] to-[#131313] relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-4xl font-bold text-center text-[#FF6B6B] mb-16">Complete Your Information</h2>
            
            <div className="max-w-2xl mx-auto">
              <div className="bg-gradient-to-br from-[#FF6B6B]/10 to-[#EE5A24]/5 backdrop-blur-sm rounded-2xl p-8 border border-[#2F2F2F]/50">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-white mb-2">First Name *</label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 bg-[#181818] border rounded-lg focus:outline-none focus:border-[#FF6B6B] text-white placeholder-gray-400 ${
                          formErrors.firstName ? 'border-red-500' : 'border-[#FF6B6B]/20'
                        }`}
                        placeholder="Enter your first name"
                      />
                      {formErrors.firstName && <p className="text-red-500 text-sm mt-1">{formErrors.firstName}</p>}
                    </div>

                    <div>
                      <label className="block text-white mb-2">Last Name *</label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 bg-[#181818] border rounded-lg focus:outline-none focus:border-[#FF6B6B] text-white placeholder-gray-400 ${
                          formErrors.lastName ? 'border-red-500' : 'border-[#FF6B6B]/20'
                        }`}
                        placeholder="Enter your last name"
                      />
                      {formErrors.lastName && <p className="text-red-500 text-sm mt-1">{formErrors.lastName}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-white mb-2">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 bg-[#181818] border rounded-lg focus:outline-none focus:border-[#FF6B6B] text-white placeholder-gray-400 ${
                        formErrors.email ? 'border-red-500' : 'border-[#FF6B6B]/20'
                      }`}
                      placeholder="Enter your email address"
                    />
                    {formErrors.email && <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-white mb-2">Phone Number *</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 bg-[#181818] border rounded-lg focus:outline-none focus:border-[#FF6B6B] text-white placeholder-gray-400 ${
                          formErrors.phone ? 'border-red-500' : 'border-[#FF6B6B]/20'
                        }`}
                        placeholder="Enter your phone number"
                      />
                      {formErrors.phone && <p className="text-red-500 text-sm mt-1">{formErrors.phone}</p>}
                    </div>

                    <div>
                      <label className="block text-white mb-2">Country *</label>
                      <select
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 bg-[#181818] border rounded-lg focus:outline-none focus:border-[#FF6B6B] text-white ${
                          formErrors.country ? 'border-red-500' : 'border-[#FF6B6B]/20'
                        }`}
                      >
                        <option value="">Select your country</option>
                        <option value="United States">United States</option>
                        <option value="Canada">Canada</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="Australia">Australia</option>
                        <option value="Germany">Germany</option>
                        <option value="France">France</option>
                        <option value="Other">Other</option>
                      </select>
                      {formErrors.country && <p className="text-red-500 text-sm mt-1">{formErrors.country}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-white mb-2">Discord Username (Optional)</label>
                    <input
                      type="text"
                      name="discordUsername"
                      value={formData.discordUsername}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-[#181818] border border-[#FF6B6B]/20 rounded-lg focus:outline-none focus:border-[#FF6B6B] text-white placeholder-gray-400"
                      placeholder="Your Discord username"
                    />
                  </div>

                  <div className="pt-6 border-t border-[#2F2F2F]/50">
                    <div className="flex justify-between items-center mb-6">
                      <div>
                        <div className="text-lg font-semibold text-white">Gauntlet Activation</div>
                        <div className="text-[#FF6B6B]">{selectedOption.level} Funded Account</div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-[#FF6B6B]">${selectedOption.price.toLocaleString()}</div>
                        <div className="text-gray-400 text-sm">Activation Fee</div>
                      </div>
                    </div>

                    <button
                      onClick={handleProceedToPayment}
                      className="w-full bg-gradient-to-r from-[#FF6B6B] to-[#EE5A24] hover:opacity-90 text-white font-bold py-4 rounded-xl transition-all"
                    >
                      🔥 Activate Gauntlet Account
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <style jsx global>{`
        .background-noise {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 250 250' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E");
          opacity: 0.15;
        }
      `}</style>
    </div>
  );
}
