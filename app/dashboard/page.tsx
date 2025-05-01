'use client';
import React from 'react';
import Particles from '../components/Particles';
import { useRouter } from 'next/navigation';

const PromotionalCard = ({ 
  title,
  description,
  features,
  image,
  buttonText
}: { 
  title: string;
  description: string;
  features: string[];
  image: string;
  buttonText: string;
}) => (
  <div className="bg-[#0D0D0D]/80 backdrop-blur-sm rounded-2xl p-6 hover:scale-[1.02] transition-all duration-300 border border-[#2F2F2F]/50">
    <img src={image} alt={title} className="w-35 h-35 mb-4" />
    <p className="text-gray-400 mb-6">{description}</p>
    
    <div className="space-y-3 mb-6">
      {features.map((feature, index) => (
        <div key={index} className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-[#0FF1CE]/20 flex items-center justify-center">
            <span className="text-[#0FF1CE] text-sm">✓</span>
          </div>
          <span className="text-gray-300">{feature}</span>
        </div>
      ))}
    </div>

    <button className="w-full bg-[#0FF1CE] text-black font-bold py-3 rounded-lg hover:scale-105 transition-transform">
      {buttonText}
    </button>
  </div>
);

export default function DashboardPage() {
  const router = useRouter();

  const handleStartChallenge = (type: string) => {
    // Navigate to the challenge page with the type in session storage
    sessionStorage.setItem('preselectedChallengeType', type);
    router.push('/dashboard/challenge');
  };

  return (
    <div className="relative">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full bg-[#0FF1CE]/[0.02] background-noise"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full md:w-3/4 h-full rounded-full bg-[#0FF1CE]/[0.03] blur-[150px] opacity-60"></div>
      <Particles />

      {/* Content */}
      <div className="relative z-10">
        <h1 className="text-2xl font-bold text-white mb-6">Dashboard</h1>

        {/* Promotional Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-[800px] mx-auto">
          <div className="bg-[#0D0D0D]/80 backdrop-blur-sm rounded-xl p-4 hover:scale-[1.02] transition-all duration-300 border border-[#2F2F2F]/50">
            <img src="/shockwavechallenge.png" alt="Shockwave Challenge" className="w-35 h-35 mb-2" />
            <p className="text-gray-400 text-sm mb-3">Take your trading to the next level with our Shockwave Challenge.</p>
            
            <div className="space-y-2 mb-4">
              {[
                'Up to $500,000 in funding',
                '15% Max Drawdown',
                '8% Daily Drawdown',
                '1:200 leverage',
                'Profit split up to 95%'
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-[#0FF1CE]/20 flex items-center justify-center">
                    <span className="text-[#0FF1CE] text-xs">✓</span>
                  </div>
                  <span className="text-gray-300 text-xs">{feature}</span>
                </div>
              ))}
            </div>

            <button 
              onClick={() => handleStartChallenge('Standard')}
              className="w-full bg-[#0FF1CE] text-black font-bold text-sm py-2 rounded-lg hover:scale-105 transition-transform"
            >
              Start Challenge
            </button>
          </div>

          <div className="bg-[#0D0D0D]/80 backdrop-blur-sm rounded-xl p-4 hover:scale-[1.02] transition-all duration-300 border border-[#2F2F2F]/50">
            <img src="/shockwaveinstant.png" alt="Shockwave Instant" className="w-35 h-35 mb-2" />
            <p className="text-gray-400 text-sm mb-3">Get instant funding and start trading immediately with our Instant Challenge.</p>
            
            <div className="space-y-2 mb-4">
              {[
                'Instant funding access',
                'No evaluation phase needed',
                '1:200 leverage',
                'Flexible drawdown rules',
                'Get paid in 6 days'
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-[#0FF1CE]/20 flex items-center justify-center">
                    <span className="text-[#0FF1CE] text-xs">✓</span>
                  </div>
                  <span className="text-gray-300 text-xs">{feature}</span>
                </div>
              ))}
            </div>

            <button 
              onClick={() => handleStartChallenge('Instant')}
              className="w-full bg-[#0FF1CE] text-black font-bold text-sm py-2 rounded-lg hover:scale-105 transition-transform"
            >
              Get Instant Access
            </button>
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