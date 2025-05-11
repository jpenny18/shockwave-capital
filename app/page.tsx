'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import Image from 'next/image';
import Particles from './components/Particles';
import Header from './components/Header';
import Link from 'next/link';

export default function ShockwaveLandingPage() {
    const router = useRouter();
    const [selectedBalance, setSelectedBalance] = useState(100000);
    const [challengeType, setChallengeType] = useState('standard');
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        if (!user && !loading) {
          router.push('/earlyaccess');
        }
        setLoading(false);
      });
  
      return () => unsubscribe();
    }, [router, loading]);
    
    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#0D0D0D]">
          <div className="w-8 h-8 border-4 border-[#0FF1CE] border-t-transparent rounded-full animate-spin"></div>
        </div>
      );
    }
    
    const getOneTimePrice = (balance: number, type: string) => {
      const standardPrices: Record<number, string> = {
        5000: '80',
        10000: '150',
        25000: '300',
        50000: '350',
        100000: '600',
        200000: '999',
        500000: '1999'
      };

      const instantPrices: Record<number, string> = {
        25000: '799',
        50000: '999',
        100000: '1999'
      };

      return type === 'standard' ? standardPrices[balance] || '600' : instantPrices[balance] || '1999';
    };

    const values = {
      maxDailyLoss: selectedBalance * (challengeType === 'standard' ? 0.08 : 0.04),
      maxLoss: selectedBalance * (challengeType === 'standard' ? 0.15 : 0.12),
      profitTargetStep1: selectedBalance * (challengeType === 'standard' ? 0.10 : 0.12),
      profitTargetStep2: selectedBalance * (challengeType === 'standard' ? 0.05 : 0)
    };

    const standardBalances = [5000, 10000, 25000, 50000, 100000, 200000, 500000];
    const instantBalances = [25000, 50000, 100000];

    return (
      <div className="bg-gradient-to-b from-[#0D0D0D] via-[#121212] to-[#151515] text-white min-h-screen font-sans">
        <Header />
        
        {/* Hero Section */}
        <section className="relative px-6 pt-40 pb-32 text-center overflow-hidden bg-gradient-to-b from-[#121212] to-[#131313]">
          <div className="absolute top-0 left-0 w-full h-full bg-[#0FF1CE]/[0.02] background-noise"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full md:w-3/4 h-full rounded-full bg-[#0FF1CE]/[0.03] blur-[150px] opacity-60"></div>
          <Particles />
          <div className="relative z-10 space-y-16">
          
            <div className="space-y-6 md:space-y-6">
              <h1 className="text-[2.5rem] md:text-6xl font-extrabold text-[#0FF1CE] mb-0">
                Funded or Fried
              </h1>
              <h3 className="text-[0.9375rem] md:text-3xl font-extrabold bg-gradient-to-b from-[#0FF1CE] to-[#0FF1CE]/50 text-transparent bg-clip-text mb-12 -mt-4 md:mt-0">
                Prop trading without the training wheels
              </h3>
            </div>

            <div className="space-y-12">
              <p className="text-base md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                High-octane funding for elite traders.<br className="md:hidden" /> Push your trading into Overdrive with:
              </p>

              <div className="grid grid-cols-3 gap-2 md:flex md:flex-row md:justify-center md:items-center md:gap-8 px-2 md:px-0">
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

              <div className="flex flex-col md:flex-row justify-center gap-4 md:gap-6 max-w-sm md:max-w-[600px] mx-auto w-full pt-8">
                <Link href="/auth">
                  <button className="px-10 py-3 md:py-4 bg-[#0FF1CE] text-black text-sm md:text-lg font-bold rounded-lg hover:scale-105 transition-transform w-full md:w-1/2">
                    START CHALLENGE
                  </button>
                </Link>
                <Link href="/auth">
                  <button className="px-10 py-3 md:py-4 bg-transparent text-white text-sm md:text-lg font-bold rounded-lg hover:scale-105 transition-transform border-2 border-white w-full md:w-1/2 hidden">
                    FREE TRIAL
                  </button>
                </Link>
              </div>

              {/* Tradable Assets */}
              <div className="flex flex-wrap justify-center gap-6 md:gap-12 max-w-4xl mx-auto pt-12">
                {[
                  {
                    name: "Forex",
                    icon: (
                      <svg className="w-4 h-4 md:w-5 md:h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M2 12C2 6.48 6.48 2 12 2s10 4.48 10 10-4.48 10-10 10S2 17.52 2 12zm16.5-4.5h-2.79l-2.33 7h-2.76l-2.33-7H5.5v-2h13v2z"/>
                      </svg>
                    )
                  },
                  {
                    name: "Metals",
                    icon: (
                      <svg className="w-4 h-4 md:w-5 md:h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2L4 8v3h16V8l-8-6zM4 19v-6h16v6H4z"/>
                      </svg>
                    )
                  },
                  {
                    name: "Indices",
                    icon: (
                      <svg className="w-4 h-4 md:w-5 md:h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M3.5 18.5l6-6 4 4L22 7.5L20.5 6l-7 7-4-4-6 6z"/>
                      </svg>
                    )
                  },
                  {
                    name: "Crypto",
                    icon: (
                      <svg className="w-4 h-4 md:w-5 md:h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z"/>
                      </svg>
                    )
                  },
                  {
                    name: "Stocks",
                    icon: (
                      <svg className="w-4 h-4 md:w-5 md:h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M3 3h6v4H3V3zm12 0h6v4h-6V3zM3 11h6v4H3v-4zm12 0h6v4h-6v-4zM3 19h6v4H3v-4zm12 0h6v4h-6v-4z"/>
                      </svg>
                    )
                  }
                ].map(({ name, icon }) => (
                  <div key={name} className="flex flex-col items-center gap-2 group">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#0FF1CE]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <span className="text-[#0FF1CE] group-hover:text-white transition-colors">
                        {icon}
                      </span>
                    </div>
                    <span className="text-[0.6rem] md:text-xs text-gray-400 group-hover:text-[#0FF1CE] transition-colors">
                      {name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-full h-[250px] bg-[#0FF1CE]/[0.01] blur-[100px] rounded-full"></div>
            
          </div>
        </section>
  
  
        {/* How It Works Section */}
        <section className="py-20 px-6 bg-gradient-to-b from-[#131313] to-[#111111] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-[#131313] to-transparent"></div>
          <div className="absolute top-1/3 right-0 w-1/2 h-[300px] bg-[#0FF1CE]/[0.015] blur-[120px] rounded-full"></div>
          <div className="absolute bottom-1/3 left-0 w-1/2 h-[300px] bg-[#0FF1CE]/[0.01] blur-[120px] rounded-full"></div>
          <div className="relative z-10">
            <h2 className="text-4xl font-bold text-center text-[#0FF1CE] mb-16">How It Works</h2>
            
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: "1",
                  title: "Create An Account",
                  description: "Select the evaluation you feel the most comfortable with, and start trading immediately.",
                  delay: "0s"
                },
                {
                  icon: "2",
                  title: "Pass Challenge",
                  description: "Showcase your trading performance by successfully passing your evaluation with consistency and effective risk management.",
                  delay: "0.1s"
                },
                {
                  icon: "3",
                  title: "Get Funded",
                  description: "Sign your trader agreement and complete the KYC process to become a Shockwave Funded trader and start trading towards your first of many performance fees!",
                  delay: "0.2s"
                },
              ].map(({ icon, title, description, delay }) => (
                <div
                  key={title}
                  className="group relative bg-gradient-to-br from-[#0FF1CE]/10 to-[#0FF1CE]/5 backdrop-blur-sm rounded-2xl p-6 md:p-5 hover:scale-105 transition-all duration-300 animate-float md:transform md:scale-80"
                  style={{
                    animation: `float 3s ease-in-out infinite`,
                    animationDelay: delay,
                    boxShadow: '0 0 20px rgba(15, 241, 206, 0.1)'
                  }}
                >
                  {/* Content */}
                  <div className="relative z-10">
                    <div className="text-[#0FF1CE] text-4xl font-bold mb-4">{icon}</div>
                    <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
                  </div>

                  {/* Hover gradient overlay */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#0FF1CE]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              ))}
            </div>
          </div>
        </section>
  
        {/* Challenge Details Table Section */}
        <section className="relative py-20 px-6 bg-gradient-to-b from-[#111111] to-[#131313] overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-[#111111] to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-[#131313] to-transparent"></div>
          <div className="absolute top-1/2 left-1/4 w-1/2 h-[400px] bg-[#0FF1CE]/[0.02] blur-[150px] rounded-full"></div>
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-[#0FF1CE] mb-8 md:mb-12">Challenge Details</h2>
            
            {/* Challenge Type Selection */}
            <div className="max-w-6xl mx-auto mb-8 md:mb-12 px-4 md:px-0">
              <h3 className="text-[#0FF1CE] font-bold text-base md:text-lg mb-3 md:mb-4 text-center">Challenge Type:</h3>
              <div className="flex justify-center gap-2 md:gap-4">
                <button
                  onClick={() => {
                    setChallengeType('standard');
                    setSelectedBalance(100000);
                  }}
                  className={`relative px-4 md:px-8 py-3 md:py-4 rounded-xl ${
                    challengeType === 'standard'
                      ? 'bg-[#0FF1CE] text-black'
                      : 'bg-[#1F1F1F] text-white'
                  } transition-all hover:scale-105 text-sm md:text-lg font-bold shadow-md hover:shadow-lg`}
                >
                  Standard Challenge
                </button>
                <button
                  onClick={() => {
                    setChallengeType('instant');
                    setSelectedBalance(100000);
                  }}
                  className={`relative px-4 md:px-8 py-3 md:py-4 rounded-xl ${
                    challengeType === 'instant'
                      ? 'bg-[#0FF1CE] text-black'
                      : 'bg-[#1F1F1F] text-white'
                  } transition-all hover:scale-105 text-sm md:text-lg font-bold shadow-md hover:shadow-lg`}
                >
                  Shockwave Instant
                </button>
              </div>
            </div>

            {/* Balance Selection */}
            <div className="max-w-6xl mx-auto mb-8 md:mb-12">
              <h3 className="text-[#0FF1CE] font-bold text-base md:text-lg mb-3 md:mb-4 text-center">Balance:</h3>
              <div className="flex flex-wrap justify-start md:justify-center gap-3 md:gap-4 px-4 md:px-0">
                {(challengeType === 'standard' ? standardBalances : instantBalances).map(balance => (
                  <button
                    key={balance}
                    onClick={() => setSelectedBalance(balance)}
                    className={`relative w-[calc(50%-0.5rem)] md:w-auto px-3 md:px-6 py-2.5 md:py-3 rounded-xl ${
                      selectedBalance === balance 
                        ? 'bg-[#0FF1CE] text-black' 
                        : 'bg-[#1F1F1F] text-white hover:bg-[#2F2F2F]'
                    } transition-all hover:scale-[1.03] text-sm md:text-base font-medium flex flex-col items-center justify-center shadow-md`}
                  >
                    {balance === 100000 && (
                      <span className="absolute -top-2 md:-top-3 left-1/2 -translate-x-1/2 bg-[#0FF1CE] text-black text-[10px] md:text-xs px-2 md:px-3 py-0.5 md:py-1 rounded-full font-bold shadow-lg">
                        POPULAR
                      </span>
                    )}
                    <span className="font-bold text-sm md:text-base">${balance.toLocaleString()}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Table */}
            <div className={`${challengeType === 'standard' ? 'max-w-5xl' : 'max-w-3xl'} mx-auto overflow-x-auto px-4 md:px-8 py-2 md:py-4`}>
              <div className={`${challengeType === 'standard' ? 'min-w-[650px]' : 'min-w-[450px]'} md:min-w-0 rounded-2xl transform hover:scale-[1.01] transition-transform duration-300 overflow-hidden mx-auto`}>
                <div 
                  className={`grid ${challengeType === 'standard' ? 'grid-cols-4' : 'grid-cols-2'} text-xs md:text-sm bg-gradient-to-br from-[#0FF1CE]/10 to-transparent backdrop-blur-sm rounded-2xl border border-[#0FF1CE]/30`}
                  style={{
                    boxShadow: '0 0 30px rgba(15, 241, 206, 0.2)'
                  }}
                >
                  {/* Header */}
                  {challengeType === 'standard' ? (
                    <div className="col-span-4 grid grid-cols-4 bg-gradient-to-r from-[#0FF1CE] to-[#0FF1CE]/80 text-black font-bold">
                      <div className="p-3 md:p-4 border-r border-black/20"></div>
                      <div className="p-3 md:p-4 border-r border-black/20 text-center">CHALLENGE</div>
                      <div className="p-3 md:p-4 border-r border-black/20 text-center">VERIFICATION</div>
                      <div className="p-3 md:p-4 text-center">FUNDED</div>
                    </div>
                  ) : (
                    <div className="col-span-2 grid grid-cols-2 bg-gradient-to-r from-[#0FF1CE] to-[#0FF1CE]/80 text-black font-bold">
                      <div className="p-3 md:p-4 border-r border-black/20"></div>
                      <div className="p-3 md:p-4 text-center">FUNDED</div>
                    </div>
                  )}

                  {/* Rows */}
                  {(challengeType === 'standard' ? [
                    ['Trading Period', 'Unlimited', 'Unlimited', 'Unlimited'],
                    ['Minimum Profitable Days', '4 Days', '4 Days', 'X'],
                    ['Maximum Daily Loss', 
                      <div key="daily1" className="flex flex-col items-center">
                        <span className="text-[#0FF1CE] font-bold text-base md:text-lg">8%</span>
                        <span className="text-white text-[10px] md:text-xs mt-1 bg-[#0FF1CE]/20 px-2 py-0.5 rounded-full">${values.maxDailyLoss.toLocaleString()}</span>
                      </div>, 
                      <div key="daily2" className="flex flex-col items-center">
                        <span className="text-[#0FF1CE] font-bold text-base md:text-lg">8%</span>
                        <span className="text-white text-[10px] md:text-xs mt-1 bg-[#0FF1CE]/20 px-2 py-0.5 rounded-full">${values.maxDailyLoss.toLocaleString()}</span>
                      </div>, 
                      <div key="daily3" className="flex flex-col items-center">
                        <span className="text-[#0FF1CE] font-bold text-base md:text-lg">8%</span>
                        <span className="text-white text-[10px] md:text-xs mt-1 bg-[#0FF1CE]/20 px-2 py-0.5 rounded-full">${values.maxDailyLoss.toLocaleString()}</span>
                      </div>
                    ],
                    ['Maximum Loss', 
                      <div key="max1" className="flex flex-col items-center">
                        <span className="text-[#0FF1CE] font-bold text-base md:text-lg">15%</span>
                        <span className="text-white text-[10px] md:text-xs mt-1 bg-[#0FF1CE]/20 px-2 py-0.5 rounded-full">${values.maxLoss.toLocaleString()}</span>
                      </div>, 
                      <div key="max2" className="flex flex-col items-center">
                        <span className="text-[#0FF1CE] font-bold text-base md:text-lg">15%</span>
                        <span className="text-white text-[10px] md:text-xs mt-1 bg-[#0FF1CE]/20 px-2 py-0.5 rounded-full">${values.maxLoss.toLocaleString()}</span>
                      </div>, 
                      <div key="max3" className="flex flex-col items-center">
                        <span className="text-[#0FF1CE] font-bold text-base md:text-lg">15%</span>
                        <span className="text-white text-[10px] md:text-xs mt-1 bg-[#0FF1CE]/20 px-2 py-0.5 rounded-full">${values.maxLoss.toLocaleString()}</span>
                      </div>
                    ],
                    ['Profit Target', `$${values.profitTargetStep1.toLocaleString()} (10%)`, `$${values.profitTargetStep2.toLocaleString()} (5%)`, 'X'],
                    ['Leverage', 
                      <div key="lev1" className="flex items-center justify-center">
                        <span className="text-[#0FF1CE] font-bold text-base md:text-lg animate-pulse">1:200</span>
                      </div>,
                      <div key="lev2" className="flex items-center justify-center">
                        <span className="text-[#0FF1CE] font-bold text-base md:text-lg animate-pulse">1:200</span>
                      </div>,
                      <div key="lev3" className="flex items-center justify-center">
                        <span className="text-[#0FF1CE] font-bold text-base md:text-lg animate-pulse">1:200</span>
                      </div>
                    ],
                    ['News Trading', 'Yes', 'Yes', 'Yes'],
                    ['Profit Split', '-', '-', 'Up to 95%'],
                    ['First Withdrawal', '-', '-', '14 Days'],
                    ['Refundable Fee', `$${getOneTimePrice(selectedBalance, 'standard')}`, 'Free', 'Refund']
                  ].map((row, i) => (
                    <div 
                      key={i} 
                      className={`col-span-4 grid grid-cols-4 border-b border-[#2F2F2F] last:border-b-0 transition-colors duration-300 hover:bg-[#0FF1CE]/5 ${i % 2 === 0 ? 'bg-[#1A1A1A]/30' : ''}`}
                    >
                      <div className="p-3 md:p-4 border-r border-[#2F2F2F] font-medium flex items-center text-xs md:text-sm">{row[0]}</div>
                      <div className="p-3 md:p-4 border-r border-[#2F2F2F] text-center flex items-center justify-center">{row[1]}</div>
                      <div className="p-3 md:p-4 border-r border-[#2F2F2F] text-center flex items-center justify-center">{row[2]}</div>
                      <div className="p-3 md:p-4 text-center flex items-center justify-center">{row[3]}</div>
                    </div>
                  )) : [
                    ['Trading Period', '30 Days'],
                    ['Minimum Trading Days', '5 Days'],
                    ['Maximum Daily Loss', 
                      <div key="dailyi" className="flex flex-col items-center">
                        <span className="text-[#0FF1CE] font-bold text-base md:text-lg">4%</span>
                        <span className="text-white text-[10px] md:text-xs mt-1 bg-[#0FF1CE]/20 px-2 py-0.5 rounded-full">${values.maxDailyLoss.toLocaleString()}</span>
                      </div>
                    ],
                    ['Maximum Loss', 
                      <div key="maxi" className="flex flex-col items-center">
                        <span className="text-[#0FF1CE] font-bold text-base md:text-lg">12%</span>
                        <span className="text-white text-[10px] md:text-xs mt-1 bg-[#0FF1CE]/20 px-2 py-0.5 rounded-full">${values.maxLoss.toLocaleString()}</span>
                      </div>
                    ],
                    ['Profit Target', `$${values.profitTargetStep1.toLocaleString()} (12%)`],
                    ['Leverage', 
                      <div key="levi" className="flex items-center justify-center">
                        <span className="text-[#0FF1CE] font-bold text-base md:text-lg animate-pulse">1:200</span>
                      </div>
                    ],
                    ['News Trading', 'Yes'],
                    ['First Withdrawal', '6 Days'],
                    ['Profit Split', '70%'],
                    ['One Free Retry', 'Yes'],
                    ['One-Time Price', `$${getOneTimePrice(selectedBalance, 'instant')}`]
                  ].map((row, i) => (
                    <div 
                      key={i} 
                      className={`col-span-2 grid grid-cols-2 border-b border-[#2F2F2F] last:border-b-0 transition-colors duration-300 hover:bg-[#0FF1CE]/5 ${i % 2 === 0 ? 'bg-[#1A1A1A]/30' : ''}`}
                    >
                      <div className="p-3 md:p-4 border-r border-[#2F2F2F] font-medium flex items-center text-xs md:text-sm">{row[0]}</div>
                      <div className="p-3 md:p-4 text-center flex items-center justify-center">{row[1]}</div>
                    </div>
                  )))}
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="max-w-4xl mx-auto mt-8 md:mt-12 text-center px-4 md:px-0">
              <Link href="/auth">
                <button className="px-8 md:px-12 py-3 md:py-4 bg-[#0FF1CE] text-black text-lg md:text-xl font-bold rounded-full hover:scale-105 transition-transform shadow-lg hover:shadow-[#0FF1CE]/20">
                  START CHALLENGE
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* Scaling Plan Section */}
        <section className="py-12 md:py-20 px-4 md:px-6 bg-gradient-to-b from-[#131313] to-[#121212] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-[#131313] to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-[#121212] to-transparent"></div>
          <div className="absolute top-1/2 right-1/4 w-1/2 h-[350px] bg-[#0FF1CE]/[0.02] blur-[130px] rounded-full"></div>
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-[#0FF1CE] mb-3 md:mb-6">Scaling plan</h2>
            <p className="text-gray-300 text-center text-sm md:text-base max-w-3xl mx-auto mb-8 md:mb-12">
              At Shockwave Capital we believe that a traders' development is an ongoing journey, which is why we give our earning account traders the ability to further scale their trading over time.
            </p>

            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
              {/* Overview Card */}
              <div className="bg-gradient-to-br from-[#0FF1CE]/10 to-[#0FF1CE]/5 backdrop-blur-sm rounded-xl md:rounded-2xl p-5 md:p-8 hover:scale-[1.01] transition-all duration-300"
                style={{ boxShadow: '0 0 15px rgba(15, 241, 206, 0.1)' }}>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-8">Scaling plan <span className="text-[#0FF1CE]">overview</span></h3>
                <ul className="space-y-3 md:space-y-6 text-sm md:text-base">
                  {[
                    "Upgraded Profit Split of up to 95%",
                    "Balance Scale up of 50% every 3 months",
                    "Ongoing increases every 3 months if objectives are met",
                    "Trading Objectives remain the same as your original plan on increased balance",
                    "Maximum Allocation per trader of $5 million"
                  ].map((item, index) => (
                    <li key={index} className="flex items-start space-x-3 md:space-x-4 group">
                      <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-[#0FF1CE]/10 flex items-center justify-center mt-0.5 md:mt-1 group-hover:scale-110 transition-transform shrink-0">
                        <span className="text-[#0FF1CE] text-sm md:text-lg">✓</span>
                      </div>
                      <span className="text-gray-300 group-hover:text-white transition-colors">{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 md:mt-8">
                  <Link href="/auth">
                    <button className="w-full md:w-auto px-4 py-2 md:px-8 md:py-4 bg-[#0FF1CE] text-black text-sm md:text-lg font-bold rounded-lg hover:scale-105 transition-transform">
                      Get Funded
                  </button>
                  </Link>
                </div>
              </div>

              {/* Table Card */}
              <div className="bg-gradient-to-br from-[#0FF1CE]/10 to-[#0FF1CE]/5 backdrop-blur-sm rounded-xl md:rounded-2xl p-5 md:p-8 overflow-hidden hover:scale-[1.01] transition-all duration-300"
                style={{ boxShadow: '0 0 15px rgba(15, 241, 206, 0.1)' }}>
                <div className="overflow-x-auto -mx-5 px-5 md:mx-0 md:px-0">
                  <table className="w-full text-sm md:text-base">
                    <thead>
                      <tr className="border-b border-[#0FF1CE]/20">
                        <th className="py-3 md:py-4 px-3 md:px-6 text-left text-[#0FF1CE] font-bold">Elapsed Time</th>
                        <th className="py-3 md:py-4 px-3 md:px-6 text-right text-[#0FF1CE] font-bold">Initial Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { time: "0 months", balance: "$500,000" },
                        { time: "3 months", balance: "$750,000" },
                        { time: "6 months", balance: "$1,000,000" },
                        { time: "9 months", balance: "$1,250,000" },
                        { time: "12 months", balance: "$1,500,000" },
                        { time: "15 months", balance: "$1,750,000" },
                        { time: "18 months", balance: "$2,000,000" },
                        { time: "21 months", balance: "$2,250,000" },
                        { time: "24 months", balance: "$2,500,000" }
                      ].map((row, index) => (
                        <tr 
                          key={index}
                          className="border-b border-[#2F2F2F] last:border-b-0 hover:bg-[#0FF1CE]/5 transition-colors group"
                        >
                          <td className="py-2 md:py-4 px-3 md:px-6 text-left text-gray-300 group-hover:text-white transition-colors">
                            {row.time}
                          </td>
                          <td className="py-2 md:py-4 px-3 md:px-6 text-right font-bold text-[#0FF1CE]">
                            {row.balance}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 md:mt-6 text-xs md:text-sm text-gray-400">
                  Simulated capital increments on the Shockwave Funded Account can occur every 3 months. To qualify for a capital increase, the trader must generate at least 10% net profit over 3 consecutive months.
                </div>
              </div>
            </div>
          </div>
        </section>
  
        {/* Comparison Section */}
        <section className="py-12 md:py-20 px-4 md:px-6 bg-gradient-to-b from-[#121212] to-[#131313] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-[#121212] to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-[#131313] to-transparent"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-[400px] bg-[#0FF1CE]/[0.015] blur-[130px] rounded-full"></div>
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-[#0FF1CE] mb-3 md:mb-6">How we compare?</h2>
            <p className="text-gray-300 text-center text-sm md:text-base max-w-3xl mx-auto mb-8 md:mb-16">
              Discover how Shockwave Capital stands out in the industry and compares to other leading prop firms.
            </p>

            {/* Comparison Section Table */}
            <div className="max-w-7xl mx-auto overflow-x-auto pb-4 px-4 md:px-8 py-2 md:py-4">
              <div className="min-w-[768px] grid grid-cols-4 gap-px bg-[#2F2F2F] rounded-2xl overflow-hidden border border-[#0FF1CE]/20 transform hover:scale-[1.01] transition-transform duration-300 mx-auto"
                style={{ boxShadow: '0 0 30px rgba(15, 241, 206, 0.15)' }}>
                {/* Header Row */}
                <div className="bg-[#121212] p-4 md:p-8 flex items-center justify-center"></div>
                <div className="bg-[#121212] p-4 md:p-8 flex flex-col items-center justify-center">
                  <div className="bg-gradient-to-br from-[#0FF1CE]/20 to-[#0FF1CE]/5 p-3 md:p-4 rounded-xl md:rounded-2xl mb-2 md:mb-4 w-20 h-20 md:w-40 md:h-40 flex items-center justify-center">
                    <Image src="/logo.png" alt="Shockwave Capital" width={120} height={120} className="w-16 h-16 md:w-32 md:h-32" />
                  </div>
                  <span className="text-[#0FF1CE] font-bold text-base md:text-xl">Shockwave</span>
                </div>
                <div className="bg-[#121212] p-4 md:p-8 flex flex-col items-center justify-center">
                  <div className="bg-[#1F1F1F] p-3 md:p-4 rounded-xl md:rounded-2xl mb-2 md:mb-4 w-20 h-20 md:w-40 md:h-40 flex items-center justify-center">
                    <span className="text-lg md:text-2xl font-bold text-white">FTMO</span>
                  </div>
                  <span className="text-white font-bold text-base md:text-xl">FTMO</span>
                </div>
                <div className="bg-[#121212] p-4 md:p-8 flex flex-col items-center justify-center">
                  <div className="bg-[#1F1F1F] p-3 md:p-4 rounded-xl md:rounded-2xl mb-2 md:mb-4 w-20 h-20 md:w-40 md:h-40 flex items-center justify-center">
                    <span className="text-xs md:text-2xl font-bold text-white">FundedNext</span>
                  </div>
                  <span className="text-white font-bold text-base md:text-xl">FundedNext</span>
                </div>

                {/* Comparison Rows */}
                {[
                  {
                    feature: "Max Drawdown",
                    shockwave: "15%",
                    ftmo: "10%",
                    fundedNext: "10%"
                  },
                  {
                    feature: "Max Daily Drawdown",
                    shockwave: "8%",
                    ftmo: "5%",
                    fundedNext: "5%"
                  },

                  {
                    feature: "Leverage",
                    shockwave: "1:200",
                    ftmo: "1:30",
                    fundedNext: "1:100"
                  },

                  {
                    feature: "First Withdrawal",
                    shockwave: "14 Days",
                    ftmo: "14 Days",
                    fundedNext: "21 Days"
                  },
        
                  {
                    feature: "Instant Funding",
                    shockwave: true,
                    ftmo: false,
                    fundedNext: false
                  },
                  {
                    feature: "Max Allocation",
                    shockwave: "$500k",
                    ftmo: "$400k",
                    fundedNext: "$300k"
                  },
                  {
                    feature: "Minimum Trading Days",
                    shockwave: "4",
                    ftmo: "5",
                    fundedNext: "5"
                  },
                  {
                    feature: "Weekend Holding",
                    shockwave: true,
                    ftmo: false,
                    fundedNext: true
                  }
                ].map((row, index) => (
                  <React.Fragment key={index}>
                    <div className="bg-[#121212] p-3 md:p-6 flex items-center font-medium text-white border-t border-[#2F2F2F] text-xs md:text-base">
                      {row.feature}
                    </div>
                    {[row.shockwave, row.ftmo, row.fundedNext].map((value, i) => (
                      <div key={i} className="bg-[#121212] p-3 md:p-6 flex items-center justify-center border-t border-[#2F2F2F] group hover:bg-[#0FF1CE]/5 transition-colors">
                        {typeof value === 'boolean' ? (
                          value ? (
                            <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-[#0FF1CE]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                              <span className="text-[#0FF1CE] text-lg md:text-2xl">✓</span>
                            </div>
                          ) : (
                            <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-red-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                              <span className="text-red-500 text-lg md:text-2xl">×</span>
                            </div>
                          )
                        ) : (
                          <span className={`font-bold text-xs md:text-base ${i === 0 ? 'text-[#0FF1CE]' : 'text-white'}`}>{value}</span>
                        )}
                      </div>
                    ))}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* CTA Button */}
            <div className="max-w-4xl mx-auto mt-8 md:mt-16 text-center">
              <Link href="/auth">
                <button className="px-6 py-3 md:px-8 md:py-4 bg-[#0FF1CE] text-black text-base md:text-xl font-bold rounded-lg hover:scale-105 transition-transform shadow-lg hover:shadow-[#0FF1CE]/20">
                  Choose the Best. Choose Shockwave
                </button>
              </Link>
            </div>
          </div>
        </section>
  
        {/* Global Network Section */}
        <section className="py-20 px-6 bg-gradient-to-b from-[#131313] to-[#121212] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-[#131313] to-transparent"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-[#0FF1CE]/[0.025] blur-[100px] rounded-full"></div>
          <div className="relative z-10">
            <h2 className="text-3xl font-bold text-center text-[#0FF1CE] mb-6">Global Trading Network</h2>
            <p className="text-base md:text-xl text-gray-300 text-center max-w-2xl mx-auto mb-16">
              Powering high-octane traders worldwide. Join our network of elite traders pushing the boundaries of what's possible.
            </p>

            <div className="max-w-5xl mx-auto relative">
              {/* Logo positioned above SVG */}
              <div className="absolute left-1/2 -translate-x-1/2 -top-10 z-10">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-[#121212] border-2 border-[#0FF1CE] animate-pulse"></div>
                  <Image
                    src="/logo.png"
                    alt="Shockwave Capital" 
                    width={80}
                    height={80}
                    className="relative z-10 w-[40px] h-[40px] md:w-[80px] md:h-[80px]"
                  />
                </div>
              </div>

              <svg viewBox="-1 -1 802 402" className="w-full h-auto">
                <defs>
                  <linearGradient id="globe-gradient" x1="0" y1="0" x2="0" y2="400" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#0FF1CE" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#0FF1CE" stopOpacity="0.1" />
                  </linearGradient>
                  <radialGradient id="node-gradient" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#0FF1CE" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#0FF1CE" stopOpacity="0" />
                  </radialGradient>
                </defs>

                {/* Background Circle */}
                <circle cx="400" cy="400" r="400" fill="#181818" />

                {/* Grid Lines */}
                <g stroke="url(#globe-gradient)" strokeWidth="1">
                  {/* Vertical Lines */}
                  <path d="M 400 800 A -400 400 0 0 0 400 0" fill="none" />
                  <path d="M 400 800 A -328.701 400 0 0 0 400 0" fill="none" />
                  <path d="M 400 800 A -235.355 400 0 0 0 400 0" fill="none" />
                  <path d="M 400 800 A -123.097 400 0 0 0 400 0" fill="none" />
                  <path d="M 400 800 A 0 400 0 0 0 400 0" fill="none" />
                  <path d="M 400 0 A 123.097 400 0 0 0 400 800" fill="none" />
                  <path d="M 400 0 A 235.355 400 0 0 0 400 800" fill="none" />
                  <path d="M 400 0 A 328.701 400 0 0 0 400 800" fill="none" />
                  <path d="M 400 0 A 400 400 0 0 0 400 800" fill="none" />

                  {/* Horizontal Lines */}
                  <path d="M160,80 h480" fill="none" />
                  <path d="M80,160 h640" fill="none" />
                  <path d="M33.394,240 h733.212" fill="none" />
                  <path d="M8.082,320 h783.837" fill="none" />
                  <path d="M0,400 h800" fill="none" />
                </g>

                {/* Trading Nodes */}
                {[
                  { cx: 701.26, cy: 240, delay: "0s", path: "M 400 0 A 328.701 400 0 0 1 701.26 240" },
                  { cx: 77.94, cy: 320, delay: "1s", path: "M 400 0 A -328.701 400 0 0 0 77.94 320" },
                  { cx: 498.48, cy: 160, delay: "2s", path: "M 400 0 A 123.097 400 0 0 1 498.48 160" },
                  { cx: 258.79, cy: 80, delay: "1.5s", path: "M 400 0 A -235.355 400 0 0 0 258.79 80" }
                ].map(({ cx, cy, delay, path }, i) => (
                  <g key={i}>
                    {/* Pulse Effect */}
                    <circle
                      cx={cx}
                      cy={cy}
                      r="0"
                      stroke="#0FF1CE"
                      strokeWidth="2"
                      fill="none"
                    >
                      <animate
                        attributeName="r"
                        values="0;12;18;24;0"
                        dur="4s"
                        begin={delay}
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="opacity"
                        values="0;1;0.5;0;0"
                        dur="4s"
                        begin={delay}
                        repeatCount="indefinite"
                      />
                    </circle>

                    {/* Node */}
                    <circle
                      cx={cx}
                      cy={cy}
                      r="6"
                      fill="#0FF1CE"
                      className="animate-pulse"
                      stroke="none"
                    />

                    {/* Connection Line */}
                    {path && (
                      <g>
                        <path
                          d={path}
                          stroke="#0FF1CE"
                          strokeWidth="2"
                          fill="none"
                          opacity="0.3"
                        >
                          <animate
                            attributeName="stroke-dasharray"
                            values="0,1000;1000,0"
                            dur={`${3 + i}s`}
                            repeatCount="indefinite"
                          />
                        </path>
                        <circle r="4" fill="#0FF1CE">
                          <animateMotion
                            dur={`${3 + i}s`}
                            repeatCount="indefinite"
                            path={path}
                          />
                        </circle>
                      </g>
                    )}
                  </g>
                ))}
              </svg>
            </div>

            {/* Stats Cards - Positioned to overlap SVG */}
            <div className="relative -mt-5 md:-mt-15 px-6">
              <div className="grid grid-cols-3 gap-4 max-w-4xl mx-auto">
                <div className="bg-gradient-to-br from-[#0FF1CE]/10 to-[#0FF1CE]/5 backdrop-blur-sm rounded-2xl p-4 md:p-6">
                  <h3 className="text-[#0FF1CE] text-lg md:text-4xl font-bold mb-2">24/7</h3>
                  <p className="text-gray-400 text-[0.625rem] md:text-base">Global Market Access</p>
                </div>
                <div className="bg-gradient-to-br from-[#0FF1CE]/10 to-[#0FF1CE]/5 backdrop-blur-sm rounded-2xl p-4 md:p-6">
                  <h3 className="text-[#0FF1CE] text-lg md:text-4xl font-bold mb-2">100+</h3>
                  <p className="text-gray-400 text-[0.625rem] md:text-base">Countries Supported</p>
                </div>
                <div className="bg-gradient-to-br from-[#0FF1CE]/10 to-[#0FF1CE]/5 backdrop-blur-sm rounded-2xl p-4 md:p-6">
                  <h3 className="text-[#0FF1CE] text-lg md:text-4xl font-bold mb-2">$2M+</h3>
                  <p className="text-gray-400 text-[0.625rem] md:text-base">Trading Capital Available</p>
                </div>
              </div>
            </div>
          </div>
          
           <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-[#121212] to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-[#111111] to-transparent"></div>
          <div className="absolute top-1/3 right-1/4 w-1/2 h-[300px] bg-[#0FF1CE]/[0.02] blur-[120px] rounded-full"></div>
          <div className="absolute bottom-1/3 left-1/4 w-1/2 h-[300px] bg-[#0FF1CE]/[0.015] blur-[120px] rounded-full"></div>
          <div className="relative z-10">
            <h2 className="text-4xl font-bold text-center text-[#0FF1CE] mb-12 mt-32 md:mt-40">FAQ</h2>
            
            {/* Mobile Scroll Indicators */}
            <div className="relative">
              {/* Right scroll indicator - only visible on mobile */}
              <div className="md:hidden absolute -right-2 top-1/2 -translate-y-1/2 z-20 animate-bounce-x">
                <div className="flex items-center">
                  <span className="text-[#0FF1CE] text-4xl">&rsaquo;</span>
                </div>
              </div>
              
              {/* Gradient overlays */}
              <div className="md:hidden absolute -left-4 top-0 bottom-0 w-8 bg-gradient-to-r from-[#121212] to-transparent z-10"></div>
              <div className="md:hidden absolute -right-4 top-0 bottom-0 w-8 bg-gradient-to-l from-[#121212] to-transparent z-10"></div>
              
              <div className="max-w-7xl mx-auto overflow-x-auto hide-scrollbar">
                <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 md:px-0">
                  {[
                    {
                      question: "What makes Shockwave Capital different from other prop firms?",
                      questionShort: "We're not just another challenge shop.",
                      answer: "We're the nitrous boost of the prop world — offering 1:200 leverage, massive 15%,8% drawdowns, instant access funding, and zero fluff. While others hold you back with baby rules and slow payouts, we throw you straight into the deep end — where real traders thrive."
                    },
                    {
                      question: "How fast can I start trading live capital?",
                      questionShort: "Instantly.",
                      answer: "With our Instant Funding model, there's no waiting, no phases, no warm-ups. You hit the ground running — with real buying power, real leverage, and real upside. You're live the moment your payment clears. No delays. No games. With our standard challenge you can get funded within 8 trading days."
                    },
                    {
                      question: "What's the profit split and how do payouts work?",
                      questionShort: "Standard - 90%, Instant - 70%",
                      answer: "Our payouts are lightning fast, and we offer industry-leading terms with a one free retry if you stumble on our instant funding account. We reward precision, not perfection."
                    },
                    {
                      question: "What are the rules? Are they trader-friendly?",
                      questionShort: "Let's put it this way:\nWe're aggressive — but fair.",
                      answer: "Standard:\nMax Daily Drawdown: 8%\nMax Total Drawdown: 15%\nLeverage: 1:200\nMinimum Profitable Days: 4\nTarget: 12%/6%\n\nInstant:\nMax Daily Drawdown: 4%\nMax Total Drawdown: 8%\nLeverage: 1:200\nMinimum Profitable Days: 5\nTarget: 12%\n\nWe give you the tools to blow up the charts — not your account."
                    },
                    {
                      question: "Can I swing trade, scalp, hold over news, or use EAs?",
                      questionShort: "Hell yes.",
                      answer: "We're not here to clip your wings — we're here to hand you the throttle. Use your strategy, your way.\nScalp, swing, algorithmic? As long as you play within the risk rules, the market is yours."
                    },
                    {
                      question: "What happens if I fail? Do I lose everything?",
                      questionShort: "Not with Shockwave.",
                      answer: "Every challenger on our Instant Funding account gets one free retry — because we know great traders sometimes have off days. We don't punish that. We back those who fight back. On our Standard Challenge if you fail you can reset for 199$ and try again!"
                    }
                  ].map(({ question, questionShort, answer }, index) => (
                    <div
                      key={question}
                      className="group relative bg-gradient-to-br from-[#0FF1CE]/10 to-[#0FF1CE]/5 backdrop-blur-sm rounded-2xl p-6 hover:scale-105 transition-all duration-300 min-w-[300px] md:min-w-0 animate-fadeIn"
                      style={{
                        boxShadow: '0 0 20px rgba(15, 241, 206, 0.1)',
                        animationDelay: `${index * 0.1}s`
                      }}
                    >
                      {/* Chat Container */}
                      <div className="space-y-4">
                        {/* Trader Question */}
                        <div className="flex flex-col space-y-2">
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                              <span className="text-sm text-white">T</span>
                            </div>
                            <span className="text-gray-400 text-sm">Trader</span>
                          </div>
                          <div className="bg-gray-800 rounded-2xl rounded-tl-none p-4 text-white text-sm">
                            {question}
                          </div>
                        </div>

                        {/* Shockwave Response */}
                        <div className="flex flex-col space-y-2">
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="w-8 h-8 rounded-full bg-[#0FF1CE] flex items-center justify-center">
                              <span className="text-sm text-black font-bold">S</span>
                            </div>
                            <span className="text-[#0FF1CE] text-sm">Shockwave</span>
                          </div>
                          <div className="bg-[#0FF1CE]/10 backdrop-blur-sm rounded-2xl rounded-tl-none p-4">
                            <p className="text-[#0FF1CE] font-bold mb-2">{questionShort}</p>
                            <p className="text-gray-300 text-sm whitespace-pre-line">{answer}</p>
                          </div>
                        </div>
                      </div>

                      {/* Hover gradient overlay */}
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#0FF1CE]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* CTA Button */}
          <div className="max-w-4xl mx-auto mt-16 text-center">
            <Link href="/auth">
              <button className="px-8 md:px-12 py-3 md:py-4 bg-[#0FF1CE] text-black text-sm md:text-xl font-bold rounded-lg hover:scale-105 transition-transform shadow-lg hover:shadow-[#0FF1CE]/20">
                Stop coasting and go full throttle
              </button>
            </Link>
          </div>
        </section>
  
        
       
  
        {/* Community & Newsletter Section */}
        <section className="py-20 px-6 bg-gradient-to-b from-[#111111] to-[#131313] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-[#111111] to-transparent"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[500px] bg-[#0FF1CE]/[0.025] blur-[150px] rounded-full"></div>
          <div className="relative z-10">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Discord Community */}
              <div className="relative bg-gradient-to-br from-[#0FF1CE]/10 to-[#0FF1CE]/5 backdrop-blur-sm rounded-2xl p-8 hover:scale-105 transition-all duration-300"
                style={{
                  boxShadow: '0 0 20px rgba(15, 241, 206, 0.1)'
                }}>
                <div className="flex flex-col h-full justify-between">
                  <div>
                    <h2 className="text-3xl md:text-4xl font-bold text-[#0FF1CE] mb-4">LEARN FROM OUR DISCORD COMMUNITY</h2>
                    <a href="#" className="inline-block mt-6 text-[#0FF1CE] hover:text-[#0FF1CE]/80 font-bold text-lg transition-colors">
                      JOIN OUR DISCORD →
                    </a>
                  </div>
                  <div className="mt-8">
                    <svg viewBox="0 0 127.14 96.36" className="w-32 h-32 ml-auto" fill="#0FF1CE" opacity="0.2">
                      <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z"/>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Email Signup */}
              <div className="relative bg-gradient-to-br from-[#0FF1CE]/10 to-[#0FF1CE]/5 backdrop-blur-sm rounded-2xl p-8 hover:scale-105 transition-all duration-300"
                style={{
                  boxShadow: '0 0 20px rgba(15, 241, 206, 0.1)'
                }}>
                <h2 className="text-3xl md:text-4xl font-bold text-[#0FF1CE] mb-6">Subscribe for Email Updates</h2>
                <form className="space-y-4">
                  <div>
                    <label htmlFor="fullName" className="block text-white mb-2">Full Name</label>
                    <input
                      type="text"
                      id="fullName"
                      placeholder="Type your name"
                      className="w-full px-4 py-3 bg-[#181818] border border-[#0FF1CE]/20 rounded-lg focus:outline-none focus:border-[#0FF1CE] text-white placeholder-gray-400"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-white mb-2">Email*</label>
                    <input
                      type="email"
                      id="email"
                      placeholder="Type your email"
                      className="w-full px-4 py-3 bg-[#181818] border border-[#0FF1CE]/20 rounded-lg focus:outline-none focus:border-[#0FF1CE] text-white placeholder-gray-400"
                    />
                  </div>
                  <button type="submit" className="w-full md:w-auto px-8 py-3 bg-[#0FF1CE] text-black font-bold rounded-lg hover:scale-105 transition-transform">
                    Submit
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
  
        {/* Footer Section */}
        <footer className="bg-gradient-to-b from-[#131313] to-[#121212] border-t border-[#2F2F2F]/50 pt-16 pb-8 relative">
          <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-[#131313] to-transparent"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[300px] bg-[#0FF1CE]/[0.01] blur-[120px] rounded-full"></div>
          <div className="max-w-7xl mx-auto px-6">
            {/* Footer Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
              {/* Brand Column */}
              <div className="space-y-6">
                <Image
                  src="/logo.png"
                  alt="Shockwave Capital"
                  width={120}
                  height={120}
                  className="h-auto w-auto"
                />
                <p className="text-gray-400 text-sm">
                  High-octane funding for elite traders. Push your trading into Overdrive with industry-leading leverage and conditions.
                </p>
                <div className="flex space-x-4">
                  {[
                    { icon: "twitter", href: "#" },
                    { icon: "discord", href: "#" },
                    { icon: "telegram", href: "#" },
                    { icon: "instagram", href: "#" }
                  ].map(({ icon, href }) => (
                    <a
                      key={icon}
                      href={href}
                      className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#0FF1CE]/10 to-[#0FF1CE]/5 backdrop-blur-sm flex items-center justify-center group hover:scale-110 transition-all duration-300"
                      style={{ boxShadow: '0 0 20px rgba(15, 241, 206, 0.1)' }}
                    >
                      <span className="text-[#0FF1CE] group-hover:text-white transition-colors">
                        {icon === 'twitter' && (
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                          </svg>
                        )}
                        {icon === 'discord' && (
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
                          </svg>
                        )}
                        {icon === 'telegram' && (
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19c-.14.75-.42 1-.68 1.03c-.58.05-1.02-.38-1.58-.75c-.88-.58-1.38-.94-2.23-1.5c-.99-.65-.35-1.01.22-1.59c.15-.15 2.71-2.48 2.76-2.69c.01-.03-.01-.06-.03-.05c-.11.03-1.79 1.14-2.71 1.71c-.16.1-.51.33-1.09.33c-.58 0-1.58-.31-2.25-.57c-.91-.36-1.77-.79-1.77-1.77c0-.37.19-.67.48-.67c.89 0 2.12 1.28 2.12 1.28s3.72-1.58 5.57-2.38c.33-.14.73-.44 1.19-.44c.21 0 .41.08.54.23c.22.22.23.54.2.84z"/>
                          </svg>
                        )}
                        {icon === 'instagram' && (
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12.315 2c2.43 0 2.784.013 3.808.06c1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153a4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427c.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043c-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772a4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465c-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06c-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153a4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427c-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808c.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058c-.975.045-1.504.207-1.857.344c-.467.182-.8.398-1.15.748c-.35.35-.566.683-.748 1.15c-.137.353-.3.882-.344 1.857c-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807c.045.975.207 1.504.344 1.857c.182.466.399.8.748 1.15c.35.35.683.566 1.15.748c.353.137.882.3 1.857.344c1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058c.976-.045 1.505-.207 1.858-.344c.466-.182.8-.398 1.15-.748c.35-.35.566-.683.748-1.15c.137-.353.3-.882.344-1.857c.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96c-.045-.976-.207-1.505-.344-1.858c-.182-.466-.398-.8-.748-1.15c-.35-.35-.683-.566-1.15-.748c-.353-.137-.882-.3-1.857-.344c-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"/>
                          </svg>
                        )}
                      </span>
                    </a>
                  ))}
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h3 className="text-[#0FF1CE] font-bold text-lg mb-6">Quick Links</h3>
                <ul className="space-y-4">
                  {['Home', 'Challenge', 'Pricing', 'FAQ', 'Client Area'].map(link => (
                    <li key={link}>
                      <a href="#" className="text-gray-400 hover:text-[#0FF1CE] transition-colors">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Resources */}
              <div>
                <h3 className="text-[#0FF1CE] font-bold text-lg mb-6">Resources</h3>
                <ul className="space-y-4">
                  {['Trading Rules', 'Terms of Service', 'Privacy Policy', 'Support Center', 'Contact Us'].map(link => (
                    <li key={link}>
                      <a href="#" className="text-gray-400 hover:text-[#0FF1CE] transition-colors">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Newsletter */}
              <div>
                <h3 className="text-[#0FF1CE] font-bold text-lg mb-6">Stay Updated</h3>
                <p className="text-gray-400 text-sm mb-4">Subscribe to our newsletter for the latest updates and exclusive offers.</p>
                <form className="space-y-3">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full px-4 py-2 bg-[#181818] border border-[#0FF1CE]/20 rounded-lg focus:outline-none focus:border-[#0FF1CE] text-white placeholder-gray-400"
                  />
                  <button type="submit" className="w-full px-4 py-2 bg-[#0FF1CE] text-black font-bold rounded-lg hover:scale-105 transition-transform">
                    Subscribe
                  </button>
                </form>
              </div>
            </div>

            {/* Disclaimer and Copyright */}
            <div className="border-t border-[#2F2F2F] pt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="text-xs text-gray-500">
                  <p className="mb-2">
                    Trading foreign exchange and futures carries a high level of risk and may not be suitable for all investors. The high degree of leverage can work against you as well as for you.
                  </p>
                  <p>
                    &copy; {new Date().getFullYear()} Shockwave Capital. All rights reserved.
                  </p>
                </div>
                <div className="flex flex-wrap gap-4 md:justify-end text-xs">
                  <a href="#" className="text-gray-400 hover:text-[#0FF1CE] transition-colors">Terms</a>
                  <a href="#" className="text-gray-400 hover:text-[#0FF1CE] transition-colors">Privacy</a>
                  <a href="#" className="text-gray-400 hover:text-[#0FF1CE] transition-colors">Cookies</a>
                </div>
              </div>
            </div>
          </div>
        </footer>

        {/* Features Section */}
        <style jsx global>{`
          @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
            100% { transform: translateY(0px); }
          }

          @keyframes fadeIn {
            from { opacity: 0; transform: translateX(20px); }
            to { opacity: 1; transform: translateX(0); }
          }
          
          @keyframes bounceX {
            0%, 100% { transform: translate(-50%, -50%); }
            50% { transform: translate(0%, -50%); }
          }
          
          .animate-bounce-x {
            animation: bounceX 1.5s ease-in-out infinite;
          }
          
          .animate-fadeIn {
            animation: fadeIn 0.5s ease-out forwards;
          }
          
          .background-noise {
            background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 250 250' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E");
            opacity: 0.15;
          }

          .hide-scrollbar {
            scrollbar-width: none;
            -ms-overflow-style: none;
          }
          
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }

          @media (max-width: 768px) {
            .hide-scrollbar {
              scroll-snap-type: x mandatory;
              scroll-behavior: smooth;
            }
            
            .hide-scrollbar > div > div {
              scroll-snap-align: center;
            }
          }
        `}</style>
      </div>
    );
  }
  