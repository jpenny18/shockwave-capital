'use client';
import React from 'react';
import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0D0D0D] via-[#121212] to-[#151515] text-white">
      <div className="relative px-6 py-16 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[#0FF1CE]/[0.02] background-noise"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full md:w-3/4 h-full rounded-full bg-[#0FF1CE]/[0.03] blur-[150px] opacity-60"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-[#0FF1CE] mb-8">Terms of Service</h1>
          
          <div className="space-y-8 text-gray-300">
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">1. Acceptance of Terms</h2>
              <p>By accessing and using Shockwave Capital's services, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you may not use our services.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">2. Trading Challenges and Funded Accounts</h2>
              <p>2.1. Trading challenges and funded accounts are evaluation services provided by Shockwave Capital.</p>
              <p>2.2. All trading capital remains the property of Shockwave Capital.</p>
              <p>2.3. Traders must adhere to all trading rules and risk management parameters.</p>
              <p>2.4. Shockwave Capital reserves the right to modify trading rules with appropriate notice.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">3. Risk Disclosure</h2>
              <p>3.1. Trading foreign exchange and futures carries a high level of risk.</p>
              <p>3.2. Past performance is not indicative of future results.</p>
              <p>3.3. You may lose some or all of your invested capital.</p>
              <p>3.4. You should only trade with capital you can afford to lose.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">4. Account Rules</h2>
              <p>4.1. One individual may only operate one funded account at a time.</p>
              <p>4.2. Sharing or selling accounts is strictly prohibited.</p>
              <p>4.3. Manipulation of trading rules or platform features will result in immediate termination.</p>
              <p>4.4. All trading must be conducted according to our specified rules and parameters.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">5. Payouts and Profit Sharing</h2>
              <p>5.1. Profit splits are paid according to the specified schedule.</p>
              <p>5.2. Traders must maintain compliance with all rules to be eligible for payouts.</p>
              <p>5.3. Shockwave Capital reserves the right to withhold payouts in cases of rule violations.</p>
              <p>5.4. Withdrawal processing times may vary based on the chosen payment method.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">6. Termination</h2>
              <p>6.1. Shockwave Capital reserves the right to terminate any account for rule violations.</p>
              <p>6.2. Accounts may be terminated for suspicious or manipulative trading activity.</p>
              <p>6.3. Upon termination, any pending profits may be forfeited.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">7. Intellectual Property</h2>
              <p>7.1. All content and materials on our platform are property of Shockwave Capital.</p>
              <p>7.2. Unauthorized use or reproduction is strictly prohibited.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">8. Modifications</h2>
              <p>8.1. These terms may be modified at any time with notice to users.</p>
              <p>8.2. Continued use of our services constitutes acceptance of modified terms.</p>
            </section>

            <div className="pt-8">
              <p className="text-sm text-gray-400">Last updated: {new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 