'use client';

import React from 'react';
import Link from 'next/link';
import { Check, Clock, Mail } from 'lucide-react';
import Particles from '@/app/components/Particles';
import Header from '@/app/components/Header';

export default function FundPendingPage() {
  return (
    <div className="bg-black text-white min-h-screen font-sans relative overflow-hidden">
      <Header />
      <Particles />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="text-center space-y-8">
          {/* Success Icon */}
          <div className="inline-block p-6 bg-[#0FF1CE]/10 rounded-full">
            <Clock size={64} className="text-[#0FF1CE]" />
          </div>

          {/* Main Heading */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white">
              Payment Submitted Successfully
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Your funded account allocation is being processed
            </p>
          </div>

          {/* Status Card */}
          <div className="max-w-2xl mx-auto bg-gradient-to-br from-[#0FF1CE]/10 to-[#0FF1CE]/5 backdrop-blur-sm rounded-2xl p-8 border border-[#0FF1CE]/20">
            <div className="space-y-6">
              <div className="flex items-start gap-4 text-left">
                <div className="p-2 bg-[#0FF1CE]/20 rounded-lg mt-1">
                  <Check size={24} className="text-[#0FF1CE]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">Application Received</h3>
                  <p className="text-gray-400 text-sm">
                    We've received your fund trader application and payment submission. Our team is currently reviewing your details.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 text-left">
                <div className="p-2 bg-yellow-400/20 rounded-lg mt-1">
                  <Clock size={24} className="text-yellow-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">Payment Verification</h3>
                  <p className="text-gray-400 text-sm">
                    We're verifying your crypto payment. This typically takes 15-30 minutes depending on network confirmation times.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 text-left">
                <div className="p-2 bg-blue-400/20 rounded-lg mt-1">
                  <Mail size={24} className="text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">Next Steps</h3>
                  <p className="text-gray-400 text-sm">
                    Once verified, you'll receive an email with your funded account credentials and access instructions within 24-48 hours.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Information Boxes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <div className="bg-[#0d1117] rounded-xl p-6 border border-[#2F2F2F]/50 text-left">
              <h3 className="text-lg font-bold text-[#0FF1CE] mb-3">What Happens Next?</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="text-[#0FF1CE] mt-1">•</span>
                  <span>Payment verification (15-30 min)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#0FF1CE] mt-1">•</span>
                  <span>Application review by our team</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#0FF1CE] mt-1">•</span>
                  <span>MetaTrader account setup</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#0FF1CE] mt-1">•</span>
                  <span>Credentials sent to your email</span>
                </li>
              </ul>
            </div>

            <div className="bg-[#0d1117] rounded-xl p-6 border border-[#2F2F2F]/50 text-left">
              <h3 className="text-lg font-bold text-[#0FF1CE] mb-3">Need Help?</h3>
              <p className="text-sm text-gray-400 mb-4">
                If you have any questions or concerns about your application:
              </p>
              <Link 
                href="/support-center"
                className="inline-block bg-[#0FF1CE]/10 hover:bg-[#0FF1CE]/20 text-[#0FF1CE] px-4 py-2 rounded-lg transition-colors text-sm font-medium"
              >
                Contact Support
              </Link>
            </div>
          </div>

          {/* Important Notice */}
          <div className="max-w-2xl mx-auto bg-orange-500/10 border border-orange-500/30 rounded-xl p-6 text-left">
            <h3 className="text-lg font-bold text-orange-400 mb-2">📧 Check Your Email</h3>
            <p className="text-sm text-gray-300">
              Make sure to check your spam/junk folder for our emails. Add{' '}
              <span className="text-white font-mono">support@shockwave-capital.com</span> to your contacts to ensure you receive all updates.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="px-8 py-4 bg-[#0FF1CE] text-black text-lg font-bold rounded-xl hover:scale-105 transition-all duration-300"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
