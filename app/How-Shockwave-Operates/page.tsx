'use client';
import React from 'react';
import Particles from '../components/Particles';
import Header from '../components/Header';
import Link from 'next/link';
import { ArrowRight, CheckCircle, AlertCircle, TrendingUp, Shield, Users, DollarSign, Target, Clock, Zap } from 'lucide-react';

export default function HowShockwaveOperatesPage() {
  return (
    <div className="bg-gradient-to-b from-[#0D0D0D] via-[#121212] to-[#151515] text-white min-h-screen font-sans">
      <Header />
      
      {/* Hero Section */}
      <section className="relative px-4 md:px-6 pt-24 md:pt-40 pb-16 md:pb-32 text-center overflow-hidden bg-gradient-to-b from-[#121212] to-[#131313]">
        <div className="absolute top-0 left-0 w-full h-full bg-[#0FF1CE]/[0.02] background-noise"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full md:w-3/4 h-full rounded-full bg-[#0FF1CE]/[0.03] blur-[150px] opacity-60"></div>
        <Particles />
        
        <div className="relative z-10 max-w-5xl mx-auto">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-[#0FF1CE] mb-4 md:mb-6">
            How Shockwave Operates
          </h1>
          <p className="text-base md:text-lg lg:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            No secrets. No fine print. Just real trading, real payouts, and a model you can trust.
          </p>
          <p className="text-sm md:text-base lg:text-lg text-gray-400 max-w-3xl mx-auto mt-2">
            No other platform can offer this level of transparency and trust.
          </p>
        </div>
      </section>

      {/* Content Sections */}
      <section className="relative py-12 md:py-20 px-4 md:px-6 lg:px-8 xl:px-12">
        <div className="absolute top-0 left-0 w-full h-full bg-[#0FF1CE]/[0.02] background-noise"></div>
        <div className="absolute top-1/2 right-0 w-1/2 h-[300px] bg-[#0FF1CE]/[0.015] blur-[120px] rounded-full"></div>
        <div className="absolute bottom-1/3 left-0 w-1/2 h-[300px] bg-[#0FF1CE]/[0.01] blur-[120px] rounded-full"></div>
        
        <div className="max-w-7xl mx-auto">
          {/* Section 1: Business Model */}
          <div className="relative bg-[#0D0D0D]/80 backdrop-blur-sm rounded-xl md:rounded-2xl p-6 md:p-8 lg:p-10 border border-[#2F2F2F]/50 mb-8 md:mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-[#0FF1CE]/20 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-[#0FF1CE]" />
              </div>
              <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-[#0FF1CE]">The Foundation: Our Business Model</h2>
            </div>
            
            <p className="text-sm md:text-base text-gray-300 leading-relaxed mb-8 md:mb-12">
              Challenge fees fund operations and our growing reserve pool (currently $800k+). Funded traders operate on simulated accounts and are copy traded to live capital accounts backed by us. Payouts come from the reserve if needed and live profits — rarely from new challenges.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="bg-[#1A1A1A]/50 rounded-xl p-5 md:p-6 border border-[#2F2F2F]/30 hover:border-[#0FF1CE]/20 transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-[#0FF1CE]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-[#0FF1CE] font-bold text-sm">1</span>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-2 text-base md:text-lg">Challenge Fees</h3>
                    <p className="text-gray-400 text-sm md:text-base leading-relaxed">
                      We charge an upfront fee for each evaluation challenge. These are not used to pay trader profits directly — they fund our business operations and contribute to a growing reserve pool.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-[#1A1A1A]/50 rounded-xl p-5 md:p-6 border border-[#2F2F2F]/30 hover:border-[#0FF1CE]/20 transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-[#0FF1CE]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-[#0FF1CE] font-bold text-sm">2</span>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-2 text-base md:text-lg">$800,000+ Reserve Pool</h3>
                    <p className="text-gray-400 text-sm md:text-base leading-relaxed">
                      We maintain a dedicated reserve for trader payouts — currently sitting at $800,000 and climbing. This is not a marketing number. It exists to ensure we rarely rely on new challenge fees to pay current traders.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-[#1A1A1A]/50 rounded-xl p-5 md:p-6 border border-[#2F2F2F]/30 hover:border-[#0FF1CE]/20 transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-[#0FF1CE]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-[#0FF1CE] font-bold text-sm">3</span>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-2 text-base md:text-lg">Simulated Funded Trading</h3>
                    <p className="text-gray-400 text-sm md:text-base leading-relaxed">
                      Upon successfully completing your challenge, you'll begin trading on a simulated funded account. After demonstrating consistent profitability with five successful payouts, our risk management team conducts a comprehensive strategy review. The five initial payouts are paid through our substantial reserve pool and failed challenge fees. Traders are then elevated to A-Book status and transition to our Live Copy Trading system.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-[#1A1A1A]/50 rounded-xl p-5 md:p-6 border border-[#2F2F2F]/30 hover:border-[#0FF1CE]/20 transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-[#0FF1CE]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-[#0FF1CE] font-bold text-sm">4</span>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-2 text-base md:text-lg">Live Copy Trading</h3>
                    <p className="text-gray-400 text-sm md:text-base leading-relaxed">
                      Your trades are executed in simulated demo environments, but your trades are copied 1:1 to live capital accounts. Profits generated from those live trades cover real payouts. This is how we scale and sustain — real capital, real profits.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Payout Flow */}
          <div className="relative bg-[#0D0D0D]/80 backdrop-blur-sm rounded-xl md:rounded-2xl p-6 md:p-8 lg:p-10 border border-[#2F2F2F]/50 mb-8 md:mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-[#0FF1CE]/20 flex items-center justify-center">
                <DollarSign className="w-5 h-5 md:w-6 md:h-6 text-[#0FF1CE]" />
              </div>
              <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-[#0FF1CE]">Payout Flow</h2>
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-[#0FF1CE] mt-0.5 flex-shrink-0" />
                <span className="text-gray-300 text-sm md:text-base">Trader generates profits on a funded account</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-[#0FF1CE] mt-0.5 flex-shrink-0" />
                <span className="text-gray-300 text-sm md:text-base">We pay from live profits or reserve</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-[#0FF1CE] mt-0.5 flex-shrink-0" />
                <span className="text-gray-300 text-sm md:text-base">Fast, clean, reliable payouts</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-[#0FF1CE] mt-0.5 flex-shrink-0" />
                <span className="text-gray-300 text-sm md:text-base">We always pay out our traders from the live profits generated or from our reserve. We rarely use new challenge fees to pay existing traders. Period.</span>
              </div>
            </div>

            <div className="bg-[#1A1A1A]/50 rounded-xl p-5 md:p-6 border border-[#2F2F2F]/30">
              <h3 className="text-white font-semibold mb-3 text-base md:text-lg">Payouts are funded by:</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#0FF1CE] flex-shrink-0"></div>
                  <span className="text-gray-300 text-sm md:text-base">Profits from live capital (copy trading)</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#0FF1CE] flex-shrink-0"></div>
                  <span className="text-gray-300 text-sm md:text-base">Shockwave's reserve pool</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#0FF1CE] flex-shrink-0"></div>
                  <span className="text-gray-300 text-sm md:text-base">Rarely directly from new challenge fees</span>
                </li>
              </ul>
              <p className="text-gray-400 mt-4 text-sm md:text-base italic">This means your payout is earned, not borrowed from the next guy.</p>
            </div>
          </div>

          {/* Section 3: Risk Controls */}
          <div className="relative bg-[#0D0D0D]/80 backdrop-blur-sm rounded-xl md:rounded-2xl p-6 md:p-8 lg:p-10 border border-[#2F2F2F]/50 mb-8 md:mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-[#0FF1CE]/20 flex items-center justify-center">
                <Shield className="w-5 h-5 md:w-6 md:h-6 text-[#0FF1CE]" />
              </div>
              <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-[#0FF1CE]">Risk Controls & Why They Exist</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-[#0FF1CE] mt-0.5 flex-shrink-0" />
                <span className="text-gray-300 text-sm md:text-base">Drawdowns: Protect live capital and simulate real-world constraints</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-[#0FF1CE] mt-0.5 flex-shrink-0" />
                <span className="text-gray-300 text-sm md:text-base">Select strategy bans: Prevent reckless or system-abusive strategies</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-[#0FF1CE] mt-0.5 flex-shrink-0" />
                <span className="text-gray-300 text-sm md:text-base">Minimum profitable days: Ensure consistent performance and reduces gamblers</span>
              </div>
            </div>
            
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 md:p-5">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                <p className="text-gray-300 text-sm md:text-base">
                  <span className="text-yellow-500 font-semibold">Important:</span> All drawdown calculations are based off of balance and/or floating equity if there are open trades.
                </p>
              </div>
            </div>
          </div>

          {/* Section 4: Trading Objectives */}
          <div className="relative bg-[#0D0D0D]/80 backdrop-blur-sm rounded-xl md:rounded-2xl p-6 md:p-8 lg:p-10 border border-[#2F2F2F]/50 mb-8 md:mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-[#0FF1CE]/20 flex items-center justify-center">
                <Target className="w-5 h-5 md:w-6 md:h-6 text-[#0FF1CE]" />
              </div>
              <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-[#0FF1CE]">Trading Objectives & Justifications</h2>
            </div>
            
            {/* Challenge-Specific Rules Section */}
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 md:p-6 mb-8">
              <div className="flex items-center gap-3 mb-4">
                <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                <h3 className="text-base md:text-lg font-semibold text-yellow-500">Universal Challenge Rules</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="text-white font-medium mb-1 text-sm md:text-base">Account Limit</h4>
                    <p className="text-gray-300 text-xs md:text-sm">Maximum of <strong>5 active challenge accounts</strong> per trader at any time across all challenge types.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="text-white font-medium mb-1 text-sm md:text-base">Minimum Trading Days</h4>
                    <p className="text-gray-300 text-xs md:text-sm">At least <strong>1 trade must be placed on the same day</strong> for it to count as a minimum trading day.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="text-white font-medium mb-1 text-sm md:text-base">Minimum Profitable Days</h4>
                    <p className="text-gray-300 text-xs md:text-sm">At least a <strong>0.5% gain of starting day balance/equity</strong> for it to count as a minimum profitable day.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
              <div className="bg-[#1A1A1A]/50 rounded-xl p-5 md:p-6 border border-[#2F2F2F]/30">
                <h3 className="text-lg md:text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-[#0FF1CE]" />
                  Shockwave Challenge
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-[#0FF1CE] mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">Minimum trading days: 5 — ensures consistent trading, not flukes</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-[#0FF1CE] mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">Unlimited trading period — removes pressure, focuses on skill</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-[#0FF1CE] mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">Max drawdown: 15% — generous but realistic, mirrors live tolerance</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-[#0FF1CE] mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">Max daily drawdown: 8% — safeguards against blowups</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-[#0FF1CE] mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">Leverage 1:200 — gives room for strategies without being overkill</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-[#0FF1CE] mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">Profit target 10%/5% — aggressive but achievable with smart risk</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-[#1A1A1A]/50 rounded-xl p-5 md:p-6 border border-[#2F2F2F]/30">
                <h3 className="text-lg md:text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-[#0FF1CE]" />
                  Shockwave 1-Step
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-[#0FF1CE] mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">Minimum trading days: 5 — ensures consistent trading, not flukes</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-[#0FF1CE] mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">Unlimited trading period — removes pressure, focuses on skill</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-[#0FF1CE] mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">Max drawdown: 8% — balanced risk tolerance for single-phase challenge</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-[#0FF1CE] mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">Max daily drawdown: 4% — tighter daily control for streamlined process</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-[#0FF1CE] mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">Leverage 1:200 — gives room for strategies without being overkill</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-[#0FF1CE] mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">Profit target: 10% — single phase to funded account</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-[#1A1A1A]/50 rounded-xl p-5 md:p-6 border border-[#2F2F2F]/30">
                <h3 className="text-lg md:text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[#0FF1CE]" />
                  Shockwave Instant
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-[#0FF1CE] mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">Trading period: 30 days — balances urgency with opportunity</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-[#0FF1CE] mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">Minimum profitable days: 5 — ensures consistent performance</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-[#0FF1CE] mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">Max drawdown: 4% — slightly tighter, aligns with instant funding risk</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-[#0FF1CE] mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">Max daily loss: N/A — no daily loss limit</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-[#0FF1CE] mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">Profit target: 12% — reflects no evaluation phase</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Section 5: Instant Challenge Rules */}
          <div className="relative bg-[#0D0D0D]/80 backdrop-blur-sm rounded-xl md:rounded-2xl p-6 md:p-8 lg:p-10 border border-[#2F2F2F]/50 mb-8 md:mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-[#0FF1CE]/20 flex items-center justify-center">
                <Clock className="w-5 h-5 md:w-6 md:h-6 text-[#0FF1CE]" />
              </div>
              <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-[#0FF1CE]">Instant Challenge Rules</h2>
            </div>
            
            <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-6">
              Our Instant Challenge is designed to fast-track skilled traders to get paid in just 30 days. Unlike our Standard Challenge, there's only one phase before you're eligible for a payout. Here are the specific rules and requirements you must meet to successfully complete the challenge.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-8">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#0FF1CE] rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h3 className="text-base md:text-lg font-semibold text-white mb-2">Trading Period</h3>
                    <p className="text-gray-300 text-sm md:text-base">You have exactly <strong>30 calendar days</strong> from activation to complete all objectives. This timeframe is fixed and cannot be extended.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#0FF1CE] rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h3 className="text-base md:text-lg font-semibold text-white mb-2">Profit Target</h3>
                    <p className="text-gray-300 text-sm md:text-base">Achieve a <strong>12% profit</strong> from your starting balance. This target must be reached within the 30-day period while maintaining all risk parameters.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#0FF1CE] rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h3 className="text-base md:text-lg font-semibold text-white mb-2">Minimum Profitable Days</h3>
                    <p className="text-gray-300 text-sm md:text-base">You must have at least <strong>5 profitable trading days</strong> during the challenge period. This ensures consistent performance rather than lucky streaks.</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h3 className="text-base md:text-lg font-semibold text-white mb-2">Maximum Drawdown</h3>
                    <p className="text-gray-300 text-sm md:text-base">Never exceed <strong>4% drawdown</strong> from your highest balance and/or equity achieved. This is calculated from your peak balance/equity, not your starting balance.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h3 className="text-base md:text-lg font-semibold text-white mb-2">Maximum Daily Loss</h3>
                    <p className="text-gray-300 text-sm md:text-base">There is no daily loss limit.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h3 className="text-base md:text-lg font-semibold text-white mb-2">Free Reset Policy</h3>
                    <p className="text-gray-300 text-sm md:text-base">Your <strong>free reset resets your account balance to the starting amount</strong> but does NOT reset the 30-day timer. Use it wisely as it's a balance reset, not a time extension.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-[#0FF1CE]/10 border border-[#0FF1CE]/30 rounded-lg p-4 md:p-6">
              <h3 className="text-lg md:text-xl font-semibold text-[#0FF1CE] mb-3">Key Differences from Standard Challenge</h3>
              <ul className="text-gray-300 text-sm space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-[#0FF1CE] mt-1">•</span>
                  <span>Get paid within 6 days of starting</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#0FF1CE] mt-1">•</span>
                  <span>Immediate funding instead of two phases</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#0FF1CE] mt-1">•</span>
                  <span>Higher profit target (12% vs 10% + 5%)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#0FF1CE] mt-1">•</span>
                  <span>Stricter drawdown limits (4% vs 15%)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#0FF1CE] mt-1">•</span>
                  <span>Fixed 30-day timeframe with no extensions</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Section 6: Funded Account Rules */}
          <div className="relative bg-[#0D0D0D]/80 backdrop-blur-sm rounded-xl md:rounded-2xl p-6 md:p-8 lg:p-10 border border-[#2F2F2F]/50 mb-8 md:mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-[#0FF1CE]/20 flex items-center justify-center">
                <Users className="w-5 h-5 md:w-6 md:h-6 text-[#0FF1CE]" />
              </div>
              <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-[#0FF1CE]">Funded Account Rules</h2>
            </div>
            
            <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-6">
              Your simulated trades are copied to live capital. Rules exist to ensure your strategy scales, protects capital, and mirrors what our live accounts can realistically support. We want you funded long-term, not temporarily.
            </p>

            <div className="space-y-6">
              {/* Funded Account Risk Rules Section */}
              <div className="space-y-6">
                <h3 className="text-lg md:text-xl font-bold text-[#0FF1CE] mb-4">Funded Account Risk Rules & Real-World Scenarios</h3>
                
                {/* Core Risk Limits */}
                <div className="bg-[#1A1A1A] rounded-lg p-5 md:p-6 border border-[#2F2F2F]/50">
                  <h4 className="text-base md:text-lg font-bold text-white mb-4 flex items-center">
                    <span className="text-[#0FF1CE] mr-2">📊</span>Core Risk Limits
                  </h4>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#0FF1CE] mt-2"></div>
                      <span className="text-gray-300 text-sm md:text-base">
                        <span className="text-white font-medium">Max Daily Drawdown:</span> 8% of account balance
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#0FF1CE] mt-2"></div>
                      <span className="text-gray-300 text-sm md:text-base">
                        <span className="text-white font-medium">Max Total Drawdown:</span> 15% of account balance
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#0FF1CE] mt-2"></div>
                      <span className="text-gray-300 text-sm md:text-base">
                        <span className="text-white font-medium">Max Total Risk Exposure at Any Time:</span> 2% of initial account balance <em>spread across all open positions combined</em>
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#0FF1CE] mt-2"></div>
                      <span className="text-gray-300 text-sm md:text-base">
                        <span className="text-white font-medium">Stop Loss & Take Profit:</span> <em>Highly recommended</em> but not enforced — you are fully responsible for managing your total open risk at all times.
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#0FF1CE] mt-2"></div>
                      <span className="text-gray-300 text-sm md:text-base">
                        <span className="text-white font-medium">Responsibility:</span> You must trade conservatively enough to absorb real-world execution factors, including spread, slippage, commissions, swaps, and unexpected price movements.
                      </span>
                    </li>
                  </ul>
                </div>

                {/* How This Works in Practice */}
                <div className="bg-[#1A1A1A] rounded-lg p-5 md:p-6 border border-[#2F2F2F]/50">
                  <h4 className="text-base md:text-lg font-bold text-white mb-4 flex items-center">
                    <span className="text-[#FF6B6B] mr-2">⚠️</span>How This Works in Practice
                  </h4>
                  <div className="space-y-4">
                    <p className="text-gray-300 text-sm md:text-base">
                      In practice:
                    </p>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#0FF1CE] mt-2"></div>
                        <span className="text-gray-300 text-sm md:text-base">
                          You can open a trade(s) with up to <span className="text-white font-medium">2% risk</span>, close it, and later open another trade(s) with up to <span className="text-white font-medium">2% risk</span> again — as long as you never have more than <span className="text-white font-medium">2% total open risk at the same time</span>.
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#0FF1CE] mt-2"></div>
                        <span className="text-gray-300 text-sm md:text-base">
                          However, please keep in mind that if your open trades are affected by real-world market conditions such as slippage, gaps, spread widening, liquidity or illiquidity, swaps, or commission costs — and the resulting total loss from those positions exceeds the 2% risk limit — this will be treated as a violation.
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#0FF1CE] mt-2"></div>
                        <span className="text-gray-300 text-sm md:text-base">
                          This policy exists to ensure that traders remain fully responsible for execution realities and true market conditions, just as they would be when managing actual live capital.
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#0FF1CE] mt-2"></div>
                        <span className="text-gray-300 text-sm md:text-base">
                          Therefore, while you can theoretically risk up to 2% per trade, we strongly recommend using a slight risk buffer to account for these variables and avoid unintentional breaches.
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#0FF1CE] mt-2"></div>
                        <span className="text-gray-300 text-sm md:text-base">
                          You may lose up to your allowed daily drawdown limit of 8%. The 2% risk limit applies to exposure at a given moment, whereas the daily drawdown limit covers your total realized losses within a trading day.
                        </span>
                      </li>
                    </ul>
                    <div className="bg-[#FF6B6B]/10 rounded-lg p-4 border border-[#FF6B6B]/20">
                      <p className="text-gray-300 font-medium">
                        Your funding may be restricted or terminated if you breach this limit, regardless of how the loss occurs.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Examples & Edge Cases */}
                <div className="bg-[#1A1A1A] rounded-lg p-5 md:p-6 border border-[#2F2F2F]/30">
                  <h4 className="text-base md:text-lg font-bold text-white mb-4 flex items-center">
                    <span className="text-[#0FF1CE] mr-2">💡</span>Examples & Edge Cases
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-[#2F2F2F]/50">
                          <th className="text-left text-white font-medium py-3 pr-4">Scenario</th>
                          <th className="text-left text-white font-medium py-3">How it affects your risk exposure</th>
                        </tr>
                      </thead>
                      <tbody className="space-y-2">
                        <tr className="border-b border-[#2F2F2F]/30">
                          <td className="py-3 pr-4 text-gray-300 font-medium">No Stop Loss Used</td>
                          <td className="py-3 text-gray-300">If you do not use stop losses, your open positions can run well past your intended risk amount. This easily leads to exceeding the 2% risk exposure rule.</td>
                        </tr>
                        <tr className="border-b border-[#2F2F2F]/30">
                          <td className="py-3 pr-4 text-gray-300 font-medium">Market Gaps / Slippage</td>
                          <td className="py-3 text-gray-300">Sudden price jumps (e.g., news releases) can cause orders to fill worse than expected, turning a properly sized trade into an oversized risk. If your total risk exposure was too tight to begin with, this can push actual losses beyond what is allowed.</td>
                        </tr>
                        <tr className="border-b border-[#2F2F2F]/30">
                          <td className="py-3 pr-4 text-gray-300 font-medium">Swaps, Commissions, Spreads</td>
                          <td className="py-3 text-gray-300">Holding trades overnight or during volatile periods can incur swap fees and higher spreads, increasing your realized loss beyond your planned risk. You must leave buffer room within your 2% total risk to account for these costs.</td>
                        </tr>
                        <tr className="border-b border-[#2F2F2F]/30">
                          <td className="py-3 pr-4 text-gray-300 font-medium">Major News Events</td>
                          <td className="py-3 text-gray-300">Trading during high-impact economic news can create huge spikes and fast moves that cause unexpected losses. If your total open risk is too high, a sudden move can lead to a loss far above 2% before you can react.</td>
                        </tr>
                        <tr className="border-b border-[#2F2F2F]/30">
                          <td className="py-3 pr-4 text-gray-300 font-medium">Low Liquidity / Illiquid Sessions</td>
                          <td className="py-3 text-gray-300">Trading during quiet times (late night, holidays, weekends) often leads to wider spreads and bigger gaps. This can magnify losses if you are near your total risk limit.</td>
                        </tr>
                        <tr className="border-b border-[#2F2F2F]/30">
                          <td className="py-3 pr-4 text-gray-300 font-medium">Stacking Multiple Trades</td>
                          <td className="py-3 text-gray-300">Opening many small trades can quietly add up to more than 2% total risk. If the market turns, you can lose more than allowed in a single move.</td>
                        </tr>
                        <tr className="border-b border-[#2F2F2F]/30">
                          <td className="py-3 pr-4 text-gray-300 font-medium">Not Actively Managing Trades</td>
                          <td className="py-3 text-gray-300">Leaving trades unattended or relying solely on manual closure increases the chance of your losses exceeding the 2% total risk you are allowed.</td>
                        </tr>
                        <tr>
                          <td className="py-3 pr-4 text-gray-300 font-medium">No Take Profit</td>
                          <td className="py-3 text-gray-300">Not setting take profits can cause you to miss opportunities to lock in profits — and if the trade reverses, your open risk remains active, counting towards your total allowed exposure.</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Key Takeaway */}
                <div className="bg-[#0FF1CE]/5 rounded-lg p-5 md:p-6 border border-[#0FF1CE]/20">
                  <h4 className="text-base md:text-lg font-bold text-white mb-4 flex items-center">
                    <span className="text-[#0FF1CE] mr-2">🎯</span>Key Takeaway
                  </h4>
                  <div className="space-y-3">
                    <p className="text-gray-300 text-sm md:text-base">
                      <span className="text-white font-medium">Your total combined risk across all open trades must never exceed 2% of your account balance.</span>
                      You are fully responsible for managing your lot sizes, stop levels, and trade timing to keep your exposure within this limit.
                    </p>
                    <p className="text-gray-300 text-sm md:text-base">
                      If you lose more than 2% in a single day, our risk advisors will closely monitor all positions taken on your account going forward to ensure strict compliance with our risk exposure rules.
                    </p>
                  </div>
                </div>

                {/* Best Practices */}
                <div className="bg-[#1A1A1A] rounded-lg p-5 md:p-6 border border-[#2F2F2F]/50">
                  <h4 className="text-base md:text-lg font-bold text-white mb-4 flex items-center">
                    <span className="text-[#0FF1CE] mr-2">✅</span>Best Practices (Strongly Recommended)
                  </h4>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <span className="text-[#0FF1CE]">→</span>
                      <span className="text-gray-300 text-sm md:text-base">Always use a stop loss and take profit on every trade.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-[#0FF1CE]">→</span>
                      <span className="text-gray-300 text-sm md:text-base">Keep total risk <em>below</em> 2% to leave room for fees and slippage.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-[#0FF1CE]">→</span>
                      <span className="text-gray-300 text-sm md:text-base">Avoid trading during high-impact news or illiquid times unless you fully understand the risk.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-[#0FF1CE]">→</span>
                      <span className="text-gray-300 text-sm md:text-base">Monitor your trades actively — do not leave positions unmanaged.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-[#0FF1CE]">→</span>
                      <span className="text-gray-300 text-sm md:text-base">Trade conservatively to protect your funded capital and qualify for payouts.</span>
                    </li>
                  </ul>
                </div>

                {/* Monitoring & Enforcement */}
                <div className="bg-[#1A1A1A] rounded-lg p-5 md:p-6 border border-[#2F2F2F]/50">
                  <h4 className="text-base md:text-lg font-bold text-white mb-4 flex items-center">
                    <span className="text-[#0FF1CE] mr-2">🛡️</span>How We Monitor & Enforce
                  </h4>
                  <div className="space-y-4">
                    <p className="text-gray-300 text-sm md:text-base">We track your open risk and your daily drawdown in real time.</p>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#0FF1CE] mt-2"></div>
                        <span className="text-gray-300 text-sm md:text-base">If your total open risk exceeds 2% across all trades, you are in violation.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#0FF1CE] mt-2"></div>
                        <span className="text-gray-300 text-sm md:text-base">If you lose 2% or more in a single day, our risk team will closely monitor and review all subsequent trades to ensure no positions exceed the 2% maximum risk exposure.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#0FF1CE] mt-2"></div>
                        <span className="text-gray-300 text-sm md:text-base">If you hit the 8% daily drawdown limit, your account will be breached immediately.</span>
                      </li>
                    </ul>
                    <div className="bg-[#FF6B6B]/10 rounded-lg p-4 border border-[#FF6B6B]/20 mt-4">
                      <p className="text-gray-300">
                        Violations may result in account restrictions, termination of funding, and forfeiture of any fees paid.
                        No exceptions will be made due to market conditions.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Final Message */}
                <div className="bg-gradient-to-r from-[#0FF1CE]/10 to-[#0FF1CE]/5 rounded-lg p-5 md:p-6 border border-[#0FF1CE]/20 text-center">
                  <p className="text-white font-bold text-base md:text-lg">
                    Stay disciplined, manage your exposure wisely, and protect your funded account to keep earning payouts like a professional.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section: Withdrawal Structure */}
          <div className="relative bg-[#0D0D0D]/80 backdrop-blur-sm rounded-xl md:rounded-2xl p-6 md:p-8 lg:p-10 border border-[#2F2F2F]/50 mb-8 md:mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-[#0FF1CE]/20 flex items-center justify-center">
                <DollarSign className="w-5 h-5 md:w-6 md:h-6 text-[#0FF1CE]" />
              </div>
              <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-[#0FF1CE]">Withdrawal Structure</h2>
            </div>
            
            <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-8">
              Our withdrawal system is designed to reward consistent, disciplined trading while maintaining operational sustainability. All funded accounts must adhere to our trading rules and meet specific criteria before becoming eligible for withdrawals.
            </p>

            {/* Discounted Challenge Notice */}
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 md:p-6 mb-8">
              <div className="flex items-center gap-3 mb-3">
                <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                <h3 className="text-base md:text-lg font-semibold text-yellow-500">Discounted Challenge Policy</h3>
              </div>
              <p className="text-gray-300 text-sm md:text-base">
                <strong>All discounted challenges are subject to a 30-day first withdrawal period</strong> regardless of the challenge type. This extended period applies to any challenge purchased at a reduced rate, promotional pricing, or with discount codes.
              </p>
            </div>

            <div className="space-y-8 md:space-y-12">
              {/* Simulated Funded Accounts */}
              <div>
                <h3 className="text-lg md:text-xl font-bold text-white mb-4 flex items-center">
                  <span className="text-[#0FF1CE] mr-2">80%</span> Profit Split — Simulated Funded Accounts
                </h3>
                
                <div className="space-y-4 md:space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-[#0FF1CE]/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-[#0FF1CE] font-medium">1</span>
                    </div>
                    <div>
                      <h4 className="text-white font-medium mb-2">Initial Withdrawal Period</h4>
                      <p className="text-gray-300 text-sm md:text-base">
                        First withdrawal becomes available 21 days after your first trade. Subsequent withdrawals follow a 14-day cycle, subject to the monthly withdrawal cap.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-[#0FF1CE]/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-[#0FF1CE] font-medium">2</span>
                    </div>
                    <div>
                      <h4 className="text-white font-medium mb-2">Minimum Profitable Days</h4>
                      <p className="text-gray-300 text-sm md:text-base">
                        Requires 5 profitable trading days, each showing at least 0.5% gain on initial balance. For swing trades, profit is counted as one day regardless of holding period. These days reset after each withdrawal and don't accumulate for multiple withdrawals.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-[#0FF1CE]/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-[#0FF1CE] font-medium">3</span>
                    </div>
                    <div>
                      <h4 className="text-white font-medium mb-2">Monthly Withdrawal Cap</h4>
                      <p className="text-gray-300 text-sm md:text-base">
                        No withdrawal cap. This applies regardless of account size or total profits generated. Each withdrawal requires meeting the minimum profitable days criterion again.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-[#0FF1CE]/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-[#0FF1CE] font-medium">4</span>
                    </div>
                    <div>
                      <h4 className="text-white font-medium mb-2">Minimum Withdrawal Amount</h4>
                      <p className="text-gray-300 text-sm md:text-base">
                        Minimum withdrawal amount is <strong>$150</strong>. Withdrawals below this threshold will not be processed to maintain operational efficiency.
                      </p>
                    </div>
                  </div>

                  <div className="bg-[#0FF1CE]/5 rounded-lg p-4 border border-[#0FF1CE]/20">
                    <p className="text-gray-300 text-sm">
                      <span className="text-white font-medium">Important:</span> After 5 successful withdrawals, traders undergo strategy analysis for potential transition to Live Copy Trading. Any remaining profits in simulated accounts are forfeited during transition. This transition is mandatory for continued program participation.
                    </p>
                  </div>

                  <div className="mt-6 bg-[#1A1A1A] rounded-lg p-5 md:p-6 border border-[#2F2F2F]/50">
                    <h4 className="text-white font-medium mb-3">Example Scenario</h4>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      A trader operating a $100,000 simulated funded account generates $30,000 in profits over 10 trading days. Here's how the withdrawal process works:
                    </p>
                    <ul className="mt-3 space-y-2">
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#0FF1CE] mt-2"></div>
                        <span className="text-gray-300 text-sm">Must wait 21 days from first trade before initial withdrawal</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#0FF1CE] mt-2"></div>
                        <span className="text-gray-300 text-sm">Requires 5 minimum profitable days (0.5% daily gain) for first withdrawal</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#0FF1CE] mt-2"></div>
                        <span className="text-gray-300 text-sm">After first withdrawal, needs another 5 profitable days before next month's withdrawal</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#0FF1CE] mt-2"></div>
                        <span className="text-gray-300 text-sm">Even if 5 profitable days are achieved early, must wait for next withdrawal date</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Live Copy Trading Accounts */}
              <div>
                <h3 className="text-lg md:text-xl font-bold text-white mb-4 flex items-center">
                  <span className="text-[#0FF1CE] mr-2">95%</span> Profit Split — Live Copy Trading Accounts
                </h3>
                
                <div className="space-y-4 md:space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-[#0FF1CE]/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-[#0FF1CE] font-medium">1</span>
                    </div>
                    <div>
                      <h4 className="text-white font-medium mb-2">Extended Initial Period</h4>
                      <p className="text-gray-300 text-sm md:text-base">
                        First withdrawal available after 30 days from initial trade. Subsequent withdrawals are processed monthly, ensuring stable capital management for live accounts.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-[#0FF1CE]/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-[#0FF1CE] font-medium">2</span>
                    </div>
                    <div>
                      <h4 className="text-white font-medium mb-2">Performance Requirements</h4>
                      <p className="text-gray-300 text-sm md:text-base">
                        Maintains the 5 profitable trading days requirement (0.5% daily gain minimum). Trading days reset after each withdrawal, ensuring consistent performance between payouts.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-[#0FF1CE]/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-[#0FF1CE] font-medium">3</span>
                    </div>
                    <div>
                      <h4 className="text-white font-medium mb-2">Unlimited Withdrawal Potential</h4>
                      <p className="text-gray-300 text-sm md:text-base">
                        No withdrawal cap applies — all profits are available for withdrawal once performance criteria are met. This reflects direct connection to live market profits.
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 bg-[#1A1A1A] rounded-lg p-5 md:p-6 border border-[#2F2F2F]/50">
                    <h4 className="text-white font-medium mb-3">Example Scenario</h4>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      A trader managing a $100,000 live copy trading account generates $30,000 in profits over 10 trading days. Here's the withdrawal process:
                    </p>
                    <ul className="mt-3 space-y-2">
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#0FF1CE] mt-2"></div>
                        <span className="text-gray-300 text-sm">Initial 30-day waiting period from first trade must be completed</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#0FF1CE] mt-2"></div>
                        <span className="text-gray-300 text-sm">Must achieve 5 profitable trading days (0.5% daily minimum)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#0FF1CE] mt-2"></div>
                        <span className="text-gray-300 text-sm">Can withdraw entire $28,500 (95% profit split) once criteria are met</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#0FF1CE] mt-2"></div>
                        <span className="text-gray-300 text-sm">Next withdrawal requires another 5 profitable days and waiting for next monthly cycle</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 6: Execution Logic */}
          <div className="relative bg-[#0D0D0D]/80 backdrop-blur-sm rounded-xl md:rounded-2xl p-6 md:p-8 lg:p-10 border border-[#2F2F2F]/50 mb-8 md:mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-[#0FF1CE]/20 flex items-center justify-center">
                <Zap className="w-5 h-5 md:w-6 md:h-6 text-[#0FF1CE]" />
              </div>
              <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-[#0FF1CE]">Execution Logic</h2>
            </div>
            
            <p className="text-gray-300 text-sm md:text-base leading-relaxed">
              Simulated accounts use real-time market data. Execution latency and slippage mimic live prime brokerage conditions. This keeps our copy trading smooth, honest, and predictable.
            </p>
          </div>

          {/* Section 7: No Hidden Rules */}
          <div className="relative bg-[#0D0D0D]/80 backdrop-blur-sm rounded-xl md:rounded-2xl p-6 md:p-8 lg:p-10 border border-[#2F2F2F]/50 mb-8 md:mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-[#0FF1CE]/20 flex items-center justify-center">
                <Shield className="w-5 h-5 md:w-6 md:h-6 text-[#0FF1CE]" />
              </div>
              <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-[#0FF1CE]">No Hidden Rules</h2>
            </div>
            
            <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-4">
              We justify every rule. If we impose a restriction, we explain it. Trust comes from transparency — and we don't expect it, we earn it.
            </p>
            
            <div className="bg-[#1A1A1A]/50 rounded-xl p-5 md:p-6 border border-[#2F2F2F]/30">
              <p className="text-gray-300 text-sm md:text-base mb-4">
                Here's something no other firm does: we explain every rule we enforce. If we ask you not to trade during NFP, you'll see why. If we require 5 minimum trading days, we'll explain the data behind that.
              </p>

              <h4 className="text-white font-medium mb-3 text-sm md:text-base">We thoroughly break down:</h4>
              <ul className="space-y-2 mb-4">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#0FF1CE]"></div>
                  <span className="text-gray-300 text-sm">Challenge Rules</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#0FF1CE]"></div>
                  <span className="text-gray-300 text-sm">Funded Account Requirements</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#0FF1CE]"></div>
                  <span className="text-gray-300 text-sm">Copy Trading Constraints</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#0FF1CE]"></div>
                  <span className="text-gray-300 text-sm">Risk/Execution Logic</span>
                </li>
              </ul>

              <p className="text-gray-300 text-sm md:text-base italic">
                "The moment a firm hides its rules, it's no longer a partner — it's a trap." - Shockwave
              </p>
            </div>
          </div>

          {/* Section 8: Why We're Different */}
          <div className="relative bg-[#0D0D0D]/80 backdrop-blur-sm rounded-xl md:rounded-2xl p-6 md:p-8 lg:p-10 border border-[#2F2F2F]/50 mb-8 md:mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-[#0FF1CE]/20 flex items-center justify-center">
                <Users className="w-5 h-5 md:w-6 md:h-6 text-[#0FF1CE]" />
              </div>
              <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-[#0FF1CE]">Why We're Different</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm md:text-base">
                <thead>
                  <tr className="border-b border-[#2F2F2F]/50">
                    <th className="text-left text-gray-300 pb-4 pr-4 md:pr-8">Topic</th>
                    <th className="text-left text-gray-300 pb-4 px-4 md:px-8">Shockwave</th>
                    <th className="text-left text-gray-300 pb-4 pl-4 md:pl-8">Other Firms</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-[#2F2F2F]/30">
                    <td className="py-3 pr-4 md:pr-8">Copy Trades to Live Capital</td>
                    <td className="text-[#0FF1CE] px-4 md:px-8">✓ Yes</td>
                    <td className="text-red-500 pl-4 md:pl-8">✗ Rare</td>
                  </tr>
                  <tr className="border-b border-[#2F2F2F]/30">
                    <td className="py-3 pr-4 md:pr-8">Explain Every Rule</td>
                    <td className="text-[#0FF1CE] px-4 md:px-8">✓ Full Justification</td>
                    <td className="text-red-500 pl-4 md:pl-8">✗ Vague/Hidden</td>
                  </tr>
                  <tr className="border-b border-[#2F2F2F]/30">
                    <td className="py-3 pr-4 md:pr-8">Reserve-Backed Payouts</td>
                    <td className="text-[#0FF1CE] px-4 md:px-8">✓ $800k+</td>
                    <td className="text-red-500 pl-4 md:pl-8">✗ Fee-Driven</td>
                  </tr>
                  <tr className="border-b border-[#2F2F2F]/30">
                    <td className="py-3 pr-4 md:pr-8">No Gimmicks</td>
                    <td className="text-[#0FF1CE] px-4 md:px-8">✓ Straight Talk</td>
                    <td className="text-red-500 pl-4 md:pl-8">✗ Gamified</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 md:pr-8">Long-Term Trader Model</td>
                    <td className="text-[#0FF1CE] px-4 md:px-8">✓ Sustainable</td>
                    <td className="text-red-500 pl-4 md:pl-8">✗ Churn & Burn</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 9: Transparency in Action */}
          <div className="relative bg-[#0D0D0D]/80 backdrop-blur-sm rounded-xl md:rounded-2xl p-6 md:p-8 lg:p-10 border border-[#2F2F2F]/50 mb-8 md:mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-[#0FF1CE]/20 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-[#0FF1CE]" />
              </div>
              <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-[#0FF1CE]">Transparency in Action</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-[#0FF1CE] mt-0.5 flex-shrink-0" />
                <span className="text-gray-300 text-sm md:text-base">Reserve balance reports</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-[#0FF1CE] mt-0.5 flex-shrink-0" />
                <span className="text-gray-300 text-sm md:text-base">Payout receipt snapshots</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-[#0FF1CE] mt-0.5 flex-shrink-0" />
                <span className="text-gray-300 text-sm md:text-base">Performance metrics from copy trading</span>
              </div>
            </div>
          </div>

          {/* Final Disclaimer Card */}
          <div className="mt-8 md:mt-12 bg-gradient-to-br from-[#1A1A1A] via-[#0D0D0D] to-[#1A1A1A] rounded-xl md:rounded-2xl p-6 md:p-8 border-2 border-[#0FF1CE]/20 shadow-2xl">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-8 h-8 rounded-full bg-[#0FF1CE]/20 flex items-center justify-center flex-shrink-0">
                <span className="text-[#0FF1CE] font-bold">!</span>
              </div>
              <h3 className="text-lg md:text-xl font-bold text-[#0FF1CE]">Important Legal Disclaimer & Risk Management Authority</h3>
            </div>
            
            <div className="space-y-4 text-gray-300 text-sm md:text-base leading-relaxed">
              <p>
                <span className="text-white font-semibold">Discretionary Authority:</span> Shockwave Capital reserves the absolute and sole discretion to determine compliance with all trading rules, risk management protocols, and operational guidelines. Our risk management team maintains final authority over all trading activity assessments, account status determinations, and monetization decisions.
              </p>
              
              <p>
                <span className="text-white font-semibold">No Guarantee of Compensation:</span> Participation in our evaluation programs and funded trading opportunities does not constitute a guarantee of compensation, profit sharing, or continued account funding. All trading activities are subject to our comprehensive risk assessment and compliance review processes.
              </p>
              
              <p>
                <span className="text-white font-semibold">Not Investment Products:</span> Our challenge programs and simulated trading accounts are proprietary evaluation tools and do not constitute investment products, securities, or financial instruments. No client funds are managed, and participants do not hold any ownership interest in trading capital or profits generated.
              </p>
              
              <p className="text-xs md:text-sm text-gray-400 italic">
                This discretionary authority framework is standard practice across the proprietary trading industry. Shockwave Capital distinguishes itself by providing transparent disclosure of these policies, unlike many competitors who maintain similar authority without explicit communication to participants.
              </p>
            </div>
            
            <div className="mt-6 pt-4 border-t border-[#2F2F2F]">
              <p className="text-center text-[#0FF1CE] font-medium text-sm md:text-base">
                By participating in our programs, you acknowledge and accept these terms, our comprehensive risk management framework, and all trading rules, objectives, and operational guidelines outlined herein.
              </p>
            </div>
          </div>

          {/* CTA Section */}
          <div className="relative bg-[#0D0D0D]/80 backdrop-blur-sm rounded-xl md:rounded-2xl p-8 md:p-12 border border-[#2F2F2F]/50 text-center">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">Ready to Start Your Journey?</h2>
            <p className="text-gray-300 text-base md:text-lg mb-8 max-w-2xl mx-auto">
              Join the next generation of funded traders. No hidden rules, no surprises — just pure trading potential.
            </p>
            <Link 
              href="/challenge"
              className="inline-flex items-center gap-2 bg-[#0FF1CE] text-black px-6 md:px-8 py-3 md:py-4 rounded-lg font-bold text-base md:text-lg hover:scale-105 transition-transform"
            >
              Start Your Challenge
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      <style jsx global>{`
        .background-noise {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 250 250' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E");
          opacity: 0.15;
        }
      `}</style>
    </div>
  );
} 