'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Particles from '../components/Particles';
import Header from '../components/Header';
import { Check, ChevronRight, ArrowRight } from 'lucide-react';
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
  q1_experience: string;
  q2_markets: string[];
  q3_frequency: string;
  q4_challenges: string[];
  q5_risk: string;
  q6_style: string;
  q7_mistakes: string[];
  q8_rules: string;
  q9_accountSize: string;
  q10_priority: string;
}

interface ActivationOption {
  level: string;
  price: number;
  features: string[];
}

const ACTIVATION_OPTIONS: ActivationOption[] = [
  {
    level: '$25k',
    price: 499,
    features: [
      '$25,000 Live copy trading Capital',
      '15% Max Drawdown',
      '8% Daily Drawdown',
      '1:200 Leverage',
      'No Trading Restrictions',
      'Weekend Holding Allowed'
    ]
  },
  {
    level: '$50k',
    price: 499,
    features: [
      '$50,000 Live copy trading Capital',
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
      '$100,000 Live copy trading Capital',
      '15% Max Drawdown',
      '8% Daily Drawdown',
      '1:200 Leverage',
      'No Trading Restrictions',
      'Weekend Holding Allowed'
    ]
  }
];

const PAYOUT_SCREENSHOTS = [
  '/certificates/typecert1.png',
  '/certificates/typecert2.png',
  '/certificates/typecert3.png',
  '/certificates/typecert4.png'
];

export default function FundApplicationPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    q1_experience: '',
    q2_markets: [],
    q3_frequency: '',
    q4_challenges: [],
    q5_risk: '',
    q6_style: '',
    q7_mistakes: [],
    q8_rules: '',
    q9_accountSize: '',
    q10_priority: ''
  });
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<ActivationOption | null>(null);
  const [showPayment, setShowPayment] = useState(false);
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

  // Calculate score based on answers
  const calculateScore = () => {
    let newScore = 0;

    // Q1: Experience
    if (formData.q1_experience === 'new') newScore += 1;
    else if (formData.q1_experience === 'intermediate') newScore += 2;
    else if (formData.q1_experience === 'experienced') newScore += 3;

    // Q3: Frequency
    if (formData.q3_frequency === 'few-times') newScore += 1;
    else if (formData.q3_frequency === 'daily') newScore += 2;
    else if (formData.q3_frequency === 'high-probability') newScore += 3;

    // Q5: Risk per trade
    if (formData.q5_risk === 'under-0.5') newScore += 4;
    else if (formData.q5_risk === '0.5-1') newScore += 3;
    else if (formData.q5_risk === '1-2') newScore += 1;

    // Q6: Style
    if (formData.q6_style === 'conservative') newScore += 3;
    else if (formData.q6_style === 'balanced') newScore += 2;
    else if (formData.q6_style === 'aggressive') newScore += 1;

    // Q7: Mistakes
    if (formData.q7_mistakes.includes('rarely-blow')) newScore += 3;
    else if (formData.q7_mistakes.length > 0) newScore += 1;

    // Q8: Rules
    if (formData.q8_rules === 'yes-always') newScore += 4;
    else if (formData.q8_rules === 'mostly') newScore += 2;

    // Q9: Account size
    if (formData.q9_accountSize === '25k') newScore += 1;
    else if (formData.q9_accountSize === '50k') newScore += 2;
    else if (formData.q9_accountSize === '100k') newScore += 3;

    // Q10: Priority (any answer = +1)
    if (formData.q10_priority.trim().length > 0) newScore += 1;

    setScore(newScore);
    return newScore;
  };

  const getRiskTag = (score: number) => {
    if (score >= 16) return 'Risk_A';
    if (score >= 12) return 'Risk_B';
    return 'Risk_C';
  };

  const getHighRiskBehavior = () => {
    return formData.q5_risk === 'over-2' || formData.q8_rules === 'trade-freely';
  };

  const handleMultipleChoice = (question: keyof FormData, value: string) => {
    setFormData(prev => {
      const current = prev[question] as string[];
      if (current.includes(value)) {
        return { ...prev, [question]: current.filter(v => v !== value) };
      }
      return { ...prev, [question]: [...current, value] };
    });
  };

  const handleNext = () => {
    // Calculate score before final approval screen
    if (currentStep === 13) {
      const finalScore = calculateScore();
      
      // Auto-select account based on Q9
      if (formData.q9_accountSize === '25k') {
        setSelectedOption(ACTIVATION_OPTIONS[0]);
      } else if (formData.q9_accountSize === '50k') {
        setSelectedOption(ACTIVATION_OPTIONS[1]);
      } else if (formData.q9_accountSize === '100k') {
        setSelectedOption(ACTIVATION_OPTIONS[2]);
      }
    }
    setCurrentStep(prev => prev + 1);
  };

  const handleProceedToPayment = () => {
    setShowPayment(true);
  };

  const getChallengeData = () => {
    if (!selectedOption) return null;
    
    return {
      type: 'fund-trader-allocation',
      amount: selectedOption.level,
      platform: 'MT5',
      formData: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: 'N/A',
        country: 'N/A',
        discordUsername: ''
      },
      price: selectedOption.price,
      addOns: [],
      applicationData: {
        ...formData,
        score,
        riskTag: getRiskTag(score),
        highRiskBehavior: getHighRiskBehavior(),
        highValueIntent: formData.q9_accountSize === '100k'
      }
    };
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: return true; // Welcome screen
      case 1: return formData.q1_experience !== '';
      case 2: return formData.q2_markets.length > 0;
      case 3: return formData.q3_frequency !== '';
      case 4: return formData.q4_challenges.length > 0;
      case 5: return formData.q5_risk !== '';
      case 6: return formData.q6_style !== '';
      case 7: return formData.q7_mistakes.length > 0;
      case 8: return formData.q8_rules !== '';
      case 9: return true; // Statement screen
      case 10: return true; // Social proof screen
      case 11: return formData.q9_accountSize !== '';
      case 12: return formData.q10_priority.trim().length > 10;
      case 13: return formData.firstName !== '' && formData.lastName !== '' && formData.email !== '';
      default: return false;
    }
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
                  <h2 className="text-2xl font-bold text-[#0FF1CE]">Funded Account Allocation</h2>
                  <p className="text-gray-400 mt-1">{selectedOption.level} (MT5)</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-[#0FF1CE]">${selectedOption.price.toLocaleString()}</div>
                  <div className="text-gray-400 text-sm">Allocation Fee</div>
                </div>
              </div>
            </div>

            <CryptoPayment
              challengeData={getChallengeData()}
              successRedirectPath="/fund/pending"
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
      <Particles />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        
        {/* INTRO SCREEN (WELCOME) */}
        {currentStep === 0 && (
          <div className="text-center space-y-8 animate-fadeIn">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-[#0FF1CE] to-[#00D9FF] bg-clip-text text-transparent">
                Shockwave Capital
              </h1>
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                Capital Allocation Application
              </h2>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                We are looking for 5 traders that want direct capital from our firm.
                <br />
                This application takes ~2 minutes.
              </p>
            </div>

            <div className="flex items-center justify-center gap-8 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#0FF1CE] rounded-full"></div>
                <span className="text-gray-400">15% max drawdown</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#0FF1CE] rounded-full"></div>
                <span className="text-gray-400">8% daily</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#0FF1CE] rounded-full"></div>
                <span className="text-gray-400">1:200 leverage</span>
              </div>
            </div>

            <button
              onClick={handleNext}
              className="group mt-8 px-8 py-4 bg-gradient-to-r from-[#0FF1CE] to-[#00D9FF] text-black text-lg font-bold rounded-xl hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-[#0FF1CE]/25 flex items-center gap-2 mx-auto"
            >
               Start Application
              <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
            </button>
          </div>
        )}

        {/* SECTION 1 — TRADER CONTEXT */}
        {currentStep === 1 && (
          <div className="space-y-8 animate-fadeIn">
            <div className="text-center">
              <div className="text-sm text-[#0FF1CE] mb-2">QUESTION 1 OF 10</div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                What best describes your trading experience?
              </h2>
            </div>

            <div className="space-y-4 max-w-2xl mx-auto">
              {[
                { value: 'new', label: 'New trader (0–6 months)' },
                { value: 'intermediate', label: 'Intermediate (6–24 months)' },
                { value: 'experienced', label: 'Experienced (2+ years)' }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setFormData({ ...formData, q1_experience: option.value });
                    setTimeout(handleNext, 300);
                  }}
                  className={`w-full p-6 rounded-xl border-2 text-left transition-all duration-300 hover:scale-105 ${
                    formData.q1_experience === option.value
                      ? 'border-[#0FF1CE] bg-[#0FF1CE]/10'
                      : 'border-gray-800 hover:border-[#0FF1CE]/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-lg">{option.label}</span>
                    {formData.q1_experience === option.value && (
                      <Check size={24} className="text-[#0FF1CE]" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Q2: Markets */}
        {currentStep === 2 && (
          <div className="space-y-8 animate-fadeIn">
            <div className="text-center">
              <div className="text-sm text-[#0FF1CE] mb-2">QUESTION 2 OF 10</div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                What markets do you primarily trade?
              </h2>
              <p className="text-gray-400 text-sm">(Select all that apply)</p>
            </div>

            <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
              {[
                { value: 'forex', label: 'Forex' },
                { value: 'indices', label: 'Indices' },
                { value: 'gold', label: 'Gold' },
                { value: 'crypto', label: 'Crypto' }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleMultipleChoice('q2_markets', option.value)}
                  className={`p-6 rounded-xl border-2 transition-all duration-300 hover:scale-105 ${
                    formData.q2_markets.includes(option.value)
                      ? 'border-[#0FF1CE] bg-[#0FF1CE]/10'
                      : 'border-gray-800 hover:border-[#0FF1CE]/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-lg">{option.label}</span>
                    {formData.q2_markets.includes(option.value) && (
                      <Check size={24} className="text-[#0FF1CE]" />
                    )}
                  </div>
                </button>
              ))}
            </div>

            <div className="flex justify-center">
              <button
                onClick={handleNext}
                disabled={!canProceed()}
                className="px-8 py-4 bg-[#0FF1CE] text-black text-lg font-bold rounded-xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                Continue <ChevronRight className="inline" size={20} />
              </button>
            </div>
          </div>
        )}

        {/* Q3: Frequency */}
        {currentStep === 3 && (
          <div className="space-y-8 animate-fadeIn">
            <div className="text-center">
              <div className="text-sm text-[#0FF1CE] mb-2">QUESTION 3 OF 10</div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                How often do you trade?
              </h2>
            </div>

            <div className="space-y-4 max-w-2xl mx-auto">
              {[
                { value: 'few-times', label: 'A few times per week' },
                { value: 'daily', label: 'Daily' },
                { value: 'high-probability', label: 'Only high-probability setups' }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setFormData({ ...formData, q3_frequency: option.value });
                    setTimeout(handleNext, 300);
                  }}
                  className={`w-full p-6 rounded-xl border-2 text-left transition-all duration-300 hover:scale-105 ${
                    formData.q3_frequency === option.value
                      ? 'border-[#0FF1CE] bg-[#0FF1CE]/10'
                      : 'border-gray-800 hover:border-[#0FF1CE]/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-lg">{option.label}</span>
                    {formData.q3_frequency === option.value && (
                      <Check size={24} className="text-[#0FF1CE]" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 2 — PAIN & DESIRE PRIMING */}
        {currentStep === 4 && (
          <div className="space-y-8 animate-fadeIn">
            <div className="text-center">
              <div className="text-sm text-[#0FF1CE] mb-2">QUESTION 4 OF 10</div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                What has held you back from scaling?
              </h2>
              <p className="text-gray-400 text-sm">(Select all that apply)</p>
            </div>

            <div className="space-y-4 max-w-2xl mx-auto">
              {[
                { value: 'capital', label: 'Not enough capital' },
                { value: 'rules', label: 'Strict prop firm rules' },
                { value: 'drawdown', label: 'Trailing drawdowns' },
                { value: 'all', label: 'All of the above' }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleMultipleChoice('q4_challenges', option.value)}
                  className={`w-full p-6 rounded-xl border-2 text-left transition-all duration-300 hover:scale-105 ${
                    formData.q4_challenges.includes(option.value)
                      ? 'border-[#0FF1CE] bg-[#0FF1CE]/10'
                      : 'border-gray-800 hover:border-[#0FF1CE]/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-lg">{option.label}</span>
                    {formData.q4_challenges.includes(option.value) && (
                      <Check size={24} className="text-[#0FF1CE]" />
                    )}
                  </div>
                </button>
              ))}
            </div>

            <div className="flex justify-center">
              <button
                onClick={handleNext}
                disabled={!canProceed()}
                className="px-8 py-4 bg-[#0FF1CE] text-black text-lg font-bold rounded-xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                Continue <ChevronRight className="inline" size={20} />
              </button>
            </div>
          </div>
        )}

        {/* SECTION 3 — RISK BEHAVIOR */}
        {/* Q5: Risk per trade */}
        {currentStep === 5 && (
          <div className="space-y-8 animate-fadeIn">
            <div className="text-center">
              <div className="text-sm text-[#0FF1CE] mb-2">QUESTION 5 OF 10</div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                What is your typical risk per trade?
              </h2>
            </div>

            <div className="space-y-4 max-w-2xl mx-auto">
              {[
                { value: 'under-0.5', label: 'Under 0.5%' },
                { value: '0.5-1', label: '0.5% – 1%' },
                { value: '1-2', label: '1% – 2%' },
                { value: 'over-2', label: 'Over 2%' }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setFormData({ ...formData, q5_risk: option.value });
                    setTimeout(handleNext, 300);
                  }}
                  className={`w-full p-6 rounded-xl border-2 text-left transition-all duration-300 hover:scale-105 ${
                    formData.q5_risk === option.value
                      ? 'border-[#0FF1CE] bg-[#0FF1CE]/10'
                      : 'border-gray-800 hover:border-[#0FF1CE]/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-lg">{option.label}</span>
                    {formData.q5_risk === option.value && (
                      <Check size={24} className="text-[#0FF1CE]" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Q6: Trading style */}
        {currentStep === 6 && (
          <div className="space-y-8 animate-fadeIn">
            <div className="text-center">
              <div className="text-sm text-[#0FF1CE] mb-2">QUESTION 6 OF 10</div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Which best describes your trading style?
              </h2>
            </div>

            <div className="space-y-4 max-w-2xl mx-auto">
              {[
                { value: 'conservative', label: 'Conservative' },
                { value: 'balanced', label: 'Balanced' },
                { value: 'aggressive', label: 'Aggressive but controlled' }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setFormData({ ...formData, q6_style: option.value });
                    setTimeout(handleNext, 300);
                  }}
                  className={`w-full p-6 rounded-xl border-2 text-left transition-all duration-300 hover:scale-105 ${
                    formData.q6_style === option.value
                      ? 'border-[#0FF1CE] bg-[#0FF1CE]/10'
                      : 'border-gray-800 hover:border-[#0FF1CE]/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-lg">{option.label}</span>
                    {formData.q6_style === option.value && (
                      <Check size={24} className="text-[#0FF1CE]" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Q7: Account blowing habits */}
        {currentStep === 7 && (
          <div className="space-y-8 animate-fadeIn">
            <div className="text-center">
              <div className="text-sm text-[#0FF1CE] mb-2">QUESTION 7 OF 10</div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                How do you usually blow accounts?
              </h2>
              <p className="text-gray-400 text-sm">(Select all that apply)</p>
            </div>

            <div className="space-y-4 max-w-2xl mx-auto">
              {[
                { value: 'overtrading', label: 'Overtrading' },
                { value: 'revenge', label: 'Revenge trading' },
                { value: 'news', label: 'News volatility' },
                { value: 'stop-loss', label: 'Ignoring stop loss' },
                { value: 'rarely-blow', label: 'I rarely blow accounts' }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleMultipleChoice('q7_mistakes', option.value)}
                  className={`w-full p-6 rounded-xl border-2 text-left transition-all duration-300 hover:scale-105 ${
                    formData.q7_mistakes.includes(option.value)
                      ? 'border-[#0FF1CE] bg-[#0FF1CE]/10'
                      : 'border-gray-800 hover:border-[#0FF1CE]/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-lg">{option.label}</span>
                    {formData.q7_mistakes.includes(option.value) && (
                      <Check size={24} className="text-[#0FF1CE]" />
                    )}
                  </div>
                </button>
              ))}
            </div>

            <div className="flex justify-center">
              <button
                onClick={handleNext}
                disabled={!canProceed()}
                className="px-8 py-4 bg-[#0FF1CE] text-black text-lg font-bold rounded-xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                Continue <ChevronRight className="inline" size={20} />
              </button>
            </div>
          </div>
        )}

        {/* Q8: Rules compliance */}
        {currentStep === 8 && (
          <div className="space-y-8 animate-fadeIn">
            <div className="text-center">
              <div className="text-sm text-[#0FF1CE] mb-2">QUESTION 8 OF 10</div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Are you willing to follow firm risk rules strictly?
              </h2>
            </div>

            <div className="space-y-4 max-w-2xl mx-auto">
              {[
                { value: 'yes-always', label: 'Yes, always' },
                { value: 'mostly', label: 'Mostly' },
                { value: 'trade-freely', label: 'I trade freely' }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setFormData({ ...formData, q8_rules: option.value });
                    setTimeout(handleNext, 300);
                  }}
                  className={`w-full p-6 rounded-xl border-2 text-left transition-all duration-300 hover:scale-105 ${
                    formData.q8_rules === option.value
                      ? 'border-[#0FF1CE] bg-[#0FF1CE]/10'
                      : 'border-gray-800 hover:border-[#0FF1CE]/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-lg">{option.label}</span>
                    {formData.q8_rules === option.value && (
                      <Check size={24} className="text-[#0FF1CE]" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 4 — EDUCATION (RULES) */}
        {currentStep === 9 && (
          <div className="space-y-8 animate-fadeIn text-center">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-[#0FF1CE]">
                Shockwave Capital Account Structure
              </h2>
              <p className="text-lg text-gray-300">Every live copy trading account includes:</p>
            </div>

            <div className="max-w-2xl mx-auto bg-gradient-to-br from-[#0FF1CE]/10 to-[#0FF1CE]/5 backdrop-blur-sm rounded-2xl p-8 border border-[#0FF1CE]/20">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                {[
                  '• 15% maximum drawdown',
                  '• 8% daily drawdown',
                  '• 1:200 leverage',
                  '• No evaluation phase',
                  '• Weekend holding allowed'
                ].map((rule, index) => (
                  <div key={index} className="flex items-center space-x-3 group">
                    <div className="w-6 h-6 rounded-full bg-[#0FF1CE]/10 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                      <span className="text-[#0FF1CE] text-sm">✓</span>
                    </div>
                    <span className="text-gray-300 text-base group-hover:text-white transition-colors">{rule}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleNext}
              className="px-8 py-4 bg-[#0FF1CE] text-black text-lg font-bold rounded-xl hover:scale-105 transition-all duration-300"
            >
              Continue <ChevronRight className="inline" size={20} />
            </button>
          </div>
        )}

        {/* SECTION 5 — SOCIAL PROOF */}
        {currentStep === 10 && (
          <div className="space-y-8 animate-fadeIn text-center">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Recent Shockwave Payouts
              </h2>
              <p className="text-gray-400 text-sm">Real traders · Real withdrawals · Consistent risk management</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {PAYOUT_SCREENSHOTS.slice(0, 4).map((screenshot, index) => (
                <div key={index} className="relative aspect-square rounded-xl overflow-hidden border border-[#0FF1CE]/20 hover:scale-105 transition-transform">
                  <Image
                    src={screenshot}
                    alt={`Payout ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>

            <button
              onClick={handleNext}
              className="px-8 py-4 bg-[#0FF1CE] text-black text-lg font-bold rounded-xl hover:scale-105 transition-all duration-300"
            >
              Continue <ChevronRight className="inline" size={20} />
            </button>
          </div>
        )}

        {/* SECTION 6 — VALUE ANCHOR */}
        {currentStep === 11 && (
          <div className="space-y-8 animate-fadeIn">
            <div className="text-center">
              <div className="text-sm text-[#0FF1CE] mb-2">QUESTION 9 OF 10</div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                If capital and rules weren't a limitation,<br />which account size would you prefer?
              </h2>
            </div>

            <div className="space-y-4 max-w-2xl mx-auto">
              {[
                { value: '25k', label: '$25,000' },
                { value: '50k', label: '$50,000' },
                { value: '100k', label: '$100,000' }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setFormData({ ...formData, q9_accountSize: option.value });
                    setTimeout(handleNext, 300);
                  }}
                  className={`w-full p-6 rounded-xl border-2 text-left transition-all duration-300 hover:scale-105 ${
                    formData.q9_accountSize === option.value
                      ? 'border-[#0FF1CE] bg-[#0FF1CE]/10'
                      : 'border-gray-800 hover:border-[#0FF1CE]/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">{option.label}</span>
                    {formData.q9_accountSize === option.value && (
                      <Check size={24} className="text-[#0FF1CE]" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 7 — SOFT EXCLUSIVITY */}
        {currentStep === 12 && (
          <div className="space-y-8 animate-fadeIn">
            <div className="text-center">
              <div className="text-sm text-[#0FF1CE] mb-2">QUESTION 10 OF 10</div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Why should you receive priority access<br />to this allocation wave?
              </h2>
            </div>

            <div className="max-w-2xl mx-auto">
              <textarea
                value={formData.q10_priority}
                onChange={(e) => setFormData({ ...formData, q10_priority: e.target.value })}
                placeholder="Tell us why you're ready for funded capital..."
                rows={6}
                className="w-full bg-[#0d1117] border border-gray-800 rounded-xl p-6 text-white placeholder-gray-500 focus:outline-none focus:border-[#0FF1CE]/50 resize-none"
              />
              <p className="text-xs text-gray-500 mt-2">Minimum 10 characters</p>
            </div>

            <div className="flex justify-center">
              <button
                onClick={handleNext}
                disabled={!canProceed()}
                className="px-8 py-4 bg-[#0FF1CE] text-black text-lg font-bold rounded-xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                Continue <ChevronRight className="inline" size={20} />
              </button>
            </div>
          </div>
        )}

        {/* SECTION 8 — LEAD CAPTURE */}
        {currentStep === 13 && (
          <div className="space-y-8 animate-fadeIn">
            <div className="text-center">
              <div className="text-sm text-[#0FF1CE] mb-2">FINAL STEP</div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Where should we send your funding decision?
              </h2>
              <p className="text-gray-400 text-sm">We only use this to send your account details and funding status.</p>
            </div>

            <div className="max-w-2xl mx-auto space-y-4">
              <div>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  placeholder="First Name"
                  className="w-full bg-[#0d1117] border border-gray-800 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#0FF1CE]/50"
                />
              </div>

              <div>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  placeholder="Last Name"
                  className="w-full bg-[#0d1117] border border-gray-800 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#0FF1CE]/50"
                />
              </div>

              <div>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Email Address"
                  className="w-full bg-[#0d1117] border border-gray-800 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#0FF1CE]/50"
                />
              </div>
            </div>

            <div className="flex justify-center">
              <button
                onClick={handleNext}
                disabled={!canProceed()}
                className="px-8 py-4 bg-[#0FF1CE] text-black text-lg font-bold rounded-xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                Submit Application <ChevronRight className="inline" size={20} />
              </button>
            </div>
          </div>
        )}

        {/* SECTION 9 — APPROVAL & CHECKOUT */}
        {currentStep === 14 && selectedOption && (
          <div className="space-y-8 animate-fadeIn">
            <div className="text-center space-y-4">
              <div className="inline-block p-4 bg-[#0FF1CE]/10 rounded-full mb-4">
                <Check size={48} className="text-[#0FF1CE]" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#0FF1CE]">
                You're Eligible to become one of our fund traders
              </h2>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                You qualify for capital allocation under our current wave.
              </p>
            </div>

            <div className="max-w-2xl mx-auto">
              <div className="bg-gradient-to-br from-[#0FF1CE]/10 to-[#0FF1CE]/5 backdrop-blur-sm rounded-2xl p-8 border border-[#0FF1CE]/20">
                <div className="space-y-6">
                  <div>
                    <div className="text-sm text-gray-400 mb-2">Current Allocation Wave:</div>
                    <div className="text-2xl font-bold text-white">5 accounts</div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-400 mb-3">Your Selected Account:</div>
                    <div className="bg-black/50 rounded-xl p-6 space-y-3">
                      <div className="text-3xl font-bold text-[#0FF1CE]">{selectedOption.level}</div>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        {selectedOption.features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Check size={16} className="text-[#0FF1CE] shrink-0" />
                            <span className="text-gray-300">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-[#0FF1CE]/20 pt-6">
                    <div className="flex justify-between items-center mb-6">
                      <div className="text-lg text-gray-400">One-time allocation fee:</div>
                      <div className="text-3xl font-bold text-[#0FF1CE]">${selectedOption.price}</div>
                    </div>

                    <button
                      onClick={handleProceedToPayment}
                      className="w-full bg-gradient-to-r from-[#0FF1CE] to-[#00D9FF] text-black text-lg font-bold rounded-xl py-4 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-[#0FF1CE]/25"
                    >
                      Activate Funded Account
                    </button>
                  </div>

                  <div className="text-xs text-gray-500 text-center">
                    <p>Your Score: {score} | Risk Profile: {getRiskTag(score)}</p>
                    {formData.q9_accountSize === '100k' && (
                      <p className="text-[#0FF1CE] mt-1">High-Value Intent Trader</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
