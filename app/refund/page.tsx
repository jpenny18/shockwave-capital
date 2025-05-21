'use client';
import React from 'react';

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0D0D0D] via-[#121212] to-[#151515] text-white">
      <div className="relative px-6 py-16 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[#0FF1CE]/[0.02] background-noise"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full md:w-3/4 h-full rounded-full bg-[#0FF1CE]/[0.03] blur-[150px] opacity-60"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-[#0FF1CE] mb-8">Refund & Chargeback Policy</h1>
          
          <div className="space-y-8 text-gray-300">
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">1. Challenge Fee Refund Policy</h2>
              <div className="bg-gradient-to-br from-[#0FF1CE]/10 to-[#0FF1CE]/5 backdrop-blur-sm rounded-xl p-6 border border-[#0FF1CE]/20">
                <p className="text-lg font-semibold text-[#0FF1CE] mb-4">Successful Challenge Refund Program</p>
                <p>Traders who successfully complete our challenge are entitled to a full refund of their challenge fee upon their second consecutive successful withdrawal on their funded account. This refund policy applies specifically to the account for which the refund is being requested.</p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">2. Refund Eligibility</h2>
              <p>2.1. To be eligible for a refund, traders must:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Successfully complete the trading challenge</li>
                <li>Maintain compliance with all trading rules</li>
                <li>Complete two consecutive successful withdrawals</li>
                <li>Submit the refund request for the specific account</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">3. Chargeback Policy</h2>
              <div className="bg-gradient-to-br from-red-500/10 to-red-500/5 backdrop-blur-sm rounded-xl p-6 border border-red-500/20">
                <p className="text-lg font-semibold text-red-400 mb-4">Strict Chargeback Consequences</p>
                <p>Any trader who initiates a chargeback will:</p>
                <ul className="list-disc pl-6 space-y-2 mt-4">
                  <li>Immediately forfeit ALL profits generated on their funded accounts</li>
                  <li>Forfeit ALL profits on any challenge accounts</li>
                  <li>Be permanently banned from our platform</li>
                  <li>Be added to our blacklist, preventing future registration</li>
                </ul>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">4. Non-Refundable Circumstances</h2>
              <p>4.1. Challenge fees are non-refundable in cases of:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Failed challenge attempts</li>
                <li>Violation of trading rules</li>
                <li>Voluntary account termination</li>
                <li>Suspicious trading activity</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">5. Refund Process</h2>
              <p>5.1. To request a refund:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Submit request through your dashboard</li>
                <li>Provide account details and withdrawal history</li>
                <li>Allow up to 5 business days for processing</li>
                <li>Refund will be issued to original payment method</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">6. Challenge Fees</h2>
              <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 backdrop-blur-sm rounded-xl p-6 border border-yellow-500/20">
                <p className="text-lg font-semibold text-yellow-400 mb-4">Important Notice</p>
                <p>Challenge or instant access fees are payment for evaluation services and simulated trading access — not investment products or deposits. Refunds are not applicable if you fail the challenge or disagree with trading rules post-purchase.</p>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">7. Subscription Cancellation</h2>
              <p>You may cancel any recurring subscriptions prior to the next billing cycle to avoid further charges. No partial refunds will be issued for unused time.</p>
              <p className="mt-4">All refund inquiries must be submitted to <span className="text-[#0FF1CE]">support@shockwave-capital.com</span> within 3 days of the transaction.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">8. Contact Information</h2>
              <p>For questions about refunds or to report unauthorized charges, contact:</p>
              <p className="text-[#0FF1CE]">support@shockwave-capital.com</p>
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