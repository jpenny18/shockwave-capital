'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Particles from '../components/Particles';
import { 
  TrendingUp,
  DollarSign,
  Shield,
  Zap,
  CheckCircle,
  ArrowRight,
  Rocket,
  Star,
  Trophy,
  BarChart3,
  Clock,
  Users,
  Target,
  Flame,
  Crown
} from 'lucide-react';

const ComparisonTable = () => {
  const features = [
    {
      feature: 'Profit Split',
      ftmo: '80% max',
      fundedNext: '80% max',
      shockwave: '100% with add-on',
      highlight: true
    },
    {
      feature: 'Max Drawdown',
      ftmo: '10%',
      fundedNext: '12%',
      shockwave: '15%',
      highlight: true
    },
    {
      feature: 'Daily Drawdown',
      ftmo: '5%',
      fundedNext: '5-7%',
      shockwave: '8%',
      highlight: true
    },
    {
      feature: 'Leverage',
      ftmo: '1:100',
      fundedNext: '1:100',
      shockwave: '1:200',
      highlight: true
    },
    {
      feature: 'Live Payout Proofs',
      ftmo: 'Limited',
      fundedNext: 'Limited',
      shockwave: 'Yes – Trader Interviews',
      highlight: true
    }
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full bg-[#1A1A1A]/50 backdrop-blur-sm rounded-xl border border-[#2F2F2F]/50">
        <thead>
          <tr className="border-b border-[#2F2F2F]/50">
            <th className="text-left p-4 text-gray-400 font-semibold">Feature</th>
            <th className="text-center p-4 text-gray-400 font-semibold">FTMO</th>
            <th className="text-center p-4 text-gray-400 font-semibold">FundedNext</th>
            <th className="text-center p-4 text-[#0FF1CE] font-bold bg-[#0FF1CE]/10">Shockwave Capital</th>
          </tr>
        </thead>
        <tbody>
          {features.map((row, index) => (
            <tr key={index} className="border-b border-[#2F2F2F]/30 last:border-b-0">
              <td className="p-4 text-white font-medium">{row.feature}</td>
              <td className="p-4 text-center text-gray-300">{row.ftmo}</td>
              <td className="p-4 text-center text-gray-300">{row.fundedNext}</td>
              <td className={`p-4 text-center font-bold ${row.highlight ? 'text-[#0FF1CE] bg-[#0FF1CE]/5' : 'text-white'}`}>
                {row.shockwave}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const FeatureCard = ({ icon: Icon, title, description, highlight = false }: {
  icon: any;
  title: string;
  description: string;
  highlight?: boolean;
}) => (
  <div className={`p-6 rounded-xl border backdrop-blur-sm transition-all duration-300 hover:scale-105 group ${
    highlight 
      ? 'bg-gradient-to-br from-[#0FF1CE]/20 to-[#0FF1CE]/5 border-[#0FF1CE]/30' 
      : 'bg-[#1A1A1A]/50 border-[#2F2F2F]/50 hover:border-[#0FF1CE]/30'
  }`}>
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
      highlight ? 'bg-[#0FF1CE] text-black' : 'bg-[#0FF1CE]/10 text-[#0FF1CE]'
    }`}>
      <Icon className="w-6 h-6" />
    </div>
    <h3 className="font-bold text-white mb-2 text-lg">{title}</h3>
    <p className="text-gray-300 leading-relaxed">{description}</p>
    {highlight && (
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#0FF1CE] to-[#00D4FF] rounded-xl blur opacity-20 group-hover:opacity-40 transition-opacity -z-10"></div>
    )}
  </div>
);

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      // Target date: July 27th, 2025
      const targetDate = new Date('2025-07-27T00:00:00');
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        return { days, hours, minutes, seconds };
      } else {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }
    };

    // Initial calculation
    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex justify-center gap-4 mb-8">
      {Object.entries(timeLeft).map(([unit, value]) => (
        <div key={unit} className="text-center">
          <div className="bg-[#1A1A1A]/50 backdrop-blur-sm border border-[#0FF1CE]/30 rounded-xl p-4 min-w-[80px]">
            <div className="text-2xl md:text-3xl font-bold text-[#0FF1CE]">
              {value.toString().padStart(2, '0')}
            </div>
            <div className="text-xs text-gray-400 uppercase tracking-wide mt-1">
              {unit}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default function LaunchPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0D0D0D] via-[#0D0D0D] to-[#151515] text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-[#0FF1CE]/10 rounded-full blur-[150px] animate-pulse"></div>
        <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-[#0FF1CE]/10 rounded-full blur-[150px] animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#0FF1CE]/5 rounded-full blur-[100px] animate-pulse delay-500"></div>
      </div>
      <Particles />
      
      <div className="relative z-10">
        {/* Header */}
        <header className="p-6 md:p-8">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#0FF1CE]/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-[#0FF1CE]/30">
                <Rocket className="w-6 h-6 text-[#0FF1CE]" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-[#0FF1CE]">Shockwave Capital</h1>
                <p className="text-xs text-gray-400">Relaunch Coming Soon</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-2 bg-[#0FF1CE]/10 px-4 py-2 rounded-lg border border-[#0FF1CE]/30">
              <Flame className="w-4 h-4 text-[#0FF1CE]" />
              <span className="text-sm font-semibold text-[#0FF1CE]">Live Soon</span>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="px-6 md:px-8 py-12 md:py-20">
          <div className="max-w-6xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#0FF1CE]/20 to-[#00D4FF]/20 px-6 py-3 rounded-full border border-[#0FF1CE]/30 backdrop-blur-sm mb-8 animate-pulse">
              <Crown className="w-5 h-5 text-[#0FF1CE]" />
              <span className="text-sm font-bold text-[#0FF1CE]">THE MOST TRADER-FRIENDLY PROP FIRM</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-[#0FF1CE] to-[#00D4FF] bg-clip-text text-transparent">
                Up To 100% Profit Split.
              </span>
              <br />
              <span className="text-white">No more Payout Caps.</span>
              <br />
              <span className="bg-gradient-to-r from-[#0FF1CE] to-[#00D4FF] bg-clip-text text-transparent">
                Best Drawdown in the Industry.
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
              The most trader-friendly prop firm is back. Bigger payouts. No ceilings. 
              Rules built <span className="text-[#0FF1CE] font-semibold">for traders</span>, not against them.
            </p>

            {/* Countdown */}
            <div className="mb-12">
              <h3 className="text-lg font-semibold text-gray-400 mb-4">Launching in:</h3>
              <CountdownTimer />
            </div>

            {/* CTA Button */}
            <Link href="/access">
              <button className="relative inline-flex items-center gap-3 bg-[#0FF1CE] text-black font-bold px-8 py-4 rounded-xl hover:scale-105 active:scale-95 transition-all duration-300 group overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-[#0FF1CE] to-[#00D4FF] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center gap-3">
                  <Rocket className="w-5 h-5" />
                  <span className="text-lg">Get Early Access</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            </Link>
          </div>
        </section>

        {/* Why Traders Are Switching */}
        <section className="px-6 md:px-8 py-16 md:py-24">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                Why Traders Are Switching to{' '}
                <span className="bg-gradient-to-r from-[#0FF1CE] to-[#00D4FF] bg-clip-text text-transparent">
                  Shockwave Capital
                </span>
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                We've redesigned everything from the ground up to give traders the best possible experience.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard
                icon={DollarSign}
                title="80% profit split from day one"
                description="Keep the majority of what you earn. No scaling up required – you get 80% immediately."
                highlight={true}
              />
              
              <FeatureCard
                icon={TrendingUp}
                title="No monthly withdrawal limits"
                description="Take what you make, no ceiling. Your success isn't capped by arbitrary limits."
              />
              
              <FeatureCard
                icon={Shield}
                title="15% max drawdown, 8% daily"
                description="Trade with more breathing room than any other propfirm like FTMO/FundedNext. Less stress, more profit potential."
                highlight={true}
              />
              
              <FeatureCard
                icon={Zap}
                title="1:200 leverage"
                description="Trade with institutional-grade flexibility. Double the leverage of traditional prop firms."
              />
              
              <FeatureCard
                icon={Trophy}
                title="Proven payouts"
                description="Watch live interviews of traders withdrawing from Shockwave. Real traders, real results."
                highlight={true}
              />
              
              <FeatureCard
                icon={Target}
                title="Relaxed trading rules"
                description="Focus on profits, not restrictions. Our rules are designed to help you succeed, not fail."
              />
            </div>
          </div>
        </section>

        {/* Comparison Table */}
        <section className="px-6 md:px-8 py-16 md:py-24 bg-[#0D0D0D]/50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                How We <span className="bg-gradient-to-r from-[#0FF1CE] to-[#00D4FF] bg-clip-text text-transparent">Compare</span>
              </h2>
              <p className="text-xl text-gray-300">
                See why traders are making the switch to Shockwave Capital.
              </p>
            </div>

            <ComparisonTable />
          </div>
        </section>

        {/* How It Works */}
        <section className="px-6 md:px-8 py-16 md:py-24">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                How It <span className="bg-gradient-to-r from-[#0FF1CE] to-[#00D4FF] bg-clip-text text-transparent">Works</span>
              </h2>
              <p className="text-xl text-gray-300">
                Three simple steps to start earning with the most trader-friendly prop firm.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center group">
                <div className="relative mx-auto w-20 h-20 bg-[#0FF1CE]/10 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <BarChart3 className="w-10 h-10 text-[#0FF1CE]" />
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#0FF1CE] text-black rounded-full flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-4">Choose your challenge</h3>
                <p className="text-gray-300">Start from as low as $59. Pick the account size that fits your trading style.</p>
              </div>

              <div className="text-center group">
                <div className="relative mx-auto w-20 h-20 bg-[#0FF1CE]/10 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <CheckCircle className="w-10 h-10 text-[#0FF1CE]" />
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#0FF1CE] text-black rounded-full flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-4">Pass with our relaxed rules</h3>
                <p className="text-gray-300">Enjoy 15% total & 8% daily drawdown limits. More room to breathe and succeed.</p>
              </div>

              <div className="text-center group">
                <div className="relative mx-auto w-20 h-20 bg-[#0FF1CE]/10 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <DollarSign className="w-10 h-10 text-[#0FF1CE]" />
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#0FF1CE] text-black rounded-full flex items-center justify-center text-sm font-bold">
                    3
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-4">Get funded & withdraw</h3>
                <p className="text-gray-300">Keep up to 100% with no caps from day one. Your profits, your rules.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="px-6 md:px-8 py-16 md:py-24 bg-gradient-to-br from-[#0FF1CE]/20 via-[#0FF1CE]/10 to-[#00D4FF]/20 relative">
          <div className="absolute inset-0 bg-[#0D0D0D]/80 backdrop-blur-sm"></div>
          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-[#0FF1CE] text-black px-6 py-3 rounded-full font-bold mb-8">
              <Rocket className="w-5 h-5" />
              <span>Limited-Time Relaunch Offer</span>
            </div>

            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Sign up this week & lock in{' '}
              <span className="bg-gradient-to-r from-[#0FF1CE] to-[#00D4FF] bg-clip-text text-transparent">
                100% profit split + no caps for life
              </span>
            </h2>

            <p className="text-xl text-gray-300 mb-12">
              Join the waitlist now and be among the first to experience the future of prop trading.
            </p>

            <Link href="/access">
              <button className="relative inline-flex items-center gap-3 bg-[#0FF1CE] text-black font-bold px-12 py-6 rounded-xl hover:scale-105 active:scale-95 transition-all duration-300 group overflow-hidden text-xl">
                <div className="absolute inset-0 bg-gradient-to-r from-[#0FF1CE] to-[#00D4FF] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center gap-3">
                  <span>Get My Challenge Now</span>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            </Link>

            <p className="text-sm text-gray-400 mt-6">
              No commitment required. Join hundreds of traders already on the waitlist.
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="px-6 md:px-8 py-8 border-t border-[#2F2F2F]/50">
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-gray-400 text-sm">
              © 2025 Shockwave Capital. All rights reserved. 
            </p>
          </div>
        </footer>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .delay-500 {
          animation-delay: 0.5s;
        }

        .delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
} 