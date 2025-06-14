'use client';
import React from 'react';
import Particles from '../components/Particles';
import Header from '../components/Header';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function HowShockwaveOperatesPage() {
  return (
    <div className="bg-gradient-to-b from-[#0D0D0D] via-[#121212] to-[#151515] text-white min-h-screen font-sans">
      <Header />
      
      {/* Hero Section */}
      <section className="relative px-6 pt-40 pb-32 text-center overflow-hidden bg-gradient-to-b from-[#121212] to-[#131313]">
        <div className="absolute top-0 left-0 w-full h-full bg-[#0FF1CE]/[0.02] background-noise"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full md:w-3/4 h-full rounded-full bg-[#0FF1CE]/[0.03] blur-[150px] opacity-60"></div>
        <Particles />
        
        <div className="relative z-10 max-w-5xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-extrabold text-[#0FF1CE] mb-6">
            How Shockwave Operates
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
            No secrets. No fine print. Just real trading, real payouts, and a model you can trust.
          </p>
          <p className="text-sm md:text-lg text-gray-300 max-w-3xl mx-auto">
            No other platform can offer this level of transparency and trust.
          </p>
        </div>
      </section>

      {/* Content Sections */}
      <section className="relative py-20 px-6">
        <div className="absolute top-0 left-0 w-full h-full bg-[#0FF1CE]/[0.02] background-noise"></div>
        <div className="absolute top-1/2 right-0 w-1/2 h-[300px] bg-[#0FF1CE]/[0.015] blur-[120px] rounded-full"></div>
        <div className="absolute bottom-1/3 left-0 w-1/2 h-[300px] bg-[#0FF1CE]/[0.01] blur-[120px] rounded-full"></div>
        
        <div className="max-w-5xl mx-auto space-y-20">
          {/* Section 1: Business Model */}
          <div className="relative bg-[#0D0D0D]/80 backdrop-blur-sm rounded-2xl p-8 border border-[#2F2F2F]/50">
            <h2 className="text-2xl md:text-3xl font-bold text-[#0FF1CE] mb-6">The Foundation: Our Business Model</h2>
            <p className="text-gray-300 leading-relaxed mb-12">
              Challenge fees fund operations and our growing reserve pool (currently $800k+). Funded traders operate on simulated accounts and are copy traded to live capital accounts backed by us. Payouts come from the reserve if needed and live profits — rarely from new challenges.
            </p>
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-[#0FF1CE]/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-[#0FF1CE] font-medium">1</span>
                </div>
                <div>
                  <h3 className="text-white font-medium mb-2">Challenge Fees</h3>
                  <p className="text-gray-300">
                    We charge an upfront fee for each evaluation challenge. These are not used to pay trader profits directly — they fund our business operations and contribute to a growing reserve pool.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-[#0FF1CE]/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-[#0FF1CE] font-medium">2</span>
                </div>
                <div>
                  <h3 className="text-white font-medium mb-2">$800,000+ Reserve Pool</h3>
                  <p className="text-gray-300">
                    We maintain a dedicated reserve for trader payouts — currently sitting at $800,000 and climbing. This is not a marketing number. It exists to ensure we rarely rely on new challenge fees to pay current traders.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-[#0FF1CE]/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-[#0FF1CE] font-medium">3</span>
                </div>
                <div>
                  <h3 className="text-white font-medium mb-2">Simulated Funded Trading</h3>
                  <p className="text-gray-300">
                    Upon successfully completing your challenge, you'll begin trading on a simulated funded account. After demonstrating consistent profitability with three successful payouts, our risk management team conducts a comprehensive strategy review. The three initial payouts are paid through our substantial reserve pool and failed challenge fees. Traders are then elevated to A-Book status and transition to our Live Copy Trading system.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-[#0FF1CE]/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-[#0FF1CE] font-medium">4</span>
                </div>
                <div>
                  <h3 className="text-white font-medium mb-2">Live Copy Trading</h3>
                  <p className="text-gray-300">
                    Your trades are executed in simulated demo environments, but your trades are copied 1:1 to live capital accounts. Profits generated from those live trades cover real payouts. This is how we scale and sustain — real capital, real profits.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Payout Flow */}
          <div className="relative bg-[#0D0D0D]/80 backdrop-blur-sm rounded-2xl p-8 border border-[#2F2F2F]/50">
            <h2 className="text-2xl md:text-3xl font-bold text-[#0FF1CE] mb-6">Payout Flow</h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#0FF1CE]/10 flex items-center justify-center mt-1">
                  <span className="text-[#0FF1CE]">✓</span>
                </div>
                <span className="text-gray-300">Trader generates profits on a funded account</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#0FF1CE]/10 flex items-center justify-center mt-1">
                  <span className="text-[#0FF1CE]">✓</span>
                </div>
                <span className="text-gray-300">We pay from live profits or reserve</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#0FF1CE]/10 flex items-center justify-center mt-1">
                  <span className="text-[#0FF1CE]">✓</span>
                </div>
                <span className="text-gray-300">Fast, clean, reliable payouts</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#0FF1CE]/10 flex items-center justify-center mt-1">
                  <span className="text-[#0FF1CE]">✓</span>
                </div>
                <span className="text-gray-300">We always pay out our traders from the live profits generated or from our reserve. We rarely use new challenge fees to pay existing traders. Period.</span>
              </li>

            <div>
              <h3 className="text-white font-medium mb-2">Payouts are funded by:</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#0FF1CE]"></div>
                  <span className="text-gray-300">Profits from live capital (copy trading)</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#0FF1CE]"></div>
                  <span className="text-gray-300">Shockwave's reserve pool</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#0FF1CE]"></div>
                  <span className="text-gray-300">Rarely directly from new challenge fees</span>
                </li>
              </ul>
              <p className="text-gray-300 mt-4">This means your payout is earned, not borrowed from the next guy.</p>
            </div>
            </ul>
          </div>

          {/* Section 3: Risk Controls */}
          <div className="relative bg-[#0D0D0D]/80 backdrop-blur-sm rounded-2xl p-8 border border-[#2F2F2F]/50">
            <h2 className="text-2xl md:text-3xl font-bold text-[#0FF1CE] mb-6">Risk Controls & Why They Exist</h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#0FF1CE]/10 flex items-center justify-center mt-1">
                  <span className="text-[#0FF1CE]">✓</span>
                </div>
                <span className="text-gray-300">Drawdowns: Protect live capital and simulate real-world constraints</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#0FF1CE]/10 flex items-center justify-center mt-1">
                  <span className="text-[#0FF1CE]">✓</span>
                </div>
                <span className="text-gray-300">Select stratgey bans: Prevent reckless or system-abusive strategies</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#0FF1CE]/10 flex items-center justify-center mt-1">
                  <span className="text-[#0FF1CE]">✓</span>
                </div>
                <span className="text-gray-300">Minimum profitable days: Ensure consistent performance and reduces gamblers</span>
              </li>
            </ul>
          </div>

          {/* Section 4: Trading Objectives */}
          <div className="relative bg-[#0D0D0D]/80 backdrop-blur-sm rounded-2xl p-8 border border-[#2F2F2F]/50">
            <h2 className="text-2xl md:text-3xl font-bold text-[#0FF1CE] mb-6">Trading Objectives & Justifications</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white">Shockwave Challenge</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#0FF1CE]/10 flex items-center justify-center mt-1">
                      <span className="text-[#0FF1CE]">✓</span>
                    </div>
                    <span className="text-gray-300">Minimum trading days: 5 — ensures consistent trading, not flukes</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#0FF1CE]/10 flex items-center justify-center mt-1">
                      <span className="text-[#0FF1CE]">✓</span>
                    </div>
                    <span className="text-gray-300">Unlimited trading period — removes pressure, focuses on skill</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#0FF1CE]/10 flex items-center justify-center mt-1">
                      <span className="text-[#0FF1CE]">✓</span>
                    </div>
                    <span className="text-gray-300">Max drawdown: 15% — generous but realistic, mirrors live tolerance</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#0FF1CE]/10 flex items-center justify-center mt-1">
                      <span className="text-[#0FF1CE]">✓</span>
                    </div>
                    <span className="text-gray-300">Max daily drawdown: 8% — safeguards against blowups</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#0FF1CE]/10 flex items-center justify-center mt-1">
                      <span className="text-[#0FF1CE]">✓</span>
                    </div>
                    <span className="text-gray-300">Leverage 1:200 — gives room for strategies without being overkill</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#0FF1CE]/10 flex items-center justify-center mt-1">
                      <span className="text-[#0FF1CE]">✓</span>
                    </div>
                    <span className="text-gray-300">Profit target 10%/5% — aggressive but achievable with smart risk</span>
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white">Shockwave Instant</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#0FF1CE]/10 flex items-center justify-center mt-1">
                      <span className="text-[#0FF1CE]">✓</span>
                    </div>
                    <span className="text-gray-300">Trading period: 30 days — balances urgency with opportunity</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#0FF1CE]/10 flex items-center justify-center mt-1">
                      <span className="text-[#0FF1CE]">✓</span>
                    </div>
                    <span className="text-gray-300">Minimum profitable days: 5 — ensures consistent performance</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#0FF1CE]/10 flex items-center justify-center mt-1">
                      <span className="text-[#0FF1CE]">✓</span>
                    </div>
                    <span className="text-gray-300">Max drawdown: 12% — slightly tighter, aligns with instant funding risk</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#0FF1CE]/10 flex items-center justify-center mt-1">
                      <span className="text-[#0FF1CE]">✓</span>
                    </div>
                    <span className="text-gray-300">Max daily loss: 4% — ensures better intra-day risk discipline</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#0FF1CE]/10 flex items-center justify-center mt-1">
                      <span className="text-[#0FF1CE]">✓</span>
                    </div>
                    <span className="text-gray-300">Profit target: 12% — reflects no evaluation phase</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Section 5: Funded Account Rules */}
          <div className="relative bg-[#0D0D0D]/80 backdrop-blur-sm rounded-2xl p-8 border border-[#2F2F2F]/50">
            <h2 className="text-2xl md:text-3xl font-bold text-[#0FF1CE] mb-6">Funded Account Rules</h2>
            <p className="text-gray-300 leading-relaxed mb-6">
              Your simulated trades are copied to live capital. Rules exist to ensure your strategy scales, protects capital, and mirrors what our live accounts can realistically support. We want you funded long-term, not temporarily.
            </p>

            <div className="space-y-6">
              {/* Funded Account Risk Rules Section */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-[#0FF1CE] mb-4">Funded Account Risk Rules & Real-World Scenarios</h3>
                
                {/* Core Risk Limits */}
                <div className="bg-[#1A1A1A] rounded-lg p-6 border border-[#2F2F2F]/50">
                  <h4 className="text-lg font-bold text-white mb-4 flex items-center">
                    <span className="text-[#0FF1CE] mr-2"></span>Core Risk Limits
                  </h4>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#0FF1CE] mt-2"></div>
                      <span className="text-gray-300">
                        <span className="text-white font-medium">Max Daily Drawdown:</span> 8% of account balance
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#0FF1CE] mt-2"></div>
                      <span className="text-gray-300">
                        <span className="text-white font-medium">Max Total Drawdown:</span> 15% of account balance
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#0FF1CE] mt-2"></div>
                      <span className="text-gray-300">
                        <span className="text-white font-medium">Max Total Risk Exposure at Any Time:</span> 2% of account balance <em>spread across all open positions combined</em>
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#0FF1CE] mt-2"></div>
                      <span className="text-gray-300">
                        <span className="text-white font-medium">Stop Loss & Take Profit:</span> <em>Highly recommended</em> but not enforced — you are fully responsible for managing your total open risk at all times.
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#0FF1CE] mt-2"></div>
                      <span className="text-gray-300">
                        <span className="text-white font-medium">Responsibility:</span> You must trade conservatively enough to absorb real-world execution factors, including spread, slippage, commissions, swaps, and unexpected price movements.
                      </span>
                    </li>
                  </ul>
                </div>

                {/* How This Works in Practice */}
                <div className="bg-[#1A1A1A] rounded-lg p-6 border border-[#2F2F2F]/50">
                  <h4 className="text-lg font-bold text-white mb-4 flex items-center">
                    <span className="text-[#FF6B6B] mr-2"></span>How This Works in Practice
                  </h4>
                  <div className="space-y-4">
                    <p className="text-gray-300">
                      In practice:
                    </p>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#0FF1CE] mt-2"></div>
                        <span className="text-gray-300">
                          You can open a trade(s) with up to <span className="text-white font-medium">2% risk</span>, close it, and later open another trade(s) with up to <span className="text-white font-medium">2% risk</span> again — as long as you never have more than <span className="text-white font-medium">2% total open risk at the same time</span>.
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#0FF1CE] mt-2"></div>
                        <span className="text-gray-300">
                          However, please keep in mind that if your open trades are affected by real-world market conditions such as slippage, gaps, spread widening, liquidity or illiquidity, swaps, or commission costs — and the resulting total loss from those positions exceeds the 2% risk limit — this will be treated as a violation.
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#0FF1CE] mt-2"></div>
                        <span className="text-gray-300">
                          This policy exists to ensure that traders remain fully responsible for execution realities and true market conditions, just as they would be when managing actual live capital.
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#0FF1CE] mt-2"></div>
                        <span className="text-gray-300">
                          Therefore, while you can theoretically risk up to 2% per trade, we strongly recommend using a slight risk buffer to account for these variables and avoid unintentional breaches.
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#0FF1CE] mt-2"></div>
                        <span className="text-gray-300">
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
                <div className="bg-[#1A1A1A] rounded-lg p-6 border border-[#2F2F2F]/50">
                  <h4 className="text-lg font-bold text-white mb-4 flex items-center">
                    <span className="text-[#0FF1CE] mr-2"></span>Examples & Edge Cases
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
                <div className="bg-[#0FF1CE]/5 rounded-lg p-6 border border-[#0FF1CE]/20">
                  <h4 className="text-lg font-bold text-white mb-4 flex items-center">
                    <span className="text-[#0FF1CE] mr-2"></span>Key Takeaway
                  </h4>
              <div className="space-y-3">
                    <p className="text-gray-300">
                      <span className="text-white font-medium">Your total combined risk across all open trades must never exceed 2% of your account balance.</span>
                      You are fully responsible for managing your lot sizes, stop levels, and trade timing to keep your exposure within this limit.
                    </p>
                    <p className="text-gray-300">
                      If you lose more than 2% in a single day, our risk advisors will closely monitor all positions taken on your account going forward to ensure strict compliance with our risk exposure rules.
                    </p>
                  </div>
                </div>

                {/* Best Practices */}
                <div className="bg-[#1A1A1A] rounded-lg p-6 border border-[#2F2F2F]/50">
                  <h4 className="text-lg font-bold text-white mb-4 flex items-center">
                    <span className="text-[#0FF1CE] mr-2"></span>Best Practices (Strongly Recommended)
                  </h4>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <span className="text-[#0FF1CE]"></span>
                      <span className="text-gray-300">Always use a stop loss and take profit on every trade.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-[#0FF1CE]"></span>
                      <span className="text-gray-300">Keep total risk <em>below</em> 2% to leave room for fees and slippage.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-[#0FF1CE]"></span>
                      <span className="text-gray-300">Avoid trading during high-impact news or illiquid times unless you fully understand the risk.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-[#0FF1CE]"></span>
                      <span className="text-gray-300">Monitor your trades actively — do not leave positions unmanaged.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-[#0FF1CE]"></span>
                      <span className="text-gray-300">Trade conservatively to protect your funded capital and qualify for payouts.</span>
                    </li>
                  </ul>
                </div>

                {/* Monitoring & Enforcement */}
                <div className="bg-[#1A1A1A] rounded-lg p-6 border border-[#2F2F2F]/50">
                  <h4 className="text-lg font-bold text-white mb-4 flex items-center">
                    <span className="text-[#0FF1CE] mr-2"></span>How We Monitor & Enforce
                  </h4>
                  <div className="space-y-4">
                    <p className="text-gray-300">We track your open risk and your daily drawdown in real time.</p>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#0FF1CE] mt-2"></div>
                        <span className="text-gray-300">If your total open risk exceeds 2% across all trades, you are in violation.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#0FF1CE] mt-2"></div>
                        <span className="text-gray-300">If you lose 2% or more in a single day, our risk team will closely monitor and review all subsequent trades to ensure no positions exceed the 2% maximum risk exposure.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#0FF1CE] mt-2"></div>
                        <span className="text-gray-300">If you hit the 8% daily drawdown limit, your account will be breached immediately.</span>
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
                <div className="bg-gradient-to-r from-[#0FF1CE]/10 to-[#0FF1CE]/5 rounded-lg p-6 border border-[#0FF1CE]/20 text-center">
                  <p className="text-white font-bold text-lg">
                    Stay disciplined, manage your exposure wisely, and protect your funded account to keep earning payouts like a professional.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#0FF1CE]/10 flex items-center justify-center mt-1">
                    <span className="text-[#0FF1CE]">✓</span>
                  </div>
                  <div className="text-gray-300">
                    <span className="text-white font-medium">Gambling Behaviour:</span> Gambling behaviour is defined as a trader not trading with a profitable strategy but rather trying to take advantage of our high drawdowns/leverages for a quick payout. We are looking for consistent profitable traders not gamblers. Our drawdowns and leverage are made to give real profitable traders more breathing room not for gamblers to hike one position and hope for the best. Gambling activity will result in a failure of your funded account and forfeit of all generated profits with no potential for a refund.
                  </div>
                </div>

                <div className="ml-9 mt-4">
                  <p className="text-white font-medium mb-3">Behaviours on our funded account that get investigated for gambling activity:</p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#0FF1CE]"></div>
                      <span className="text-gray-300">Drastically increasing lot sizes.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#0FF1CE]"></div>
                      <span className="text-gray-300">No defined stop losses.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#0FF1CE]"></div>
                      <span className="text-gray-300">Making more than 6% on a single trading day</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#0FF1CE]"></div>
                      <span className="text-gray-300">Having a losing day of 5%+ on a single trading day and making an additional 10%+ on the next trading day or two.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Section: Withdrawal Structure */}
          <div className="relative bg-[#0D0D0D]/80 backdrop-blur-sm rounded-2xl p-8 border border-[#2F2F2F]/50">
            <h2 className="text-2xl md:text-3xl font-bold text-[#0FF1CE] mb-6">Withdrawal Structure</h2>
            <p className="text-gray-300 leading-relaxed mb-8">
              Our withdrawal system is designed to reward consistent, disciplined trading while maintaining operational sustainability. All funded accounts must adhere to our trading rules and meet specific criteria before becoming eligible for withdrawals.
            </p>

            <div className="space-y-12">
              {/* Simulated Funded Accounts */}
              <div>
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <span className="text-[#0FF1CE] mr-2">90%</span> Profit Split — Simulated Funded Accounts
                </h3>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-[#0FF1CE]/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-[#0FF1CE] font-medium">1</span>
                    </div>
                    <div>
                      <h4 className="text-white font-medium mb-2">Initial Withdrawal Period</h4>
                      <p className="text-gray-300">
                        First withdrawal becomes available 14 days after your first trade. Subsequent withdrawals follow a 14-day cycle, subject to the monthly withdrawal cap.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-[#0FF1CE]/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-[#0FF1CE] font-medium">2</span>
                    </div>
                    <div>
                      <h4 className="text-white font-medium mb-2">Minimum Profitable Days</h4>
                      <p className="text-gray-300">
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
                      <p className="text-gray-300">
                        Maximum withdrawal of $10,000 per month after profit split. This applies regardless of account size or total profits generated. Each withdrawal requires meeting the minimum profitable days criterion again.
                      </p>
                    </div>
                  </div>

                  <div className="bg-[#0FF1CE]/5 rounded-lg p-4 border border-[#0FF1CE]/20">
                    <p className="text-gray-300 text-sm">
                      <span className="text-white font-medium">Important:</span> After 3 successful withdrawals, traders undergo strategy analysis for potential transition to Live Copy Trading. Any remaining profits in simulated accounts are forfeited during transition. This transition is mandatory for continued program participation.
                    </p>
                  </div>

                  <div className="mt-6 bg-[#1A1A1A] rounded-lg p-6 border border-[#2F2F2F]/50">
                    <h4 className="text-white font-medium mb-3">Example Scenario</h4>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      A trader operating a $100,000 simulated funded account generates $30,000 in profits over 10 trading days. Here's how the withdrawal process works:
                    </p>
                    <ul className="mt-3 space-y-2">
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#0FF1CE] mt-2"></div>
                        <span className="text-gray-300 text-sm">Must wait 14 days from first trade before initial withdrawal</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#0FF1CE] mt-2"></div>
                        <span className="text-gray-300 text-sm">Requires 5 minimum profitable days (0.5% daily gain) for first $10,000 withdrawal</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#0FF1CE] mt-2"></div>
                        <span className="text-gray-300 text-sm">After first withdrawal, needs another 5 profitable days before next month's $10,000 withdrawal</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#0FF1CE] mt-2"></div>
                        <span className="text-gray-300 text-sm">Even if 5 profitable days are achieved early, must wait for monthly withdrawal cap to reset</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Live Copy Trading Accounts */}
              <div>
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <span className="text-[#0FF1CE] mr-2">95%</span> Profit Split — Live Copy Trading Accounts
                </h3>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-[#0FF1CE]/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-[#0FF1CE] font-medium">1</span>
                    </div>
                    <div>
                      <h4 className="text-white font-medium mb-2">Extended Initial Period</h4>
                      <p className="text-gray-300">
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
                      <p className="text-gray-300">
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
                      <p className="text-gray-300">
                        No withdrawal cap applies — all profits are available for withdrawal once performance criteria are met. This reflects direct connection to live market profits.
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 bg-[#1A1A1A] rounded-lg p-6 border border-[#2F2F2F]/50">
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
          <div className="relative bg-[#0D0D0D]/80 backdrop-blur-sm rounded-2xl p-8 border border-[#2F2F2F]/50">
            <h2 className="text-2xl md:text-3xl font-bold text-[#0FF1CE] mb-6">Execution Logic</h2>
            <p className="text-gray-300 leading-relaxed">
              Simulated accounts use real-time market data. Execution latency and slippage mimic live prime brokerage conditions. This keeps our copy trading smooth, honest, and predictable.
            </p>
          </div>

          {/* Section 7: No Hidden Rules */}
          <div className="relative bg-[#0D0D0D]/80 backdrop-blur-sm rounded-2xl p-8 border border-[#2F2F2F]/50">
            <h2 className="text-2xl md:text-3xl font-bold text-[#0FF1CE] mb-6">No Hidden Rules</h2>
            <p className="text-gray-300 leading-relaxed mb-2">
              We justify every rule. If we impose a restriction, we explain it. Trust comes from transparency — and we don't expect it, we earn it.
            </p>
            <div>
              <p className="text-gray-300 mb-4">
                Here's something no other firm does: we explain every rule we enforce. If we ask you not to trade during NFP, you'll see why. If we require 5 minimum trading days, we'll explain the data behind that.
              </p>

              <h4 className="text-white font-medium mb-2">We thorughly break down:</h4>
              <ul className="space-y-2 mb-4">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#0FF1CE]"></div>
                  <span className="text-gray-300">Challenge Rules</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#0FF1CE]"></div>
                  <span className="text-gray-300">Funded Account Requirements</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#0FF1CE]"></div>
                  <span className="text-gray-300">Copy Trading Constraints</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#0FF1CE]"></div>
                  <span className="text-gray-300">Risk/Execution Logic</span>
                </li>
              </ul>

              <p className="text-gray-300 italic">
                "The moment a firm hides its rules, it's no longer a partner — it's a trap." - Shockwave
              </p>
            </div>
          </div>

          {/* Section 8: Why We're Different */}
          <div className="relative bg-[#0D0D0D]/80 backdrop-blur-sm rounded-2xl p-8 border border-[#2F2F2F]/50">
            <h2 className="text-2xl md:text-3xl font-bold text-[#0FF1CE] mb-6">Why We're Different</h2>
            <div className="grid grid-cols-2 gap-4">
              
              <div className="text-gray-300">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="text-left text-gray-300 pb-4 pr-8">Topic</th>
                      <th className="text-left text-gray-300 pb-4 px-8">Shockwave</th>
                      <th className="text-left text-gray-300 pb-4 pl-8">Other Firms</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="py-2 pr-8">Copy Trades to Live Capital</td>
                      <td className="text-[#0FF1CE] px-8">✓ Yes</td>
                      <td className="text-red-500 pl-8">✗ Rare</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-8">Explain Every Rule</td>
                      <td className="text-[#0FF1CE] px-8">✓ Full Justification</td>
                      <td className="text-red-500 pl-8">✗ Vague/Hidden</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-8">Reserve-Backed Payouts</td>
                      <td className="text-[#0FF1CE] px-8">✓ $800k+</td>
                      <td className="text-red-500 pl-8">✗ Fee-Driven</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-8">No Gimmicks</td>
                      <td className="text-[#0FF1CE] px-8">✓ Straight Talk</td>
                      <td className="text-red-500 pl-8">✗ Gamified</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-8">Long-Term Trader Model</td>
                      <td className="text-[#0FF1CE] px-8">✓ Sustainable</td>
                      <td className="text-red-500 pl-8">✗ Churn & Burn</td>
                    </tr>
                  </tbody>
                </table>
              </div>

            </div>
          </div>

          {/* Section 9: Transparency in Action */}
          <div className="relative bg-[#0D0D0D]/80 backdrop-blur-sm rounded-2xl p-8 border border-[#2F2F2F]/50">
            <h2 className="text-2xl md:text-3xl font-bold text-[#0FF1CE] mb-6">Transparency in Action</h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#0FF1CE]/10 flex items-center justify-center mt-1">
                  <span className="text-[#0FF1CE]">✓</span>
                </div>
                <span className="text-gray-300">Reserve balance reports</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#0FF1CE]/10 flex items-center justify-center mt-1">
                  <span className="text-[#0FF1CE]">✓</span>
                </div>
                <span className="text-gray-300">Payout receipt snapshots</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#0FF1CE]/10 flex items-center justify-center mt-1">
                  <span className="text-[#0FF1CE]">✓</span>
                </div>
                <span className="text-gray-300">Performance metrics from copy trading</span>
              </li>
            </ul>
          </div>

          {/* CTA Section */}
          <div className="relative bg-[#0D0D0D]/80 backdrop-blur-sm rounded-2xl p-12 border border-[#2F2F2F]/50 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Start Your Journey?</h2>
            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
              Join the next generation of funded traders. No hidden rules, no surprises — just pure trading potential.
            </p>
            <Link 
              href="/challenge"
              className="inline-flex items-center gap-2 bg-[#0FF1CE] text-black px-8 py-4 rounded-lg font-bold text-lg hover:scale-105 transition-transform"
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