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
          <p className="text-gray-300 mb-8">Effective Date: May 17th 2025</p>
          
          <div className="space-y-8 text-gray-300">
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">1. Acceptance of Terms</h2>
              <p>By accessing, registering, or participating in any program offered by Shockwave Capital, you expressly agree to abide by these Terms of Service ("Terms"). If you do not agree with any part of these Terms, you must not use our services.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">2. Nature of Services</h2>
              <p>2.1. Shockwave Capital provides access to simulated trading programs designed for educational and evaluation purposes only. No real capital is allocated or traded by participants.</p>
              <p>2.2. All references to "funded accounts," "capital," or "payouts" relate strictly to simulated environments and are not indicative of actual financial assets or investment opportunities.</p>
              <p>2.3. Participation in any program does not establish a brokerage relationship, fiduciary responsibility, or financial advisory service.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">3. Ownership of Simulated Capital</h2>
              <p>3.1. All simulated account balances, including those referred to as "funded," remain the exclusive property of Shockwave Capital and are subject to internal risk protocols.</p>
              <p>3.2. Users do not own or control any real capital through our programs, and no representation of actual asset transfer is made or implied.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">4. Risk Disclosure</h2>
              <p>4.1. Trading in simulated environments is for skill development and evaluation only.</p>
              <p>4.2. Performance in simulated environments does not guarantee future results in live markets.</p>
              <p>4.3. Shockwave Capital does not promise financial return, income generation, or investment success.</p>
              <p>4.4. You acknowledge that participation involves simulated risk and is not a substitute for real-market trading experience.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">5. Account Conduct and Rules</h2>
              <p>5.1. Each participant may operate only one active evaluation or simulated account at a time unless explicitly authorized.</p>
              <p>5.2. Account sharing, selling, or transferring access is strictly prohibited and will result in immediate suspension.</p>
              <p>5.3. Exploiting platform features, abusing data feeds, or engaging in strategies designed to manipulate performance metrics will lead to account termination.</p>
              <p>5.4. All trading must be conducted according to the program rules and parameters published by Shockwave Capital.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">6. Simulated Payouts and Reward Eligibility</h2>
              <p>6.1. Simulated profit splits and performance-based rewards are contingent on full rule compliance and internal review.</p>
              <p>6.2. No payout represents the transfer of real funds unless expressly stated otherwise in an official communication.</p>
              <p>6.3. Shockwave Capital reserves the right to withhold, adjust, or deny simulated payouts if users are found in breach of rules or ethical standards.</p>
              <p>6.4. Processing timelines for rewards may vary depending on verification status, review periods, and method of delivery.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">7. Termination and Suspension</h2>
              <p>7.1. Shockwave Capital reserves the right to suspend or terminate any account for violations of these Terms or internal policies.</p>
              <p>7.2. Accounts may be terminated for suspected abuse, manipulation, or any behavior deemed detrimental to the integrity of the evaluation process.</p>
              <p>7.3. Upon termination, eligibility for any pending or future simulated rewards is forfeited.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">8. Intellectual Property</h2>
              <p>8.1. All site content, program structures, trading rules, branding, and proprietary tools are owned by Shockwave Capital.</p>
              <p>8.2. Unauthorized reproduction, redistribution, or commercial use is prohibited without prior written consent.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">9. Program Modifications</h2>
              <p>9.1. Shockwave Capital may update, revise, or modify any aspect of its programs, pricing, or rules at any time with or without prior notice.</p>
              <p>9.2. Continued participation after any modification constitutes acceptance of the updated Terms.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">10. Legal Disclosures</h2>
              <p>10.1. Shockwave Capital is not a broker-dealer, financial advisor, or registered investment firm.</p>
              <p>10.2. These services are not intended as financial advice and should not be relied upon for making real-world investment decisions.</p>
              <p>10.3. Use of our platform is solely at your own discretion and risk.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">11. Governing Law</h2>
              <p>These Terms shall be governed by and construed in accordance with the laws of Canada. Any disputes shall be resolved in accordance with the dispute resolution procedures outlined in our policies or applicable local regulations.</p>
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