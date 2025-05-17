'use client';
import React from 'react';
import { Mail } from 'lucide-react';

export default function SupportCenterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0D0D0D] via-[#121212] to-[#151515] text-white">
      <div className="relative px-6 py-16 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[#0FF1CE]/[0.02] background-noise"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full md:w-3/4 h-full rounded-full bg-[#0FF1CE]/[0.03] blur-[150px] opacity-60"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-[#0FF1CE] mb-8">Support Center</h1>
          
          <div className="space-y-12">
            {/* Main Contact Card */}
            <div className="bg-gradient-to-br from-[#0FF1CE]/10 to-[#0FF1CE]/5 backdrop-blur-sm rounded-xl p-8 border border-[#0FF1CE]/20">
              <div className="flex flex-col items-center text-center space-y-6">
                <div className="w-16 h-16 rounded-full bg-[#0FF1CE]/10 flex items-center justify-center">
                  <Mail className="w-8 h-8 text-[#0FF1CE]" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">Email Support</h2>
                  <p className="text-gray-300 mb-4">Our support team is available 24/7 to assist you</p>
                  <a href="mailto:support@shockwave-capital.com" className="text-xl font-bold text-[#0FF1CE] hover:underline">
                    support@shockwave-capital.com
                  </a>
                </div>
              </div>
            </div>

            {/* Support Hours */}
            <section className="space-y-6">
              <h2 className="text-2xl font-bold text-white">Support Hours</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-[#0FF1CE]/10 to-[#0FF1CE]/5 backdrop-blur-sm rounded-xl p-6">
                  <h3 className="text-lg font-bold text-[#0FF1CE] mb-2">Email Response Time</h3>
                  <p className="text-gray-300">We aim to respond to all inquiries within 2-4 hours during business days.</p>
                </div>
                <div className="bg-gradient-to-br from-[#0FF1CE]/10 to-[#0FF1CE]/5 backdrop-blur-sm rounded-xl p-6">
                  <h3 className="text-lg font-bold text-[#0FF1CE] mb-2">Business Hours</h3>
                  <p className="text-gray-300">Monday - Friday: 24/7<br />Weekend: Limited Support</p>
                </div>
              </div>
            </section>

            {/* Common Support Topics */}
            <section className="space-y-6">
              <h2 className="text-2xl font-bold text-white">Common Support Topics</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    title: "Account Issues",
                    topics: ["Login problems", "Account verification", "Password reset", "2FA setup"]
                  },
                  {
                    title: "Trading Platform",
                    topics: ["Platform access", "Trading rules", "Technical issues", "Market access"]
                  },
                  {
                    title: "Payments & Withdrawals",
                    topics: ["Payment methods", "Withdrawal process", "Fee structure", "Payment issues"]
                  },
                  {
                    title: "Challenge & Evaluation",
                    topics: ["Challenge rules", "Evaluation process", "Results verification", "Account metrics"]
                  }
                ].map((category) => (
                  <div key={category.title} className="bg-gradient-to-br from-[#0FF1CE]/10 to-[#0FF1CE]/5 backdrop-blur-sm rounded-xl p-6">
                    <h3 className="text-lg font-bold text-[#0FF1CE] mb-4">{category.title}</h3>
                    <ul className="space-y-2 text-gray-300">
                      {category.topics.map((topic) => (
                        <li key={topic} className="flex items-center">
                          <span className="w-1.5 h-1.5 bg-[#0FF1CE] rounded-full mr-2"></span>
                          {topic}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            {/* Important Notice */}
            <div className="bg-gradient-to-br from-[#0FF1CE]/10 to-[#0FF1CE]/5 backdrop-blur-sm rounded-xl p-6 text-center">
              <p className="text-gray-300">
                For urgent matters or time-sensitive issues, please include "URGENT" in your email subject line.
                Our team prioritizes responses based on the nature and urgency of the inquiry.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 