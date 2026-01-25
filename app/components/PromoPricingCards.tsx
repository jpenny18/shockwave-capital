'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface ChallengeConfig {
  name: string;
  accounts: number[];
  originalPrices: { [key: number]: number };
  promoPrices: { [key: number]: number };
  profitTargetStep1: string;
  profitTargetStep2?: string;
  maxDailyLoss: string;
  maxLoss: string;
  minTradingDays: string;
  tradingPeriod: string;
  refund: string;
  avgReward: { [key: number]: number };
}

const challengeConfigs: { [key: string]: ChallengeConfig } = {
  standard: {
    name: "Shockwave Standard",
    accounts: [500000, 200000, 100000, 50000, 25000, 10000, 5000],
    originalPrices: { 500000: 1899, 200000: 949, 100000: 499, 50000: 289, 25000: 189, 10000: 109, 5000: 59 },
    promoPrices: { 500000: 950, 200000: 475, 100000: 250, 50000: 145, 25000: 95, 10000: 55, 5000: 30 },
    profitTargetStep1: "10%",
    profitTargetStep2: "5%",
    maxDailyLoss: "8%",
    maxLoss: "15%",
    minTradingDays: "5 days",
    tradingPeriod: "Unlimited",
    refund: "Yes",
    avgReward: { 500000: 21000, 200000: 8500, 100000: 4200, 50000: 2100, 25000: 1050, 10000: 420, 5000: 210 }
  },
  onestep: {
    name: "Shockwave 1-Step",
    accounts: [500000, 200000, 100000, 50000, 25000, 10000, 5000],
    originalPrices: { 500000: 1999, 200000: 989, 100000: 569, 50000: 289, 25000: 199, 10000: 119, 5000: 65 },
    promoPrices: { 500000: 1000, 200000: 495, 100000: 285, 50000: 145, 25000: 100, 10000: 60, 5000: 33 },
    profitTargetStep1: "10%",
    profitTargetStep2: undefined,
    maxDailyLoss: "4%",
    maxLoss: "8%",
    minTradingDays: "5 days",
    tradingPeriod: "Unlimited",
    refund: "Yes",
    avgReward: { 500000: 18000, 200000: 7200, 100000: 3600, 50000: 1800, 25000: 900, 10000: 360, 5000: 180 }
  },
  instant: {
    name: "Shockwave Instant",
    accounts: [500000, 200000, 100000, 50000, 25000, 10000, 5000],
    originalPrices: { 500000: 6999, 200000: 3499, 100000: 1799, 50000: 899, 25000: 749, 10000: 549, 5000: 299 },
    promoPrices: { 500000: 3500, 200000: 1750, 100000: 900, 50000: 450, 25000: 375, 10000: 275, 5000: 150 },
    profitTargetStep1: "12%",
    profitTargetStep2: undefined,
    maxDailyLoss: "None",
    maxLoss: "4%",
    minTradingDays: "5 days",
    tradingPeriod: "Unlimited",
    refund: "Yes",
    avgReward: { 500000: 28000, 200000: 11200, 100000: 5600, 50000: 2800, 25000: 1400, 10000: 560, 5000: 280 }
  },
  gauntlet: {
    name: "Shockwave Gauntlet",
    accounts: [200000, 100000, 50000, 25000, 10000],
    originalPrices: { 200000: 20, 100000: 20, 50000: 20, 25000: 20, 10000: 20 },
    promoPrices: { 200000: 10, 100000: 10, 50000: 10, 25000: 10, 10000: 10 },
    profitTargetStep1: "10%",
    profitTargetStep2: undefined,
    maxDailyLoss: "8%",
    maxLoss: "15%",
    minTradingDays: "0 days",
    tradingPeriod: "Unlimited",
    refund: "Yes",
    avgReward: { 200000: 14000, 100000: 7000, 50000: 3500, 25000: 1750, 10000: 700 }
  }
};

const TargetIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

const ArrowDownIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 5v14M5 12l7 7 7-7" />
  </svg>
);

const DownArrowSmallIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 5v14M8 15l4 4 4-4" />
  </svg>
);

const ClockIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" />
  </svg>
);

const CalendarIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18" />
  </svg>
);

const DollarIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v12M9 9h6a2 2 0 010 4H9a2 2 0 000 4h6" />
  </svg>
);

export default function PromoPricingCards() {
  const router = useRouter();
  const [currentPlan, setCurrentPlan] = useState<'standard' | 'onestep' | 'instant' | 'gauntlet'>('standard');
  const [selectedMobileAccount, setSelectedMobileAccount] = useState(100000);

  const config = challengeConfigs[currentPlan];
  // Best value is 100K (index 2 for 7-account plans, index 1 for gauntlet)
  const bestValueIndex = currentPlan === 'gauntlet' ? 1 : 2;

  const handlePurchase = (account: number) => {
    let challengeType = 'Standard';
    if (currentPlan === 'instant') challengeType = 'Instant';
    else if (currentPlan === 'onestep') challengeType = '1-Step';
    else if (currentPlan === 'gauntlet') challengeType = 'Gauntlet';
    
    sessionStorage.setItem('preselectedChallengeType', challengeType);
    sessionStorage.setItem('preselectedBalance', account.toString());
    sessionStorage.setItem('promoCode', 'NYE');
    router.push('/challenge');
  };

  const features = [
    { 
      icon: <TargetIcon />, 
      label: 'Profit Target',
      getValue: () => config.profitTargetStep2 
        ? { step1: config.profitTargetStep1, step2: config.profitTargetStep2 }
        : { step1: config.profitTargetStep1 }
    },
    { icon: <ArrowDownIcon />, label: 'Max. Daily Loss', getValue: () => config.maxDailyLoss },
    { icon: <DownArrowSmallIcon />, label: 'Max. Loss', getValue: () => config.maxLoss },
    { icon: <ClockIcon />, label: 'Min. trading days', getValue: () => config.minTradingDays },
    { icon: <CalendarIcon />, label: 'Trading Period', getValue: () => config.tradingPeriod },
    { icon: <DollarIcon />, label: 'Refund', getValue: () => config.refund }
  ];

  return (
    <div className="relative z-10">
      {/* Plan Type Selection */}
      <div className="container max-w-7xl mx-auto mb-6 px-4">
        <div className="flex justify-center text-white">
          <div className="flex flex-wrap items-center justify-center gap-2 rounded-full border border-white/30 bg-black/60 backdrop-blur-sm px-3 py-2">
            <button
              type="button"
              onClick={() => setCurrentPlan('standard')}
              className={`flex items-center justify-center rounded-full text-xs md:text-sm px-3 md:px-5 py-1.5 md:py-2 font-bold transition-all duration-300 ${
                currentPlan === 'standard' 
                  ? 'bg-[#0FF1CE] text-black border border-[#0FF1CE]' 
                  : 'bg-transparent text-white/80 border border-white/20 hover:bg-[#0FF1CE]/10'
              }`}
            >
              Standard
            </button>
            <button
              type="button"
              onClick={() => setCurrentPlan('onestep')}
              className={`flex items-center justify-center rounded-full text-xs md:text-sm px-3 md:px-5 py-1.5 md:py-2 font-bold transition-all duration-300 ${
                currentPlan === 'onestep' 
                  ? 'bg-[#0FF1CE] text-black border border-[#0FF1CE]' 
                  : 'bg-transparent text-white/80 border border-white/20 hover:bg-[#0FF1CE]/10'
              }`}
            >
              1-Step
            </button>
            <button
              type="button"
              onClick={() => setCurrentPlan('instant')}
              className={`flex items-center justify-center rounded-full text-xs md:text-sm px-3 md:px-5 py-1.5 md:py-2 font-bold transition-all duration-300 ${
                currentPlan === 'instant' 
                  ? 'bg-[#0FF1CE] text-black border border-[#0FF1CE]' 
                  : 'bg-transparent text-white/80 border border-white/20 hover:bg-[#0FF1CE]/10'
              }`}
            >
              Instant
            </button>
            <button
              type="button"
              onClick={() => setCurrentPlan('gauntlet')}
              className={`flex items-center justify-center rounded-full text-xs md:text-sm px-3 md:px-5 py-1.5 md:py-2 font-bold transition-all duration-300 ${
                currentPlan === 'gauntlet' 
                  ? 'bg-[#FF6B6B] text-white border border-[#FF6B6B]' 
                  : 'bg-transparent text-white/80 border border-white/20 hover:bg-[#FF6B6B]/10'
              }`}
            >
              Gauntlet
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block max-w-[1400px] mx-auto px-4 overflow-x-auto pt-4">
        <div className="flex gap-0 min-w-fit">
          {/* Left Column - Feature Labels */}
          <div className="flex-shrink-0 w-40 pt-[80px]">
            {features.map((feature, idx) => (
              <div 
                key={idx} 
                className="h-[44px] flex items-center gap-2 px-2"
              >
                <span className="text-gray-400">{feature.icon}</span>
                <span className="text-white text-[11px] font-medium">{feature.label}</span>
              </div>
            ))}
            <div className="mt-2 px-2">
              <p className="text-gray-500 text-[10px]">Activation payments are one-time payments</p>
            </div>
          </div>

          {/* Account Cards */}
          <div className="flex gap-1.5 flex-1 justify-center">
            {config.accounts.map((account, cardIndex) => {
              const isBestValue = cardIndex === bestValueIndex;
              
              return (
                <div 
                  key={account} 
                  className={`flex-shrink-0 w-[140px] relative ${isBestValue ? 'z-10' : ''}`}
                >
                  {/* Best Value Badge */}
                  {isBestValue && (
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-20">
                      <div className="bg-[#0FF1CE] text-black text-[9px] font-bold px-2.5 py-0.5 rounded-full whitespace-nowrap">
                        Best value
                      </div>
                    </div>
                  )}
                  
                  <div className={`rounded-lg overflow-hidden ${
                    isBestValue 
                      ? 'bg-[#0d1a1f] border-2 border-[#0FF1CE]/50' 
                      : 'bg-[#0d1117] border border-gray-800'
                  }`}>
                    {/* Account Size Header */}
                    <div className={`p-3 text-center ${isBestValue ? 'pt-4' : ''}`}>
                      <div className="text-gray-400 text-[9px] font-medium mb-0.5">Account</div>
                      <div className="text-white text-lg font-bold">
                        ${account >= 1000 ? `${account / 1000}K` : account}
                      </div>
                    </div>

                    {/* Feature Values */}
                    <div className="flex flex-col">
                      {features.map((feature, idx) => {
                        const value = feature.getValue();
                        
                        return (
                          <div 
                            key={idx} 
                            className="h-[44px] flex items-center justify-center px-1.5 border-t border-gray-800/50"
                          >
                            {typeof value === 'object' && 'step1' in value ? (
                              <div className="flex items-center gap-0.5 text-center">
                                <div>
                                  <div className="text-[7px] text-gray-500 font-semibold uppercase">S1</div>
                                  <div className="text-white text-[11px] font-medium">{value.step1}</div>
                                </div>
                                {value.step2 && (
                                  <>
                                    <svg className="w-1.5 h-1.5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                    <div>
                                      <div className="text-[7px] text-gray-500 font-semibold uppercase">S2</div>
                                      <div className="text-white text-[11px] font-medium">{value.step2}</div>
                                    </div>
                                  </>
                                )}
                              </div>
                            ) : feature.label === 'Refund' ? (
                              <div className="flex items-center gap-1">
                                <span className="text-white text-[11px] font-medium">{value as string}</span>
                                <span className="bg-[#0FF1CE] text-black text-[8px] font-bold px-1 py-0.5 rounded">100%</span>
                              </div>
                            ) : (
                              <span className="text-white text-[11px] font-medium">{value as string}</span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Pricing */}
                    <div className="p-3 pt-2 border-t border-gray-800/50">
                      <div className="flex items-center justify-center gap-1.5 mb-0.5">
                        <span className="text-[#0FF1CE] text-lg font-bold">${config.promoPrices[account]}</span>
                        <span className="text-gray-500 line-through text-[10px]">${config.originalPrices[account]}</span>
                      </div>
                      
                      <div className="text-center mb-2">
                        <span className="text-[#0FF1CE] text-[9px] font-medium">+ 1 Free Retry</span>
                      </div>
                      
                      <button
                        onClick={() => handlePurchase(account)}
                        className="w-full bg-[#0FF1CE] hover:bg-[#0AA89E] text-black font-bold py-1.5 px-2 rounded-md transition-all duration-300 hover:scale-105 text-xs"
                      >
                        Start now
                      </button>
                    </div>

                    {/* Average Reward */}
                    <div className="px-3 pb-3">
                      <div className="bg-[#1a2332] rounded-md py-2 px-2 text-center">
                        <div className="text-white text-sm font-bold">${config.avgReward[account].toLocaleString()}</div>
                        <div className="text-gray-400 text-[9px]">Avg. Reward</div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden px-4">
        {/* Mobile Account Selector */}
        <div className="flex justify-center gap-1.5 mb-5 flex-wrap">
          {config.accounts.map((account) => (
            <button
              key={account}
              onClick={() => setSelectedMobileAccount(account)}
              className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all duration-300 ${
                selectedMobileAccount === account
                  ? 'bg-[#0FF1CE] text-black'
                  : 'bg-[#1a2332] text-white border border-gray-700'
              }`}
            >
              ${account >= 1000 ? `${account / 1000}K` : account}
            </button>
          ))}
        </div>

        {/* Mobile Card */}
        <div className="max-w-sm mx-auto">
          <div className="bg-[#0d1117] border border-[#0FF1CE]/30 rounded-xl overflow-hidden">
            {/* Header */}
            <div className="p-5 text-center border-b border-gray-800/50">
              <div className="text-gray-400 text-xs font-medium mb-1">Account</div>
              <div className="text-white text-3xl font-bold">${selectedMobileAccount.toLocaleString()}</div>
            </div>

            {/* Features */}
            <div className="divide-y divide-gray-800/50">
              {features.map((feature, idx) => {
                const value = feature.getValue();
                
                return (
                  <div key={idx} className="flex items-center justify-between px-5 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400">{feature.icon}</span>
                      <span className="text-white text-sm">{feature.label}</span>
                    </div>
                    <div className="text-right">
                      {typeof value === 'object' && 'step1' in value ? (
                        <div className="flex items-center gap-2">
                          <div className="text-center">
                            <div className="text-[8px] text-gray-500 uppercase">S1</div>
                            <div className="text-white text-sm font-medium">{value.step1}</div>
                          </div>
                          {value.step2 && (
                            <>
                              <span className="text-gray-600">/</span>
                              <div className="text-center">
                                <div className="text-[8px] text-gray-500 uppercase">S2</div>
                                <div className="text-white text-sm font-medium">{value.step2}</div>
                              </div>
                            </>
                          )}
                        </div>
                      ) : feature.label === 'Refund' ? (
                        <div className="flex items-center gap-2">
                          <span className="text-white text-sm font-medium">{value as string}</span>
                          <span className="bg-[#0FF1CE] text-black text-[10px] font-bold px-1.5 py-0.5 rounded">100%</span>
                        </div>
                      ) : (
                        <span className="text-white text-sm font-medium">{value as string}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pricing */}
            <div className="p-5 border-t border-gray-800/50">
              <div className="flex items-center justify-center gap-3 mb-1">
                <span className="text-[#0FF1CE] text-2xl font-bold">${config.promoPrices[selectedMobileAccount]}</span>
                <span className="text-gray-500 line-through">${config.originalPrices[selectedMobileAccount]}</span>
              </div>
              
              <div className="text-center mb-4">
                <span className="text-[#0FF1CE] text-xs font-medium">+ 1 Free Retry Included</span>
              </div>
              
              <button
                onClick={() => handlePurchase(selectedMobileAccount)}
                className="w-full bg-[#0FF1CE] hover:bg-[#0AA89E] text-black font-bold py-3 px-4 rounded-lg transition-all duration-300 text-base"
              >
                Start now
              </button>
            </div>

            {/* Average Reward */}
            <div className="px-5 pb-5">
              <div className="bg-[#1a2332] rounded-lg py-3 px-4 text-center">
                <div className="text-white text-lg font-bold">${config.avgReward[selectedMobileAccount].toLocaleString()}</div>
                <div className="text-gray-400 text-xs">Avg. Reward</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
