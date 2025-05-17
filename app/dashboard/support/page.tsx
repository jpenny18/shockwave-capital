'use client';

import React from 'react';
import { Mail } from 'lucide-react';
import Particles from '../../components/Particles';

export default function SupportPage() {
  return (
    <div className="relative min-h-screen">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full bg-[#0FF1CE]/[0.02] background-noise"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full md:w-3/4 h-full rounded-full bg-[#0FF1CE]/[0.03] blur-[150px] opacity-60"></div>
      <Particles />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-[#0D0D0D]/80 backdrop-blur-sm rounded-2xl p-8 border border-[#2F2F2F]/50">
          <h1 className="text-2xl font-bold text-white mb-6">Welcome to Support</h1>
          
          <div className="flex items-start gap-4 text-gray-300">
            <Mail className="text-[#0FF1CE] mt-1" size={24} />
            <div>
              <p className="mb-4">
                Need assistance? Our support team is here to help! Please email us at:
              </p>
              <a 
                href="mailto:support@shockwave-capital.com"
                className="text-[#0FF1CE] hover:underline text-lg font-medium"
              >
                support@shockwave-capital.com
              </a>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .background-noise {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 250 250' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E");
          opacity: 0.15;
        }
      `}</style>
    </div>
  );
} 