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
          <p className="text-gray-300 mb-8">Effective Date: May 17th 2025</p>

          <div className="space-y-8 text-gray-300">
            <section className="space-y-4">
              <p>Shockwave Capital ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">1. Information We Collect</h2>
              <p>We collect the following types of personal information:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><span className="font-medium">Account Information:</span> Full name, email address, username, and password.</li>
                <li><span className="font-medium">KYC/AML Compliance:</span> Government-issued ID, proof of residence, and other documents for verification purposes.</li>
                <li><span className="font-medium">Payment Information:</span> Collected and processed securely via our third-party payment processors (e.g., Stripe, Paddle). We do not store card details on our servers.</li>
                <li><span className="font-medium">Usage Data:</span> IP address, browser type, access times, device type, and pages visited.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">2. How We Use Your Information</h2>
              <p>We use the data we collect to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide and manage our services</li>
                <li>Verify your identity and eligibility</li>
                <li>Enforce our terms and rules</li>
                <li>Communicate with you about updates, promotions, and service notices</li>
                <li>Ensure compliance with legal obligations and fraud prevention</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">3. Data Sharing</h2>
              <p>We do not sell your personal data. Your information may be shared with:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Payment processors for billing purposes</li>
                <li>Regulatory bodies if required by law</li>
                <li>Internal tools and platforms for service delivery (e.g., CRM, analytics)</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">4. Data Retention</h2>
              <p>We retain personal data only for as long as necessary to fulfill legal and operational purposes, including KYC retention guidelines and regulatory compliance.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">5. Your Rights</h2>
              <p>You may request:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Access to your personal data</li>
                <li>Correction or deletion of your data</li>
                <li>Opt-out of marketing emails</li>
              </ul>
              <p className="mt-4">For requests, contact: <a href="mailto:support@shockwave-capital.com" className="text-[#0FF1CE] hover:underline">support@shockwave-capital.com</a></p>
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