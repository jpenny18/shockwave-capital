'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Particles from '../../components/Particles';
import { Lock, Plus } from 'lucide-react';

export default function MyAccountsPage() {
  const router = useRouter();

  const handleStartChallenge = () => {
    router.push('/dashboard/challenge');
  };
  
  return (
    <div className="relative min-h-screen">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full bg-[#0FF1CE]/[0.02] background-noise"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full md:w-3/4 h-full rounded-full bg-[#0FF1CE]/[0.03] blur-[150px] opacity-60"></div>
      <Particles />

      {/* Blurred placeholder content */}
      <div className="relative blur-sm pointer-events-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Placeholder cards to show blurred in background */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-[#0D0D0D]/80 backdrop-blur-sm rounded-2xl p-6 border border-[#2F2F2F]/50 h-64" />
            ))}
          </div>
        </div>
        </div>

      {/* Locked content overlay */}
      <div className="absolute inset-0 flex items-center justify-center z-20">
        <div className="bg-[#0D0D0D]/95 backdrop-blur-sm rounded-2xl p-8 border border-[#2F2F2F]/50 max-w-md w-full mx-4 text-center transform hover:scale-[1.02] transition-all duration-300">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#0FF1CE]/10 flex items-center justify-center">
            <Lock className="text-[#0FF1CE]" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Account Metrics Locked</h2>
          <p className="text-gray-400 mb-6">
            See your account metrics and performance analytics after purchasing a challenge. Start your journey to becoming a funded trader today.
          </p>
          <button 
            onClick={handleStartChallenge}
            className="bg-[#0FF1CE] text-black font-bold py-3 px-6 rounded-lg hover:bg-[#0FF1CE]/90 transition-colors inline-flex items-center gap-2"
          >
            Start New Challenge
            <Plus size={20} />
          </button>
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
