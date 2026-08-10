'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Particles from '../components/Particles';
import Header from '../components/Header';
import { Check, ChevronDown, Bitcoin, CreditCard, Crown, Headphones, TrendingUp, Copy } from 'lucide-react';
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

interface VipOption {
  level: string;
  name: string;
  price: number;
  maxDrawdown: string;
  dailyDrawdown: string;
  features: string[];
}

const VIP_OPTIONS: VipOption[] = [
  {
    level: '$1M',
    name: 'Professional',
    price: 5499,
    maxDrawdown: '$150,000',
    dailyDrawdown: '$80,000',
    features: [
      '$1,000,000 Simulated Capital',
      '15% Max Drawdown ($150,000)',
      '8% Daily Drawdown ($80,000)',
      'Up to 1:100 Leverage',
      '80% Starting Profit Split',
      'Dedicated Account Manager'
    ]
  },
  {
    level: '$2M',
    name: 'Executive',
    price: 9999,
    maxDrawdown: '$300,000',
    dailyDrawdown: '$160,000',
    features: [
      '$2,000,000 Simulated Capital',
      '15% Max Drawdown ($300,000)',
      '8% Daily Drawdown ($160,000)',
      'Up to 1:100 Leverage',
      '80% Starting Profit Split',
      'Dedicated Account Manager'
    ]
  },
  {
    level: '$3M',
    name: 'Institutional',
    price: 14999,
    maxDrawdown: '$450,000',
    dailyDrawdown: '$240,000',
    features: [
      '$3,000,000 Simulated Capital',
      '15% Max Drawdown ($450,000)',
      '8% Daily Drawdown ($240,000)',
      'Up to 1:100 Leverage',
      '80% Starting Profit Split',
      'Dedicated Account Manager'
    ]
  }
];

const VIP_RULES = [
  '15% Max Drawdown',
  '8% Daily Drawdown',
  'Up to 1:100 Leverage',
  'No Consistency Rule',
  'No Extra Strategy Restrictions',
  'News Trading Allowed',
  'Overnight & Weekend Holding',
  'EAs & VPS Allowed',
  'Corporate Registration Available',
  'Consolidated Account Structure'
];

function VipContent() {
  const [selectedOption, setSelectedOption] = useState<VipOption | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'crypto' | null>(null);
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    country: '',
    platform: 'MT5',
    discordUsername: ''
  });
  const [formErrors, setFormErrors] = useState<Partial<FormData>>({});
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
    if (!formData.platform.trim()) errors.platform = 'Platform selection is required';

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

  const handleSelectOption = (option: VipOption) => {
    setSelectedOption(option);
    setShowPayment(false);
    // On mobile, auto-scroll to the information section once it has rendered
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setTimeout(() => {
        document.getElementById('information-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    }
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
      type: 'vip-activation',
      amount: selectedOption.level,
      platform: formData.platform,
      formData,
      price: selectedOption.price,
      addOns: []
    };
  };

  if (showPayment && selectedOption) {
    // If crypto payment method is selected, show crypto payment
    if (paymentMethod === 'crypto') {
      return (
        <div className="bg-black text-white min-h-screen font-sans">
          <Header />
          <Particles />
          
          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
            <div className="bg-[#0D0D0D]/80 backdrop-blur-sm rounded-2xl border border-[#2F2F2F]/50 overflow-hidden">
              {isProcessingPayment && (
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 rounded-2xl">
                  <div className="text-center">
                    <div className="w-12 h-12 border-2 border-[#0FF1CE] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-white">Processing payment...</p>
                  </div>
                </div>
              )}
              
              <div className="p-6 md:p-8 border-b border-[#0FF1CE]/20">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-[#0FF1CE]">Activate Your VIP Allocation</h2>
                    <p className="text-gray-400 mt-1">VIP {selectedOption.name} Account - {selectedOption.level}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-[#0FF1CE]">${selectedOption.price.toLocaleString()}</div>
                    <div className="text-gray-400 text-sm">One-Time Fee</div>
                  </div>
                </div>
              </div>

              <CryptoPayment
                challengeData={getChallengeData()}
                successRedirectPath="/vip/pending"
                onProcessingStateChange={setIsProcessingPayment}
                cryptoPrices={cryptoPrices}
              />
            </div>
          </div>
        </div>
      );
    }

    // Payment method selection
    return (
      <div className="bg-black text-white min-h-screen font-sans">
        <Header />
        <Particles />
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="bg-[#0D0D0D]/80 backdrop-blur-sm rounded-2xl border border-[#2F2F2F]/50 p-8">
            {isProcessingPayment && (
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 rounded-2xl">
                <div className="text-center">
                  <div className="w-12 h-12 border-2 border-[#0FF1CE] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-white">Processing payment...</p>
                </div>
              </div>
            )}
            
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-[#0FF1CE] mb-2">Select Payment Method</h2>
              <p className="text-gray-400">VIP {selectedOption.name} Account - {selectedOption.level}</p>
            </div>

            <div className="space-y-4 mb-8">
              {/* Crypto Payment Option */}
              <button
                onClick={() => setPaymentMethod('crypto')}
                className="w-full bg-gradient-to-r from-[#0FF1CE]/10 to-[#00D9FF]/10 hover:from-[#0FF1CE]/20 hover:to-[#00D9FF]/20 border-2 border-[#0FF1CE]/30 hover:border-[#0FF1CE] rounded-xl p-6 transition-all duration-300 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#0FF1CE]/20 rounded-lg flex items-center justify-center group-hover:bg-[#0FF1CE]/30 transition-colors">
                      <Bitcoin size={24} className="text-[#0FF1CE]" />
                    </div>
                    <div className="text-left">
                      <div className="text-lg font-bold text-white">Cryptocurrency</div>
                      <div className="text-sm text-gray-400">Pay with BTC, ETH, USDT, or USDC</div>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-[#0FF1CE]">${selectedOption.price.toLocaleString()}</div>
                </div>
              </button>
            </div>

            {/* Order Summary */}
            <div className="bg-[#151515]/50 rounded-xl p-6 border border-[#2F2F2F]/30">
              <h3 className="text-lg font-semibold text-white mb-4">Order Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Customer:</span>
                  <span className="text-white">{formData.firstName} {formData.lastName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Email:</span>
                  <span className="text-white">{formData.email}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Allocation:</span>
                  <span className="text-white">{selectedOption.level} ({selectedOption.name})</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Platform:</span>
                  <span className="text-white">{formData.platform}</span>
                </div>
                <div className="border-t border-[#2F2F2F]/50 pt-3 flex justify-between">
                  <span className="text-white font-semibold">Total:</span>
                  <span className="text-[#0FF1CE] font-bold text-xl">${selectedOption.price.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black text-white min-h-screen font-sans">
      <Header />
      
      {/* Hero Section */}
      <section className="relative px-4 md:px-6 pt-24 md:pt-40 pb-10 md:pb-32 text-center overflow-hidden bg-black">
        <div className="absolute top-0 left-0 w-full h-full bg-[#0FF1CE]/[0.02] background-noise"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full md:w-3/4 h-full rounded-full bg-[#0FF1CE]/[0.03] blur-[150px] opacity-60"></div>
        <Particles />
        
        <div className="relative z-10 max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#0FF1CE] to-[#00D9FF] text-black px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-bold mb-3 md:mb-4">
            <Crown size={14} />
            VIP FUNDED ALLOCATIONS
          </div>
          
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-[#0FF1CE] to-[#00D9FF] text-transparent bg-clip-text mb-3 md:mb-6">
            Trade Bigger. Keep It Simple.
          </h1>
          <p className="text-sm md:text-lg lg:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-2 md:mb-4">
            Serious capital for experienced traders who have outgrown traditional prop firm account sizes.
          </p>
          <p className="text-sm md:text-base text-gray-400 max-w-3xl mx-auto leading-relaxed mb-6 md:mb-8">
            Up to <span className="text-[#0FF1CE] font-semibold">$3,000,000</span> in funded allocation. Straightforward drawdown rules. No consistency requirements. No unnecessary restrictions.
          </p>

          {/* Floating Stats Cards */}
          <div className="grid grid-cols-3 gap-2 md:flex md:flex-row md:justify-center md:items-center md:gap-8 px-1 md:px-0 mb-6 md:mb-8">
            {[
              { value: "15%", label: "Max Drawdown", delay: "0s" },
              { value: "8%", label: "Daily Drawdown", delay: "0.1s" },
              { value: "$3M", label: "Max Allocation", delay: "0.2s" }
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

          {/* Simple Rules Card */}
          <div className="max-w-2xl mx-auto mb-6 md:mb-8">
            <div className="bg-gradient-to-br from-[#0FF1CE]/10 to-[#0FF1CE]/5 backdrop-blur-sm rounded-2xl p-4 md:p-8 border border-[#0FF1CE]/20"
              style={{ boxShadow: '0 0 20px rgba(15, 241, 206, 0.1)' }}>
              <h3 className="text-lg md:text-2xl font-bold text-[#0FF1CE] mb-4 md:mb-6 text-center">Simple Rules. Serious Capital.</h3>
              <div className="grid grid-cols-2 gap-2 md:gap-4 text-left">
                {VIP_RULES.map((rule, index) => (
                  <div key={index} className="flex items-center space-x-2 md:space-x-3 group">
                    <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-[#0FF1CE]/10 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                      <span className="text-[#0FF1CE] text-xs md:text-sm">✓</span>
                    </div>
                    <span className="text-gray-300 text-xs md:text-base group-hover:text-white transition-colors">{rule}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile CTA - scrolls to allocation selector */}
          <button
            onClick={() => document.getElementById('account-selector')?.scrollIntoView({ behavior: 'smooth' })}
            className="md:hidden w-full max-w-xs mx-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-[#0FF1CE] to-[#00D9FF] text-black text-sm font-bold rounded-xl active:scale-[0.98] transition-transform shadow-[0_0_20px_rgba(15,241,206,0.3)]"
          >
            <span>Choose Your Allocation</span>
            <ChevronDown size={18} />
          </button>
        </div>
      </section>

      {/* VIP Infrastructure Section */}
      <section className="py-12 md:py-20 px-6 bg-black relative overflow-hidden">
        <div className="relative z-10 max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-[#0FF1CE] mb-8 md:mb-12">
            VIP-Level Support & Infrastructure
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
            <div className="bg-gradient-to-br from-[#0FF1CE]/10 to-[#0FF1CE]/5 backdrop-blur-sm rounded-2xl p-6 border border-[#0FF1CE]/20"
              style={{ boxShadow: '0 0 20px rgba(15, 241, 206, 0.1)' }}>
              <div className="w-12 h-12 bg-[#0FF1CE]/20 rounded-xl flex items-center justify-center mb-4">
                <Crown size={24} className="text-[#0FF1CE]" />
              </div>
              <h3 className="text-white font-bold text-lg mb-2">VIP Dashboard</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Every Professional, Executive and Institutional trader receives access to the new Shockwave Capital VIP Dashboard — a dedicated environment built specifically for larger funded allocations.
              </p>
            </div>

            <div className="bg-gradient-to-br from-[#0FF1CE]/10 to-[#0FF1CE]/5 backdrop-blur-sm rounded-2xl p-6 border border-[#0FF1CE]/20"
              style={{ boxShadow: '0 0 20px rgba(15, 241, 206, 0.1)' }}>
              <div className="w-12 h-12 bg-[#0FF1CE]/20 rounded-xl flex items-center justify-center mb-4">
                <Headphones size={24} className="text-[#0FF1CE]" />
              </div>
              <h3 className="text-white font-bold text-lg mb-2">Dedicated Account Manager</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Your own dedicated trading support account manager, available 24/7 for account, platform and payout support with near-instant response times. No generic support queues. No waiting days for answers.
              </p>
            </div>

            <div className="bg-gradient-to-br from-[#0FF1CE]/10 to-[#0FF1CE]/5 backdrop-blur-sm rounded-2xl p-6 border border-[#0FF1CE]/20"
              style={{ boxShadow: '0 0 20px rgba(15, 241, 206, 0.1)' }}>
              <div className="w-12 h-12 bg-[#0FF1CE]/20 rounded-xl flex items-center justify-center mb-4">
                <TrendingUp size={24} className="text-[#0FF1CE]" />
              </div>
              <h3 className="text-white font-bold text-lg mb-2">Get Paid for Performance</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                80% starting profit split. Monthly payouts available through bank transfer / Wise or cryptocurrency. Larger corporate and institutional allocations receive priority payout support, dedicated onboarding and direct account management.
              </p>
            </div>
          </div>

          {/* Live Copy Trading Callout */}
          <div className="bg-gradient-to-r from-[#0FF1CE]/20 via-[#0FF1CE]/10 to-[#0FF1CE]/5 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-[#0FF1CE]/40 relative overflow-hidden mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-[#0FF1CE]/5 to-transparent rounded-xl"></div>
            <div className="relative z-10 flex items-start md:items-center gap-3 md:gap-4">
              <div className="w-10 h-10 bg-[#0FF1CE]/20 rounded-full flex items-center justify-center shrink-0">
                <Copy size={20} className="text-[#0FF1CE]" />
              </div>
              <div className="text-left">
                <div className="text-[#0FF1CE] font-bold text-sm md:text-base mb-1">
                  Live Copy Trading to Corporate Accounts
                </div>
                <div className="text-gray-300 text-xs md:text-sm">
                  All trades are live copy traded to our corporate accounts — your performance moves real capital.
                </div>
              </div>
            </div>
          </div>

          {/* Stop Managing Ten Small Accounts */}
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Stop Managing Ten Small Accounts.</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8">
              {[
                "One larger allocation",
                "More usable drawdown",
                "Fewer restrictions",
                "Dedicated VIP infrastructure"
              ].map((item, index) => (
                <div key={index} className="text-center bg-[#0FF1CE]/5 rounded-lg p-3 border border-[#0FF1CE]/20">
                  <div className="text-gray-300 text-xs md:text-sm">{item}</div>
                </div>
              ))}
            </div>
            <p className="text-gray-400 text-sm md:text-base mb-6">
              A structure built for experienced traders. Ready to trade serious capital?
            </p>
            <button
              onClick={() => document.getElementById('account-selector')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 bg-gradient-to-r from-[#0FF1CE] to-[#00D9FF] text-black text-base md:text-lg font-bold rounded-xl hover:scale-105 transition-transform shadow-[0_0_20px_rgba(15,241,206,0.3)]"
            >
              Choose Your Allocation & Get Started
            </button>
          </div>
        </div>
      </section>

      {/* Allocation Options Section */}
      <section id="account-selector" className="py-12 md:py-20 px-6 bg-black relative overflow-hidden scroll-mt-20">
        <div className="relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-[#0FF1CE] mb-3">
            Choose Your Allocation
          </h2>
          <p className="text-center text-gray-400 text-sm md:text-base mb-8 md:mb-12 max-w-2xl mx-auto">
            One larger allocation. More usable drawdown. Fewer restrictions.
          </p>
          
          <div className="max-w-6xl -mx-6 px-6 md:mx-auto md:px-0 flex md:grid md:grid-cols-3 gap-4 md:gap-6 overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none pb-4 md:pb-0 hide-scrollbar">
            {VIP_OPTIONS.map((option) => (
              <div
                key={option.level}
                className={`group relative shrink-0 w-[80%] max-w-[320px] snap-center md:w-auto md:max-w-none bg-gradient-to-br from-[#0FF1CE]/10 to-[#0FF1CE]/5 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-[#0FF1CE]/20 hover:scale-105 transition-all duration-300 cursor-pointer ${
                  selectedOption?.level === option.level ? 'ring-2 ring-[#0FF1CE]' : ''
                }`}
                style={{
                  boxShadow: '0 0 20px rgba(15, 241, 206, 0.1)'
                }}
                onClick={() => handleSelectOption(option)}
              >
                <div className="text-center">
                  <div className="inline-block bg-[#0FF1CE]/10 text-[#0FF1CE] text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3">
                    {option.name}
                  </div>
                  <div className="text-3xl font-bold text-[#0FF1CE] mb-2">{option.level}</div>
                  <div className="text-3xl font-bold text-white">${option.price.toLocaleString()}</div>
                  <div className="text-sm text-gray-400 mt-1 mb-4">One-Time Fee</div>

                  <div className="border-t border-[#0FF1CE]/20 pt-4 space-y-2 text-left">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Max Drawdown:</span>
                      <span className="text-white font-semibold">{option.maxDrawdown}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Daily Drawdown:</span>
                      <span className="text-white font-semibold">{option.dailyDrawdown}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Leverage:</span>
                      <span className="text-white font-semibold">Up to 1:100</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Profit Split:</span>
                      <span className="text-white font-semibold">80% Starting</span>
                    </div>
                  </div>
                </div>

                {selectedOption?.level === option.level && (
                  <div className="absolute top-2 right-2">
                    <div className="w-6 h-6 bg-[#0FF1CE] rounded-full flex items-center justify-center">
                      <Check size={14} className="text-black" />
                    </div>
                  </div>
                )}

                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#0FF1CE]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            ))}
          </div>
          <p className="md:hidden text-center text-gray-500 text-xs mt-2">← Swipe to explore allocations →</p>
        </div>
      </section>

      {/* Form Section */}
      {selectedOption && (
        <section id="information-section" className="py-12 md:py-20 px-6 bg-black relative overflow-hidden scroll-mt-20">
          <div className="relative z-10">
            <h2 className="text-4xl font-bold text-center text-[#0FF1CE] mb-16">Complete Your Information</h2>
            
            <div className="max-w-2xl mx-auto">
              <div className="bg-gradient-to-br from-[#0FF1CE]/10 to-[#0FF1CE]/5 backdrop-blur-sm rounded-2xl p-8 border border-[#0FF1CE]/20"
                style={{ boxShadow: '0 0 20px rgba(15, 241, 206, 0.1)' }}>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-white mb-2">First Name *</label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 bg-[#181818] border rounded-lg focus:outline-none focus:border-[#0FF1CE] text-white placeholder-gray-400 ${
                          formErrors.firstName ? 'border-red-500' : 'border-[#0FF1CE]/20'
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
                        className={`w-full px-4 py-3 bg-[#181818] border rounded-lg focus:outline-none focus:border-[#0FF1CE] text-white placeholder-gray-400 ${
                          formErrors.lastName ? 'border-red-500' : 'border-[#0FF1CE]/20'
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
                      className={`w-full px-4 py-3 bg-[#181818] border rounded-lg focus:outline-none focus:border-[#0FF1CE] text-white placeholder-gray-400 ${
                        formErrors.email ? 'border-red-500' : 'border-[#0FF1CE]/20'
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
                        className={`w-full px-4 py-3 bg-[#181818] border rounded-lg focus:outline-none focus:border-[#0FF1CE] text-white placeholder-gray-400 ${
                          formErrors.phone ? 'border-red-500' : 'border-[#0FF1CE]/20'
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
                        className={`w-full px-4 py-3 bg-[#181818] border rounded-lg focus:outline-none focus:border-[#0FF1CE] text-white ${
                          formErrors.country ? 'border-red-500' : 'border-[#0FF1CE]/20'
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
                    <label className="block text-white mb-2">Trading Platform *</label>
                    <select
                      name="platform"
                      value={formData.platform}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 bg-[#181818] border rounded-lg focus:outline-none focus:border-[#0FF1CE] text-white ${
                        formErrors.platform ? 'border-red-500' : 'border-[#0FF1CE]/20'
                      }`}
                    >
                      <option value="MT5">MetaTrader 5 (MT5)</option>
                      <option value="MT4">MetaTrader 4 (MT4)</option>
                    </select>
                    {formErrors.platform && <p className="text-red-500 text-sm mt-1">{formErrors.platform}</p>}
                    <p className="text-gray-400 text-xs mt-1">Select your preferred trading platform</p>
                  </div>

                  <div>
                    <label className="block text-white mb-2">Discord Username (Optional)</label>
                    <input
                      type="text"
                      name="discordUsername"
                      value={formData.discordUsername}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-[#181818] border border-[#0FF1CE]/20 rounded-lg focus:outline-none focus:border-[#0FF1CE] text-white placeholder-gray-400"
                      placeholder="Your Discord username"
                    />
                  </div>

                  <div className="pt-6 border-t border-[#0FF1CE]/20">
                    <div className="flex justify-between items-center mb-6">
                      <div>
                        <div className="text-lg font-semibold text-white">VIP Allocation</div>
                        <div className="text-[#0FF1CE]">{selectedOption.level} {selectedOption.name} Account</div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-[#0FF1CE]">${selectedOption.price.toLocaleString()}</div>
                        <div className="text-gray-400 text-sm">One-Time Fee</div>
                      </div>
                    </div>

                    <button
                      onClick={handleProceedToPayment}
                      className="w-full bg-gradient-to-r from-[#0FF1CE] to-[#00D9FF] hover:scale-105 text-black font-bold py-4 rounded-xl transition-all"
                    >
                      Activate VIP Allocation
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

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}

// Wrapper component with Suspense boundary
export default function VipPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#0D0D0D]">
        <div className="w-8 h-8 border-4 border-[#0FF1CE] border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <VipContent />
    </Suspense>
  );
}
