'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import Particles from '../../components/Particles';
import Header from '../../components/Header';

export default function GauntletActivationPendingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user && !loading) {
        router.push('/access');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router, loading]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0D0D0D]">
        <div className="w-8 h-8 border-4 border-[#FF6B6B] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-[#0D0D0D] via-[#121212] to-[#151515] text-white min-h-screen font-sans">
      <Header />
      
      {/* Hero Section */}
      <section className="relative px-4 md:px-6 pt-24 md:pt-40 pb-16 md:pb-32 text-center overflow-hidden bg-gradient-to-b from-[#121212] to-[#131313]">
        <div className="absolute top-0 left-0 w-full h-full bg-[#FF6B6B]/[0.02] background-noise"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full md:w-3/4 h-full rounded-full bg-[#FF6B6B]/[0.03] blur-[150px] opacity-60"></div>
        <Particles />
        
        <div className="relative z-10 max-w-4xl mx-auto">
          {/* Success Icon */}
          <div className="mx-auto w-24 h-24 bg-gradient-to-br from-[#FF6B6B] to-[#EE5A24] rounded-full flex items-center justify-center mb-8">
            <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-[#FF6B6B] mb-4 md:mb-6">
            🔥 Activation Complete!
          </h1>
          
          <p className="text-base md:text-lg lg:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8">
            Your Gauntlet account activation payment has been received! We're now setting up your simulated funded account with zero trading restrictions.
          </p>

          {/* Status Card */}
          <div className="max-w-2xl mx-auto bg-gradient-to-br from-[#FF6B6B]/10 to-[#EE5A24]/5 backdrop-blur-sm rounded-2xl p-8 border border-[#FF6B6B]/20 mb-8">
            <h2 className="text-2xl font-bold text-[#FF6B6B] mb-6">What happens next?</h2>
            
            <div className="space-y-4 text-left">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-[#FF6B6B] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white font-bold text-sm">1</span>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Account Setup (2-4 hours)</h3>
                  <p className="text-gray-400 text-sm">We're configuring your simulated funded account with the exact parameters from your Gauntlet challenge.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-[#FF6B6B] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white font-bold text-sm">2</span>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Login Credentials Sent</h3>
                  <p className="text-gray-400 text-sm">You'll receive your MT4/MT5 login details via email within 4 hours during business hours.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-[#FF6B6B] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white font-bold text-sm">3</span>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Start Trading</h3>
                  <p className="text-gray-400 text-sm">Begin trading with zero restrictions, news trading allowed, weekend holding permitted.</p>
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
              <div key={index} className="bg-gradient-to-br from-[#FF6B6B]/20 to-[#EE5A24]/10 rounded-xl p-4 text-center">
                <div className="text-[#FF6B6B] font-bold text-xl">{item.value}</div>
                <div className="text-gray-300 text-sm">{item.label}</div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push('/dashboard')}
              className="px-8 py-4 bg-gradient-to-r from-[#FF6B6B] to-[#EE5A24] text-white text-lg font-bold rounded-xl hover:scale-105 transition-transform"
            >
              Go to Dashboard
            </button>
            <button
              onClick={() => router.push('/support-center')}
              className="px-8 py-4 bg-transparent border-2 border-[#FF6B6B] text-[#FF6B6B] text-lg font-bold rounded-xl hover:bg-[#FF6B6B]/10 transition-colors"
            >
              Contact Support
            </button>
          </div>

          <p className="text-sm text-gray-400 mt-6">
            🔥 Welcome to the ultimate trading experience - no limits, no restrictions, just pure trading freedom.
          </p>
        </div>
      </section>

      <style jsx global>{`
        .background-noise {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 250 250' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E");
          opacity: 0.15;
        }
      `}</style>
    </div>
  );
}
