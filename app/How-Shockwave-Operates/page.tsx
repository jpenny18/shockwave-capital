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
            <p className="text-gray-300 leading-relaxed">
              Challenge fees fund operations and our growing reserve pool (currently $800k+). Funded traders operate on simulated accounts and are copy traded to live capital accounts backed by us. Payouts come from the reserve if needed and live profits — rarely from new challenges.
            </p>
            <div className="space-y-6">
              <div>
                <h3 className="text-white font-medium mb-2">Challenge Fees</h3>
                <p className="text-gray-300">
                  We charge an upfront fee for each evaluation challenge. These are not used to pay trader profits directly — they fund our business operations and contribute to a growing reserve pool.
                </p>
              </div>

              <div>
                <h3 className="text-white font-medium mb-2">$800,000+ Reserve Pool</h3>
                <p className="text-gray-300">
                  We maintain a dedicated reserve for trader payouts — currently sitting at $800,000 and climbing. This is not a marketing number. It exists to ensure we rarely rely on new challenge fees to pay current traders.
                </p>
              </div>

              <div>
                <h3 className="text-white font-medium mb-2">Live Copy Trading</h3>
                <p className="text-gray-300">
                  Your trades are executed in simulated demo environments, but your trades are copied 1:1 to live capital accounts. Profits generated from those live trades cover real payouts. This is how we scale and sustain — real capital, real profits.
                </p>
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
                    <span className="text-gray-300">Minimum profitable days: 4 — ensures consistent trading, not flukes</span>
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
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#0FF1CE]/10 flex items-center justify-center mt-1">
                    <span className="text-[#0FF1CE]">✓</span>
                  </div>
                  <span className="text-gray-300">
                    <span className="text-white font-medium">Max Position Risk: 2%</span> - Ensures traders are not gambling and know how effectively manage risk while generating consistent profits.
                  </span>
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