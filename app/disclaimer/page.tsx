'use client';
import React from 'react';

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0D0D0D] via-[#121212] to-[#151515] text-white">
      <div className="relative px-6 py-16 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[#0FF1CE]/[0.02] background-noise"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full md:w-3/4 h-full rounded-full bg-[#0FF1CE]/[0.03] blur-[150px] opacity-60"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-[#0FF1CE] mb-8">Disclaimer</h1>
          <p className="text-gray-300 mb-8">Effective Date: May 17th 2025</p>

          <div className="space-y-8 text-gray-300">
            <section className="space-y-4">
              <p>Shockwave Capital provides access to a simulated trading environment designed for educational and skill assessment purposes only. By using this website or participating in any of our challenges or services, you agree to the terms outlined in this disclaimer.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">1. Simulated Trading Environment</h2>
              <p>All accounts provided through Shockwave Capital are demo accounts operating within a simulated trading environment. While real-time market data is used, no actual capital is traded by participants. Any reference to:</p>
              <div className="bg-[#1A1A1A] p-6 rounded-lg border border-[#2F2F2F]/50 space-y-2">
                <p className="text-[#0FF1CE]">"Funding"</p>
                <p className="text-[#0FF1CE]">"Capital"</p>
                <p className="text-[#0FF1CE]">"Payouts"</p>
                <p className="text-[#0FF1CE]">"Profit splits"</p>
                <p className="text-[#0FF1CE]">or similar terms</p>
              </div>
              <p>refers exclusively to simulated performance-based evaluations and does not involve deposits, investments, or transfers of real funds.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">2. No Investment or Brokerage Services</h2>
              <p>Shockwave Capital is not a broker-dealer, financial advisor, or asset manager, and does not offer:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Investment advice or portfolio recommendations</li>
                <li>Financial products or instruments</li>
                <li>Securities trading or custody services</li>
              </ul>
              <p className="mt-4">Participation in any challenge or funded simulation does not constitute a securities offering or investment opportunity.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">3. Risk Warning</h2>
              <p>Trading foreign exchange, futures, and leveraged financial instruments carries significant risk and may not be suitable for all participants. While our simulations are risk-free in terms of actual capital, the strategies used carry theoretical risk that reflects real-world conditions.</p>
              <p className="mt-4">Shockwave Capital makes no guarantees regarding the outcomes of trading simulations or future success in real markets.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">4. Performance & Results</h2>
              <p>All references to trading performance, profit percentages, or historical returns are hypothetical and for illustrative purposes only. Past performance does not guarantee future results, and any implied earnings are part of a simulated environment without financial gain or loss to participants.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">5. Use of Platform</h2>
              <p>By signing up or logging in, you:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Acknowledge that you are not engaging in real-money trading</li>
                <li>Understand that any promotional or performance-based rewards are discretionary and subject to strict compliance with our rules</li>
                <li>Agree to abide by all rules, terms, and disclaimers published across this platform</li>
              </ul>
            </section>

            <section className="space-y-4 bg-[#1A1A1A] p-6 rounded-lg border border-[#2F2F2F]/50">
              <p className="font-medium text-[#0FF1CE]">Important Notice</p>
              <p>If you do not agree with this disclaimer or any related terms, do not proceed to use our services.</p>
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