'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
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
  platform: string;
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
    price: 199,
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
    price: 299,
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
    price: 599,
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
    price: 999,
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
    price: 1999,
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

export default function NYEActivationPage() {
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState<ActivationOption | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    country: '',
    platform: '',
    discordUsername: ''
  });
  const [formErrors, setFormErrors] = useState<Partial<FormData>>({});
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [cryptoPrices, setCryptoPrices] = useState<CryptoPrice>({ BTC: 0, ETH: 0, USDT: 1, USDC: 1 });
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

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

  const validateForm = (): boolean => {
    const errors: Partial<FormData> = {};

    if (!formData.firstName.trim()) errors.firstName = 'First name is required';
    if (!formData.lastName.trim()) errors.lastName = 'Last name is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Invalid email format';
    if (!formData.phone.trim()) errors.phone = 'Phone number is required';
    if (!formData.country.trim()) errors.country = 'Country is required';
    if (!formData.platform) errors.platform = 'Platform selection is required';

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
      type: 'nye-activation',
      amount: selectedOption.level,
      platform: formData.platform,
      formData,
      price: selectedOption.price,
      addOns: []
    };
  };

  if (showPayment && selectedOption) {
    return (
      <div className="bg-black text-white min-h-screen font-sans">
        <Header />
        <Particles />
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="bg-[#0d1117] backdrop-blur-sm rounded-2xl border border-[#0FF1CE]/20 overflow-hidden">
            {isProcessingPayment && (
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 rounded-2xl">
                <div className="text-center">
                  <div className="w-12 h-12 border-2 border-[#0FF1CE] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-white">Processing payment...</p>
                </div>
              </div>
            )}
            
            <div className="p-6 md:p-8 border-b border-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-[#0FF1CE]">NYE Funded Account Activation</h2>
                  <p className="text-gray-400 mt-1">NYE Special - {selectedOption.level} ({formData.platform})</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-[#0FF1CE]">${selectedOption.price.toLocaleString()}</div>
                  <div className="text-gray-400 text-sm">Activation Fee</div>
                </div>
              </div>
            </div>

            <CryptoPayment
              challengeData={getChallengeData()}
              successRedirectPath="/nye/pending"
              onProcessingStateChange={setIsProcessingPayment}
              cryptoPrices={cryptoPrices}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black text-white min-h-screen font-sans relative overflow-hidden">
      <Header />
      
      {/* Hero Section with NYE Image */}
      <section className="relative z-10 px-6 pt-24 md:pt-28 pb-12 md:pb-10 text-center overflow-hidden bg-black">
        <div className="max-w-5xl mx-auto">
          
          {/* Main Hero Image */}
          <div className="relative mb-6 md:mb-4">
            <div className="relative w-full max-w-3xl mx-auto aspect-[16/9]">
              <Image
                src="/nyepromo.png"
                alt="New Year's Eve Funded Account Special"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-3 md:mb-2">
            New Year Funded Account Activation
          </h1>
          
          {/* Badge */}
          <div className="inline-block bg-gradient-to-r from-[#0FF1CE] to-[#00D9FF] text-black font-bold px-5 py-2 rounded-full text-sm md:text-base mb-6 md:mb-5">
            Special NYE Pricing - Limited Time
          </div>

          <p className="text-gray-400 max-w-3xl mx-auto text-sm md:text-base mb-8">
            Ring in 2026 with instant funded accounts! Special New Year's pricing on all account sizes. Get trading immediately with zero restrictions.
          </p>

          {/* Floating Stats Cards */}
          <div className="grid grid-cols-3 gap-2 md:flex md:flex-row md:justify-center md:items-center md:gap-8 px-2 md:px-0 mb-8">
            {[
              { value: "15%", label: "Max Drawdown", delay: "0s" },
              { value: "8%", label: "Daily Drawdown", delay: "0.1s" },
              { value: "1:200", label: "Leverage", delay: "0.2s" }
            ].map(({ value, label, delay }) => (
              <div
                key={label}
                className="group relative w-full bg-gradient-to-br from-[#0FF1CE]/10 to-[#0FF1CE]/5 backdrop-blur-sm rounded-xl p-3 md:p-4 md:w-44 hover:scale-105 transition-all duration-300 animate-float"
                style={{
                  animation: `float 3s ease-in-out infinite`,
                  animationDelay: delay,
                  boxShadow: '0 0 20px rgba(15, 241, 206, 0.1)'
                }}
              >
                <div className="text-xl md:text-3xl font-bold text-[#0FF1CE] mb-1">{value}</div>
                <div className="text-xs md:text-sm text-gray-400">{label}</div>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#0FF1CE]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            ))}
          </div>

          {/* NO BS Rules Card */}
          <div className="max-w-2xl mx-auto">
            <div className="bg-gradient-to-br from-[#0FF1CE]/10 to-[#0FF1CE]/5 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-[#0FF1CE]/20"
              style={{ boxShadow: '0 0 20px rgba(15, 241, 206, 0.1)' }}>
              <h3 className="text-xl md:text-2xl font-bold text-[#0FF1CE] mb-6 text-center">NO BS Funded Account RULES</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  "No consistency rules",
                  "News trading allowed",
                  "Hold over weekends",
                  "EAs & Bots allowed",
                  "No Profit Caps",
                  "No Position size caps"
                ].map((rule, index) => (
                  <div key={index} className="flex items-center space-x-3 group">
                    <div className="w-6 h-6 rounded-full bg-[#0FF1CE]/10 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                      <span className="text-[#0FF1CE] text-sm">✓</span>
                    </div>
                    <span className="text-gray-300 text-sm md:text-base group-hover:text-white transition-colors">{rule}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Activation Options Section */}
      <section className="relative z-10 py-16 px-6 overflow-hidden bg-black">
        {/* Glowing Cyan Orbs */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-[#0FF1CE]/20 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-40 right-10 w-80 h-80 bg-[#0FF1CE]/15 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-[#00D9FF]/10 rounded-full blur-[80px] pointer-events-none"></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-[#0FF1CE]/12 rounded-full blur-[90px] pointer-events-none"></div>

        <div className="relative z-10">
          <h2 className="text-center font-bold text-3xl md:text-4xl text-white mb-3">
            Choose Your Funded Account
          </h2>
          <p className="text-center text-gray-400 mb-10 text-sm md:text-base">
            Select your account size and get instant access to funded trading with zero restrictions.
          </p>
          
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {ACTIVATION_OPTIONS.map((option, index) => (
              <div
                key={option.level}
                className={`group relative bg-[#0d1117] rounded-2xl p-6 border transition-all duration-300 cursor-pointer hover:scale-105 ${
                  selectedOption?.level === option.level ? 'border-[#0FF1CE] ring-2 ring-[#0FF1CE]/50' : 'border-gray-800 hover:border-[#0FF1CE]/30'
                }`}
                onClick={() => handleSelectOption(option)}
              >
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#0FF1CE] mb-2">{option.level}</div>
                  <div className="text-3xl font-bold text-white">${option.price.toLocaleString()}</div>
                  <div className="text-sm text-gray-400 mt-1">NYE Special</div>
                </div>

                {selectedOption?.level === option.level && (
                  <div className="absolute top-2 right-2">
                    <div className="w-6 h-6 bg-[#0FF1CE] rounded-full flex items-center justify-center">
                      <Check size={14} className="text-black" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form Section */}
      {selectedOption && (
        <section className="relative z-10 py-16 px-6 bg-black">
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-[#0FF1CE] mb-10">Complete Your Information</h2>
            
            <div className="max-w-2xl mx-auto">
              <div className="bg-[#0d1117] rounded-2xl p-8 border border-[#0FF1CE]/20">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-white mb-2">First Name *</label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 bg-black border rounded-lg focus:outline-none focus:border-[#0FF1CE] text-white placeholder-gray-400 ${
                          formErrors.firstName ? 'border-red-500' : 'border-gray-800'
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
                        className={`w-full px-4 py-3 bg-black border rounded-lg focus:outline-none focus:border-[#0FF1CE] text-white placeholder-gray-400 ${
                          formErrors.lastName ? 'border-red-500' : 'border-gray-800'
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
                      className={`w-full px-4 py-3 bg-black border rounded-lg focus:outline-none focus:border-[#0FF1CE] text-white placeholder-gray-400 ${
                        formErrors.email ? 'border-red-500' : 'border-gray-800'
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
                        className={`w-full px-4 py-3 bg-black border rounded-lg focus:outline-none focus:border-[#0FF1CE] text-white placeholder-gray-400 ${
                          formErrors.phone ? 'border-red-500' : 'border-gray-800'
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
                        className={`w-full px-4 py-3 bg-black border rounded-lg focus:outline-none focus:border-[#0FF1CE] text-white ${
                          formErrors.country ? 'border-red-500' : 'border-gray-800'
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

                  {/* Platform Selection */}
                  <div>
                    <label className="block text-white mb-2">Trading Platform *</label>
                    <select
                      name="platform"
                      value={formData.platform}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 bg-black border rounded-lg focus:outline-none focus:border-[#0FF1CE] text-white ${
                        formErrors.platform ? 'border-red-500' : 'border-gray-800'
                      }`}
                    >
                      <option value="">Select your platform</option>
                      <option value="MT4">MetaTrader 4 (MT4)</option>
                      <option value="MT5">MetaTrader 5 (MT5)</option>
                    </select>
                    {formErrors.platform && <p className="text-red-500 text-sm mt-1">{formErrors.platform}</p>}
                  </div>

                  <div>
                    <label className="block text-white mb-2">Discord Username (Optional)</label>
                    <input
                      type="text"
                      name="discordUsername"
                      value={formData.discordUsername}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-black border border-gray-800 rounded-lg focus:outline-none focus:border-[#0FF1CE] text-white placeholder-gray-400"
                      placeholder="Your Discord username"
                    />
                  </div>

                  <div className="pt-6 border-t border-gray-800">
                    <div className="flex justify-between items-center mb-6">
                      <div>
                        <div className="text-lg font-semibold text-white">NYE Funded Account</div>
                        <div className="text-[#0FF1CE]">{selectedOption.level} on {formData.platform || 'Platform'}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-[#0FF1CE]">${selectedOption.price.toLocaleString()}</div>
                        <div className="text-gray-400 text-sm">Activation Fee</div>
                      </div>
                    </div>

                    <button
                      onClick={handleProceedToPayment}
                      className="w-full bg-[#0FF1CE] text-black text-base md:text-lg font-bold rounded-lg hover:bg-[#0AA89E] transition-all duration-300 py-4"
                    >
                      Activate NYE Account
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

