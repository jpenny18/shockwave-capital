'use client';
import React from 'react';

export default function LegalDisclosurePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0D0D0D] via-[#121212] to-[#151515] text-white">
      <div className="relative px-6 py-16 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[#0FF1CE]/[0.02] background-noise"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full md:w-3/4 h-full rounded-full bg-[#0FF1CE]/[0.03] blur-[150px] opacity-60"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-[#0FF1CE] mb-8">Legal Disclosure</h1>
          <p className="text-gray-300 mb-8">Effective Date: May 17th 2025</p>

          <div className="space-y-8 text-gray-300">
            <section className="space-y-4">
              <p>This website and service are operated by Shockwave Capital for the purpose of providing simulated trading evaluations. We are not a broker-dealer, investment advisor, or financial institution.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">1. Nature of Services</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>All accounts offered are simulated and do not involve the deposit or withdrawal of real capital by users.</li>
                <li>Payouts and profit splits are conditioned upon performance in a demo environment and are part of a skill-based evaluation process.</li>
                <li>"Funding" refers to simulated capital with mirrored live market conditions for educational and evaluation purposes only.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">2. No Investment Advice</h2>
              <p>Shockwave Capital does not provide investment advice, trading signals, portfolio management, or financial counseling. Any strategy or trading behavior displayed by users is at their own risk and discretion.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">3. No Guarantee of Earnings</h2>
              <p>Any reference to earnings, payouts, or profits represents hypothetical outcomes within a simulated environment and should not be interpreted as a promise or guarantee of actual financial gain.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">4. Regulation and Compliance</h2>
              <p>We are not regulated by any securities or financial regulatory authority. Our evaluation model is designed for skill assessment and educational purposes only.</p>
            </section>

            <section className="space-y-4 bg-[#1A1A1A] p-6 rounded-lg border border-[#2F2F2F]/50">
              <p>By using this platform, you acknowledge that you understand and accept the nature and limitations of our services.</p>
              <p className="mt-4">For more information, contact: <a href="mailto:support@shockwave-capital.com" className="text-[#0FF1CE] hover:underline">support@shockwave-capital.com</a></p>
            </section>

            <div className="pt-8">
              <p className="text-sm text-gray-400">Last updated: May 17th 2025</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 