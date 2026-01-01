'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import Particles from '../../components/Particles';
import Header from '../../components/Header';

export default function NYEActivationPendingPage() {
  const router = useRouter();

  return (
    <div className="bg-black text-white min-h-screen font-sans">
      <Header />
      
      {/* Hero Section */}
      <section className="relative z-10 px-4 md:px-6 pt-24 md:pt-32 pb-16 text-center overflow-hidden bg-black">
        {/* Glowing Cyan Orbs */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-[#0FF1CE]/20 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-40 right-10 w-80 h-80 bg-[#0FF1CE]/15 rounded-full blur-[120px] pointer-events-none"></div>
        <Particles />
        
        <div className="relative z-10 max-w-4xl mx-auto">
          {/* Success Icon */}
          <div className="mx-auto w-24 h-24 bg-gradient-to-br from-[#0FF1CE] to-[#00D9FF] rounded-full flex items-center justify-center mb-8">
            <svg className="w-12 h-12 text-black" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4">
            Activation Complete
          </h1>
          
          <p className="text-base md:text-lg text-gray-400 max-w-3xl mx-auto leading-relaxed mb-8">
            Your NYE funded account activation payment has been received! We're now setting up your instant funded account with zero trading restrictions. Welcome to 2026!
          </p>

          {/* Status Card */}
          <div className="max-w-2xl mx-auto bg-[#0d1117] rounded-2xl p-8 border border-[#0FF1CE]/20 mb-8">
            <h2 className="text-2xl font-bold text-[#0FF1CE] mb-6">What happens next?</h2>
            
            <div className="space-y-4 text-left">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-[#0FF1CE] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-black font-bold text-sm">1</span>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Account Setup (2-4 hours)</h3>
                  <p className="text-gray-400 text-sm">We're configuring your instant funded account on your selected platform with zero restrictions.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-[#0FF1CE] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-black font-bold text-sm">2</span>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Login Credentials Sent</h3>
                  <p className="text-gray-400 text-sm">You'll receive your MT4/MT5 login details via email within 4 hours during business hours.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-[#0FF1CE] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-black font-bold text-sm">3</span>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Start Trading</h3>
                  <p className="text-gray-400 text-sm">Begin trading with zero restrictions, news trading allowed, weekend holding permitted, and unlimited potential!</p>
                </div>
              </div>
            </div>
          </div>

          {/* Features Highlight */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Max DD", value: "15%" },
              { label: "Daily DD", value: "8%" },
              { label: "Leverage", value: "1:200" },
              { label: "Restrictions", value: "None" }
            ].map((item, index) => (
              <div key={index} className="bg-[#0d1117] rounded-xl p-4 text-center border border-gray-800">
                <div className="text-[#0FF1CE] font-bold text-xl">{item.value}</div>
                <div className="text-gray-400 text-sm">{item.label}</div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push('/dashboard')}
              className="px-10 py-3 bg-[#0FF1CE] text-black text-base md:text-lg font-bold rounded-lg hover:bg-[#0AA89E] transition-all duration-300"
            >
              Go to Dashboard
            </button>
            <button
              onClick={() => router.push('/support-center')}
              className="px-10 py-3 bg-transparent border-2 border-[#0FF1CE] text-[#0FF1CE] text-base md:text-lg font-bold rounded-lg hover:bg-[#0FF1CE]/10 transition-colors"
            >
              Contact Support
            </button>
          </div>

          <p className="text-sm text-gray-400 mt-6">
            Welcome to 2026 with your new funded account - no limits, no restrictions, just pure trading freedom.
          </p>
        </div>
      </section>
    </div>
  );
}

