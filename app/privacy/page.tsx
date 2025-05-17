'use client';
import React from 'react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0D0D0D] via-[#121212] to-[#151515] text-white">
      <div className="relative px-6 py-16 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[#0FF1CE]/[0.02] background-noise"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full md:w-3/4 h-full rounded-full bg-[#0FF1CE]/[0.03] blur-[150px] opacity-60"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-[#0FF1CE] mb-8">Privacy Policy</h1>
          
          <div className="space-y-8 text-gray-300">
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">1. Information We Collect</h2>
              <p>1.1. Personal Information:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Name and contact information</li>
                <li>Trading experience and history</li>
                <li>Financial information for payouts</li>
                <li>Government-issued identification for KYC</li>
                <li>Communication records</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">2. How We Use Your Information</h2>
              <p>2.1. We use your information to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide and maintain our trading services</li>
                <li>Process payments and withdrawals</li>
                <li>Verify your identity and prevent fraud</li>
                <li>Communicate important updates</li>
                <li>Improve our services and user experience</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">3. Data Security</h2>
              <p>3.1. We implement robust security measures to protect your data.</p>
              <p>3.2. All sensitive information is encrypted using industry-standard protocols.</p>
              <p>3.3. Regular security audits are conducted to maintain data integrity.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">4. Information Sharing</h2>
              <p>4.1. We may share your information with:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Payment processors for transactions</li>
                <li>Regulatory authorities when required</li>
                <li>Service providers who assist our operations</li>
              </ul>
              <p>4.2. We never sell your personal information to third parties.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">5. Trading Data</h2>
              <p>5.1. We collect and analyze trading data to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Monitor compliance with trading rules</li>
                <li>Detect and prevent fraudulent activity</li>
                <li>Calculate profit sharing and payouts</li>
                <li>Improve our risk management systems</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">6. Your Rights</h2>
              <p>6.1. You have the right to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Access your personal data</li>
                <li>Request data correction or deletion</li>
                <li>Opt-out of marketing communications</li>
                <li>Request data portability</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">7. Cookies and Tracking</h2>
              <p>7.1. We use cookies and similar technologies to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Maintain your session security</li>
                <li>Remember your preferences</li>
                <li>Analyze platform usage</li>
                <li>Improve user experience</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">8. Contact Us</h2>
              <p>For any privacy-related inquiries, please contact us at:</p>
              <p className="text-[#0FF1CE]">support@shockwave-capital.com</p>
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