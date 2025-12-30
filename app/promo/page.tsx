'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '../components/Header';
import PromoPricingCards from '../components/PromoPricingCards';

// End date: January 4th, 2026 at 11:59:59 PM
const END_DATE = new Date('2026-01-04T23:59:59').getTime();

function calculateTimeLeft() {
  const now = new Date().getTime();
  const difference = END_DATE - now;

  if (difference > 0) {
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((difference % (1000 * 60)) / 1000)
    };
  }
  return { days: 0, hours: 0, minutes: 0, seconds: 0 };
}

export default function PromoPage() {
  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-black text-white min-h-screen font-sans relative overflow-hidden">
      <Header />

      {/* Hero Section */}
      <section className="relative z-10 px-6 pt-24 md:pt-28 pb-12 md:pb-10 text-center overflow-hidden bg-black">
        <div className="max-w-5xl mx-auto">

          {/* Main Hero Image */}
          <div className="relative mb-6 md:mb-4">
            <div className="relative w-full max-w-3xl mx-auto aspect-[16/9]">
              <Image
                src="/promo-hero.png"
                alt="50% OFF New Year Flash Sale"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-3 md:mb-2">
            New Year Flash Sale
          </h1>
          
          {/* Badge */}
          <div className="inline-block bg-gradient-to-r from-[#0FF1CE] to-[#00D9FF] text-black font-bold px-5 py-2 rounded-full text-sm md:text-base mb-6 md:mb-5">
            50% Off All Challenges + Free Retry
          </div>

          {/* Countdown Timer - Compact Design */}
          <div className="max-w-2xl mx-auto mb-8 md:mb-6">
            <div className="bg-[#0d1117] rounded-2xl p-6 border border-[#0FF1CE]/20">
              <p className="text-gray-400 text-sm mb-4">Offer ends in:</p>
              
              <div className="flex justify-center items-center gap-3 md:gap-6 mb-6">
                {[
                  { value: timeLeft.days, label: 'D' },
                  { value: timeLeft.hours, label: 'H' },
                  { value: timeLeft.minutes, label: 'M' },
                  { value: timeLeft.seconds, label: 'S' }
                ].map((item, index) => (
                  <React.Fragment key={index}>
                    <div className="text-center">
                      <div className="bg-black rounded-lg px-3 py-2 md:px-5 md:py-3 border border-[#0FF1CE]/30 min-w-[50px] md:min-w-[70px]">
                        <div className="text-2xl md:text-4xl font-bold text-[#0FF1CE] tabular-nums">
                          {String(item.value).padStart(2, '0')}
                        </div>
                      </div>
                      <div className="text-gray-500 text-[10px] md:text-xs mt-1">{item.label}</div>
                    </div>
                    {index < 3 && (
                      <span className="text-[#0FF1CE] text-xl md:text-2xl font-bold -mt-4">:</span>
                    )}
                  </React.Fragment>
                ))}
              </div>

              <Link href="/challenge">
                <button className="w-full md:w-auto px-10 py-3 bg-[#0FF1CE] text-black text-base font-bold rounded-lg hover:bg-[#0AA89E] transition-all duration-300">
                  Claim Your 50% Discount
                </button>
              </Link>
            </div>
          </div>

          {/* Benefits - Compact Grid */}
          <div className="grid grid-cols-3 gap-3 max-w-xl mx-auto">
            {[
              { title: '50% OFF', desc: 'All Plans' },
              { title: 'FREE RETRY', desc: 'Included' },
              { title: 'INSTANT', desc: 'Access' }
            ].map((item, index) => (
              <div key={index} className="bg-[#0d1117] rounded-xl p-4 border border-gray-800">
                <h3 className="text-[#0FF1CE] font-bold text-sm md:text-base mb-1">{item.title}</h3>
                <p className="text-gray-400 text-xs">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="relative z-10 py-16 px-6 overflow-hidden">
        {/* Background Image for Pricing Section Only */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/promo-ch-background.png"
            alt="Promo Background"
            fill
            className="object-cover opacity-40"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/70"></div>
        </div>

        {/* Glowing Cyan Orbs */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-[#0FF1CE]/20 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-40 right-10 w-80 h-80 bg-[#0FF1CE]/15 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-[#00D9FF]/10 rounded-full blur-[80px] pointer-events-none"></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-[#0FF1CE]/12 rounded-full blur-[90px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <h2 className="text-center font-bold text-3xl md:text-4xl text-white mb-3">
            Choose Your Shockwave Challenge
          </h2>
          <p className="text-center text-gray-400 mb-10 text-sm md:text-base">
            Complete Shockwave's Trading Objectives to become eligible to gain your Shockwave Account.
          </p>
          <PromoPricingCards />
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative z-10 py-16 px-6 bg-black">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-[#0FF1CE] mb-10">
            Frequently Asked Questions
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                question: "What makes Shockwave different?",
                questionShort: "We don't play small.",
                answer: "While other platforms overpromise and underdeliver, we offer structured simulations with higher drawdown tolerance, tighter feedback loops, and faster scaling potential — all with fully disclosed rules and performance metrics."
              },
              {
                question: "How soon can I start trading?",
                questionShort: "Immediately after setup.",
                answer: "Once your account is set up and your evaluation fee is processed, you're good to go. No long waiting times, no phases to unlock — just start trading in our live-market simulation environment."
              },
              {
                question: "What's the payout process like?",
                questionShort: "Fast and straightforward.",
                answer: "After meeting performance benchmarks, simulated payouts become eligible after 14 days and the required number of profitable trade days. Standard accounts: up to 90% simulated share. Instant accounts: up to 70%."
              },
              {
                question: "What trading styles are allowed?",
                questionShort: "All legitimate strategies.",
                answer: "We support all strategies — scalping, swing, algorithmic — as long as your trades stay within risk rules and show consistency."
              },
              {
                question: "What happens if I don't pass?",
                questionShort: "You get another chance.",
                answer: "On our Instant Evaluation plan, every trader gets one free retry. Standard Challenge users can reset for $199 if needed — no penalty, just another shot at proving yourself."
              }
            ].map(({ question, questionShort, answer }, index) => (
              <div
                key={index}
                className="group relative bg-[#0d1117] rounded-xl p-5 border border-gray-800 hover:border-[#0FF1CE]/30 transition-all duration-300"
              >
                <div className="space-y-3">
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center space-x-2 mb-1">
                      <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center">
                        <span className="text-xs text-white">Q</span>
                      </div>
                      <span className="text-gray-400 text-xs">Question</span>
                    </div>
                    <div className="bg-gray-800/50 rounded-xl rounded-tl-none p-3 text-white text-sm">
                      {question}
                    </div>
                  </div>

                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center space-x-2 mb-1">
                      <div className="w-6 h-6 rounded-full bg-[#0FF1CE] flex items-center justify-center">
                        <span className="text-xs text-black font-bold">A</span>
                      </div>
                      <span className="text-[#0FF1CE] text-xs">Answer</span>
                    </div>
                    <div className="bg-[#0FF1CE]/5 rounded-xl rounded-tl-none p-3">
                      <p className="text-[#0FF1CE] font-bold text-sm mb-1">{questionShort}</p>
                      <p className="text-gray-400 text-xs">{answer}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative z-10 py-16 px-6 text-center bg-black">
        <div className="max-w-3xl mx-auto">
          <div className="bg-[#0d1117] rounded-2xl p-10 border border-[#0FF1CE]/20">
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">
              Don't Miss This Limited Offer!
            </h2>
            <p className="text-gray-400 text-sm md:text-base mb-6">
              50% OFF + Free Retry on all challenges. This deal ends soon!
            </p>
            <Link href="/challenge">
              <button className="px-10 py-3 bg-[#0FF1CE] text-black text-base md:text-lg font-bold rounded-lg hover:bg-[#0AA89E] transition-all duration-300">
                Start Your Challenge Now
              </button>
            </Link>
            <p className="text-gray-500 text-xs mt-4">
              Promo code NYE automatically applied
            </p>
          </div>
        </div>
      </section>

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
