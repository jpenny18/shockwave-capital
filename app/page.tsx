'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Particles from './components/Particles';
import Header from './components/Header';

export default function ShockwaveLandingPage() {
    const [selectedBalance, setSelectedBalance] = useState(100000);
    
    const getOneTimePrice = (balance: number) => {
      const prices: Record<number, string> = {
        5000: '80',
        10000: '150',
        25000: '300',
        50000: '350',
        100000: '600',
        200000: '999',
        500000: '1999'
      };
      return prices[balance] || '600';
    };

    const values = {
      maxDailyLoss: selectedBalance * 0.08,
      maxLoss: selectedBalance * 0.15,
      profitTargetStep1: selectedBalance * 0.10,
      profitTargetStep2: selectedBalance * 0.05
    };

    return (
      <div className="bg-[#121212] text-white min-h-screen font-sans">
        <Header />
        
        {/* Hero Section */}
        <section className="relative px-6 pt-40 pb-32 text-center overflow-hidden">
          <Particles />
          <div className="relative z-10 space-y-16">
          
            <div className="space-y-6 md:space-y-6">
              <h1 className="text-[2.5rem] md:text-6xl font-extrabold text-[#0FF1CE] mb-0">
                Funded or Fried
              </h1>
              <h3 className="text-[0.9375rem] md:text-3xl font-extrabold bg-gradient-to-b from-[#0FF1CE] to-[#0FF1CE]/50 text-transparent bg-clip-text mb-12 -mt-4 md:mt-0">
                Prop trading without the training wheels
              </h3>
            </div>

            <div className="space-y-12">
              <p className="text-base md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                High-octane funding for elite traders.<br className="md:hidden" /> Push your trading into Overdrive with:
              </p>

              <div className="grid grid-cols-3 gap-2 md:flex md:flex-row md:justify-center md:items-center md:gap-8 px-2 md:px-0">
                {[
                  { value: "15%", label: "Max Drawdown", delay: "0s" },
                  { value: "8%", label: "Daily Drawdown", delay: "0.1s" },
                  { value: "1:200", label: "Leverage", delay: "0.2s" }
                ].map(({ value, label, delay }) => (
                  <div
                    key={label}
                    className="group relative w-full bg-gradient-to-br from-[#0FF1CE]/10 to-[#0FF1CE]/5 backdrop-blur-sm rounded-xl p-3 md:p-4 md:w-44 hover:scale-105 transition-all duration-300 animate-float"
                    style={{
                      animation: `float 3s ease-in-out infinite`,
                      animationDelay: delay,
                      boxShadow: '0 0 20px rgba(15, 241, 206, 0.1)'
                    }}
                  >
                    <div className="text-xl md:text-3xl font-bold text-[#0FF1CE] mb-1">{value}</div>
                    <div className="text-xs md:text-sm text-gray-400">{label}</div>
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#0FF1CE]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                ))}
              </div>

              <div className="flex flex-col md:flex-row justify-center gap-4 md:gap-6 max-w-sm md:max-w-[600px] mx-auto w-full pt-8">
                <button className="px-10 py-3 md:py-4 bg-[#0FF1CE] text-black text-sm md:text-lg font-bold rounded-lg hover:scale-105 transition-transform w-full md:w-1/2">
                  SHOCKWAVE CHALLENGE
                </button>
                <button className="px-10 py-3 md:py-4 bg-transparent text-white text-sm md:text-lg font-bold rounded-lg hover:scale-105 transition-transform border-2 border-white w-full md:w-1/2">
                  FREE TRIAL
          </button>
              </div>
            </div>

          </div>
        </section>
  
        {/* Trust Statistics Section */}
        <section className="py-8 px-6 max-w-5xl mx-auto">
          <div className="grid grid-cols-3 gap-5 text-center scale-85">
            {[
              { value: "Same Day", subtitle: "Start trading immediately after passing" },
              { value: "90%", subtitle: "Profit Split" },
              { value: "< 2h", subtitle: "Average response time" },
            ].map(({ value, subtitle }) => (
              <div key={value} className="bg-transparent border-2 border-[#0FF1CE] rounded-2xl p-3 shadow-lg hover:scale-105 transition-transform">
                <h3 className="text-[#0FF1CE] text-[0.6rem] md:text-xl font-bold mb-1">{value}</h3>
                <p className="text-gray-400 text-[0.3rem] md:text-[0.6rem]">{subtitle}</p>
            </div>
          ))}
          </div>
        </section>
  
        {/* How It Works Section */}
        <section className="py-20 px-6 bg-[#121212] relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-4xl font-bold text-center text-[#0FF1CE] mb-16">How It Works</h2>
            
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: "1",
                  title: "Create An Account",
                  description: "Choose your preferred account size, sign up in minutes, and get ready to start trading like a pro.",
                  delay: "0s"
                },
                {
                  icon: "2",
                  title: "Pass Challenge",
                  description: "Showcase your trading performance by passing your evaluation in as little as 3 days.",
                  delay: "0.1s"
                },
                {
                  icon: "3",
                  title: "Get Funded",
                  description: "Receive your sim-funded account when you pass the evaluation.",
                  delay: "0.2s"
                },
                {
                  icon: "4",
                  title: "Clear Path to Live",
                  description: "Once you've made 4 withdrawals, become eligible to be moved to a live account with daily payouts and no consistency rule.",
                  delay: "0.3s"
                },
                {
                  icon: "5",
                  title: "Earn More Funding",
                  description: "Maximize Your Trading Potential: Manage up to 10 accounts and access up to $2 million in trader funding.",
                  delay: "0.4s"
                },
                {
                  icon: "6",
                  title: "Simple and Easy To Start",
                  description: "Get up and running quickly with a streamlined process designed for traders of all levels.",
                  delay: "0.5s"
                }
              ].map(({ icon, title, description, delay }) => (
                <div
                  key={title}
                  className="group relative bg-gradient-to-br from-[#0FF1CE]/10 to-[#0FF1CE]/5 backdrop-blur-sm rounded-2xl p-6 md:p-5 hover:scale-105 transition-all duration-300 animate-float md:transform md:scale-80"
                  style={{
                    animation: `float 3s ease-in-out infinite`,
                    animationDelay: delay,
                    boxShadow: '0 0 20px rgba(15, 241, 206, 0.1)'
                  }}
                >
                  {/* Content */}
                  <div className="relative z-10">
                    <div className="text-[#0FF1CE] text-4xl font-bold mb-4">{icon}</div>
                    <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
                  </div>

                  {/* Hover gradient overlay */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#0FF1CE]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              ))}
            </div>
          </div>
        </section>
  
        {/* Challenge Details Table Section */}
        <section className="relative py-20 px-6 bg-[#121212] overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-4xl font-bold text-center text-[#0FF1CE] mb-12">Challenge Details</h2>
            
            {/* Balance Selection */}
            <div className="max-w-6xl mx-auto mb-8 flex flex-wrap justify-center gap-4">
              {[5000, 10000, 25000, 50000, 100000, 200000, 500000].map(balance => (
                <button
                  key={balance}
                  onClick={() => setSelectedBalance(balance)}
                  className={`relative px-6 py-3 rounded-xl ${
                    selectedBalance === balance 
                      ? 'bg-[#0FF1CE] text-black' 
                      : 'bg-[#1F1F1F] text-white'
                  } transition-all hover:scale-105 text-sm md:text-base`}
                >
                  {balance === 100000 && (
                    <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-[#0FF1CE] text-black text-xs px-2 py-1 rounded-full">
                      POPULAR
                    </span>
                  )}
                  ${balance.toLocaleString()}
                </button>
              ))}
            </div>

            {/* Table */}
            <div className="max-w-6xl mx-auto overflow-hidden rounded-2xl">
              <div 
                className="grid grid-cols-4 text-sm md:text-base bg-gradient-to-br from-[#0FF1CE]/10 to-[#0FF1CE]/5 backdrop-blur-sm rounded-2xl"
                style={{
                  boxShadow: '0 0 20px rgba(15, 241, 206, 0.1)'
                }}
              >
                {/* Header */}
                <div className="col-span-4 grid grid-cols-4 bg-[#0FF1CE] text-black font-bold">
                  <div className="p-4 border-r border-black/20"></div>
                  <div className="p-4 border-r border-black/20 text-center">CHALLENGE</div>
                  <div className="p-4 border-r border-black/20 text-center">VERIFICATION</div>
                  <div className="p-4 text-center">FUNDED</div>
                </div>

                {/* Rows */}
                {[
                  ['Trading Period', 'Unlimited', 'Unlimited', 'Unlimited'],
                  ['Minimum Profitable Days', '4 Days', '4 Days', 'X'],
                  ['Maximum Daily Loss', `$${values.maxDailyLoss.toLocaleString()} (8%)`, `$${values.maxDailyLoss.toLocaleString()} (8%)`, `$${values.maxDailyLoss.toLocaleString()} (8%)`],
                  ['Maximum Loss', `$${values.maxLoss.toLocaleString()} (15%)`, `$${values.maxLoss.toLocaleString()} (15%)`, `$${values.maxLoss.toLocaleString()} (15%)`],
                  ['Profit Target', `$${values.profitTargetStep1.toLocaleString()} (10%)`, `$${values.profitTargetStep2.toLocaleString()} (5%)`, 'X'],
                  ['Leverage', '1:200', '1:200', '1:200'],
                  ['One-Time Price', `$${getOneTimePrice(selectedBalance)}`, '-', '-'],
                  ['Risk Desk Setup Fee', 'X', 'X', 'X']
                ].map((row, i) => (
                  <div key={i} className="col-span-4 grid grid-cols-4 border-b border-[#2F2F2F] last:border-b-0">
                    <div className="p-4 border-r border-[#2F2F2F] font-medium">{row[0]}</div>
                    <div className="p-4 border-r border-[#2F2F2F] text-center">{row[1]}</div>
                    <div className="p-4 border-r border-[#2F2F2F] text-center">{row[2]}</div>
                    <div className="p-4 text-center">{row[3]}</div>
                  </div>
                ))}
              </div>
            </div>


            {/* CTA Button */}
            <div className="max-w-4xl mx-auto mt-12 text-center">
              <button className="px-12 py-4 bg-[#0FF1CE] text-black text-xl font-bold rounded-full hover:scale-105 transition-transform shadow-lg hover:shadow-[#0FF1CE]/20">
                START CHALLENGE
              </button>
            </div>
          </div>
        </section>
  
        {/* Global Network Section */}
        <section className="py-20 px-6 bg-[#121212] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[#0FF1CE]/5 blur-[100px] rounded-full"></div>
          <div className="relative z-10">
            <h2 className="text-3xl font-bold text-center text-[#0FF1CE] mb-6">Global Trading Network</h2>
            <p className="text-base md:text-xl text-gray-300 text-center max-w-2xl mx-auto mb-16">
              Powering high-octane traders worldwide. Join our network of elite traders pushing the boundaries of what's possible.
            </p>

            <div className="max-w-5xl mx-auto relative">
              {/* Logo positioned above SVG */}
              <div className="absolute left-1/2 -translate-x-1/2 -top-10 z-10">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-[#121212] border-2 border-[#0FF1CE] animate-pulse"></div>
                  <Image
                    src="/logo.png"
                    alt="Shockwave Capital" 
                    width={80}
                    height={80}
                    className="relative z-10 w-[40px] h-[40px] md:w-[80px] md:h-[80px]"
                  />
                </div>
              </div>

              <svg viewBox="-1 -1 802 402" className="w-full h-auto">
                <defs>
                  <linearGradient id="globe-gradient" x1="0" y1="0" x2="0" y2="400" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#0FF1CE" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#0FF1CE" stopOpacity="0.1" />
                  </linearGradient>
                  <radialGradient id="node-gradient" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#0FF1CE" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#0FF1CE" stopOpacity="0" />
                  </radialGradient>
                </defs>

                {/* Background Circle */}
                <circle cx="400" cy="400" r="400" fill="#181818" />

                {/* Grid Lines */}
                <g stroke="url(#globe-gradient)" strokeWidth="1">
                  {/* Vertical Lines */}
                  <path d="M 400 800 A -400 400 0 0 0 400 0" fill="none" />
                  <path d="M 400 800 A -328.701 400 0 0 0 400 0" fill="none" />
                  <path d="M 400 800 A -235.355 400 0 0 0 400 0" fill="none" />
                  <path d="M 400 800 A -123.097 400 0 0 0 400 0" fill="none" />
                  <path d="M 400 800 A 0 400 0 0 0 400 0" fill="none" />
                  <path d="M 400 0 A 123.097 400 0 0 0 400 800" fill="none" />
                  <path d="M 400 0 A 235.355 400 0 0 0 400 800" fill="none" />
                  <path d="M 400 0 A 328.701 400 0 0 0 400 800" fill="none" />
                  <path d="M 400 0 A 400 400 0 0 0 400 800" fill="none" />

                  {/* Horizontal Lines */}
                  <path d="M160,80 h480" fill="none" />
                  <path d="M80,160 h640" fill="none" />
                  <path d="M33.394,240 h733.212" fill="none" />
                  <path d="M8.082,320 h783.837" fill="none" />
                  <path d="M0,400 h800" fill="none" />
                </g>

                {/* Trading Nodes */}
                {[
                  { cx: 701.26, cy: 240, delay: "0s", path: "M 400 0 A 328.701 400 0 0 1 701.26 240" },
                  { cx: 77.94, cy: 320, delay: "1s", path: "M 400 0 A -328.701 400 0 0 0 77.94 320" },
                  { cx: 498.48, cy: 160, delay: "2s", path: "M 400 0 A 123.097 400 0 0 1 498.48 160" },
                  { cx: 258.79, cy: 80, delay: "1.5s", path: "M 400 0 A -235.355 400 0 0 0 258.79 80" }
                ].map(({ cx, cy, delay, path }, i) => (
                  <g key={i}>
                    {/* Pulse Effect */}
                    <circle
                      cx={cx}
                      cy={cy}
                      r="0"
                      stroke="#0FF1CE"
                      strokeWidth="2"
                      fill="none"
                    >
                      <animate
                        attributeName="r"
                        values="0;12;18;24;0"
                        dur="4s"
                        begin={delay}
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="opacity"
                        values="0;1;0.5;0;0"
                        dur="4s"
                        begin={delay}
                        repeatCount="indefinite"
                      />
                    </circle>

                    {/* Node */}
                    <circle
                      cx={cx}
                      cy={cy}
                      r="6"
                      fill="#0FF1CE"
                      className="animate-pulse"
                      stroke="none"
                    />

                    {/* Connection Line */}
                    {path && (
                      <g>
                        <path
                          d={path}
                          stroke="#0FF1CE"
                          strokeWidth="2"
                          fill="none"
                          opacity="0.3"
                        >
                          <animate
                            attributeName="stroke-dasharray"
                            values="0,1000;1000,0"
                            dur={`${3 + i}s`}
                            repeatCount="indefinite"
                          />
                        </path>
                        <circle r="4" fill="#0FF1CE">
                          <animateMotion
                            dur={`${3 + i}s`}
                            repeatCount="indefinite"
                            path={path}
                          />
                        </circle>
                      </g>
                    )}
                  </g>
                ))}
              </svg>
            </div>

            {/* Stats Cards - Positioned to overlap SVG */}
            <div className="relative -mt-5 md:-mt-15 px-6">
              <div className="grid grid-cols-3 gap-4 max-w-4xl mx-auto">
                <div className="bg-gradient-to-br from-[#0FF1CE]/10 to-[#0FF1CE]/5 backdrop-blur-sm rounded-2xl p-4 md:p-6">
                  <h3 className="text-[#0FF1CE] text-lg md:text-4xl font-bold mb-2">24/7</h3>
                  <p className="text-gray-400 text-[0.625rem] md:text-base">Global Market Access</p>
                </div>
                <div className="bg-gradient-to-br from-[#0FF1CE]/10 to-[#0FF1CE]/5 backdrop-blur-sm rounded-2xl p-4 md:p-6">
                  <h3 className="text-[#0FF1CE] text-lg md:text-4xl font-bold mb-2">100+</h3>
                  <p className="text-gray-400 text-[0.625rem] md:text-base">Countries Supported</p>
                </div>
                <div className="bg-gradient-to-br from-[#0FF1CE]/10 to-[#0FF1CE]/5 backdrop-blur-sm rounded-2xl p-4 md:p-6">
                  <h3 className="text-[#0FF1CE] text-lg md:text-4xl font-bold mb-2">$2M+</h3>
                  <p className="text-gray-400 text-[0.625rem] md:text-base">Trading Capital Available</p>
                </div>
              </div>
            </div>
          </div>
        </section>
  
        {/* FAQ Section */}
        <section className="py-16 px-6 bg-[#121212] relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-4xl font-bold text-center text-[#0FF1CE] mb-12">FAQ</h2>
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  question: "What makes Shockwave Capital different from other prop firms?",
                  questionShort: "We're not just another challenge shop.",
                  answer: "We're the nitrous boost of the prop world — offering 1:200 leverage, massive 15%,8% drawdowns, instant access funding, and zero fluff. While others hold you back with baby rules and slow payouts, we throw you straight into the deep end — where real traders thrive."
                },
                {
                  question: "How fast can I start trading live capital?",
                  questionShort: "Instantly.",
                  answer: "With our Instant Funding model, there's no waiting, no phases, no warm-ups. You hit the ground running — with real buying power, real leverage, and real upside. You're live the moment your payment clears. No delays. No games. With our standard challenge you can get funded within 8 trading days."
                },
                {
                  question: "What's the profit split and how do payouts work?",
                  questionShort: "Standard - 90%, Instant - 70%",
                  answer: "Our payouts are lightning fast, and we offer industry-leading terms with a one free retry if you stumble on our instant funding account. We reward precision, not perfection."
                },
                {
                  question: "What are the rules? Are they trader-friendly?",
                  questionShort: "Let's put it this way:\nWe're aggressive — but fair.",
                  answer: "Standard:\nMax Daily Drawdown: 8%\nMax Total Drawdown: 15%\nLeverage: 1:200\nMinimum Profitable Days: 4\nTarget: 12%/6%\n\nInstant:\nMax Daily Drawdown: 4%\nMax Total Drawdown: 8%\nLeverage: 1:200\nMinimum Profitable Days: 5\nTarget: 12%\n\nWe give you the tools to blow up the charts — not your account."
                },
                {
                  question: "Can I swing trade, scalp, hold over news, or use EAs?",
                  questionShort: "Hell yes.",
                  answer: "We're not here to clip your wings — we're here to hand you the throttle. Use your strategy, your way.\nScalp, swing, algorithmic? As long as you play within the risk rules, the market is yours."
                },
                {
                  question: "What happens if I fail? Do I lose everything?",
                  questionShort: "Not with Shockwave.",
                  answer: "Every challenger on our Instant Funding account gets one free retry — because we know great traders sometimes have off days. We don't punish that. We back those who fight back. On our Standard Challenge if you fail you can reset for 199$ and try again!"
                }
              ].map(({ question, questionShort, answer }) => (
                <div
                  key={question}
                  className="group relative bg-gradient-to-br from-[#0FF1CE]/10 to-[#0FF1CE]/5 backdrop-blur-sm rounded-2xl p-6 hover:scale-105 transition-all duration-300"
                  style={{
                    boxShadow: '0 0 20px rgba(15, 241, 206, 0.1)'
                  }}
                >
                  {/* Chat Container */}
                  <div className="space-y-4">
                    {/* Trader Question */}
                    <div className="flex flex-col space-y-2">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                          <span className="text-sm text-white">T</span>
                        </div>
                        <span className="text-gray-400 text-sm">Trader</span>
                      </div>
                      <div className="bg-gray-800 rounded-2xl rounded-tl-none p-4 text-white text-sm">
                        {question}
                      </div>
                    </div>

                    {/* Shockwave Response */}
                    <div className="flex flex-col space-y-2">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-8 h-8 rounded-full bg-[#0FF1CE] flex items-center justify-center">
                          <span className="text-sm text-black font-bold">S</span>
                        </div>
                        <span className="text-[#0FF1CE] text-sm">Shockwave</span>
                      </div>
                      <div className="bg-[#0FF1CE]/10 backdrop-blur-sm rounded-2xl rounded-tl-none p-4">
                        <p className="text-[#0FF1CE] font-bold mb-2">{questionShort}</p>
                        <p className="text-gray-300 text-sm whitespace-pre-line">{answer}</p>
                      </div>
                    </div>
                  </div>

                  {/* Hover gradient overlay */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#0FF1CE]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              ))}
            </div>
          </div>
          
          {/* CTA Button */}
          <div className="max-w-4xl mx-auto mt-16 text-center">
            <button className="px-8 md:px-12 py-3 md:py-4 bg-[#0FF1CE] text-black text-sm md:text-xl font-bold rounded-lg hover:scale-105 transition-transform shadow-lg hover:shadow-[#0FF1CE]/20">
              Stop coasting and go full throttle
            </button>
          </div>
        </section>
  
        {/* Community & Newsletter Section */}
        <section className="py-20 px-6 bg-[#121212] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[#0FF1CE]/5 blur-[100px] rounded-full"></div>
          <div className="relative z-10">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Discord Community */}
              <div className="relative bg-gradient-to-br from-[#0FF1CE]/10 to-[#0FF1CE]/5 backdrop-blur-sm rounded-2xl p-8 hover:scale-105 transition-all duration-300"
                style={{
                  boxShadow: '0 0 20px rgba(15, 241, 206, 0.1)'
                }}>
                <div className="flex flex-col h-full justify-between">
                  <div>
                    <h2 className="text-3xl md:text-4xl font-bold text-[#0FF1CE] mb-4">LEARN FROM OUR DISCORD COMMUNITY</h2>
                    <a href="#" className="inline-block mt-6 text-[#0FF1CE] hover:text-[#0FF1CE]/80 font-bold text-lg transition-colors">
                      JOIN OUR DISCORD →
                    </a>
                  </div>
                  <div className="mt-8">
                    <svg viewBox="0 0 127.14 96.36" className="w-32 h-32 ml-auto" fill="#0FF1CE" opacity="0.2">
                      <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z"/>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Email Signup */}
              <div className="relative bg-gradient-to-br from-[#0FF1CE]/10 to-[#0FF1CE]/5 backdrop-blur-sm rounded-2xl p-8 hover:scale-105 transition-all duration-300"
                style={{
                  boxShadow: '0 0 20px rgba(15, 241, 206, 0.1)'
                }}>
                <h2 className="text-3xl md:text-4xl font-bold text-[#0FF1CE] mb-6">Subscribe for Email Updates</h2>
                <form className="space-y-4">
                  <div>
                    <label htmlFor="fullName" className="block text-white mb-2">Full Name</label>
                    <input
                      type="text"
                      id="fullName"
                      placeholder="Type your name"
                      className="w-full px-4 py-3 bg-[#181818] border border-[#0FF1CE]/20 rounded-lg focus:outline-none focus:border-[#0FF1CE] text-white placeholder-gray-400"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-white mb-2">Email*</label>
                    <input
                      type="email"
                      id="email"
                      placeholder="Type your email"
                      className="w-full px-4 py-3 bg-[#181818] border border-[#0FF1CE]/20 rounded-lg focus:outline-none focus:border-[#0FF1CE] text-white placeholder-gray-400"
                    />
                  </div>
                  <button type="submit" className="w-full md:w-auto px-8 py-3 bg-[#0FF1CE] text-black font-bold rounded-lg hover:scale-105 transition-transform">
                    Submit
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
  
        {/* Footer Section */}
        <footer className="bg-[#121212] border-t border-[#2F2F2F] pt-16 pb-8">
          <div className="max-w-7xl mx-auto px-6">
            {/* Footer Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
              {/* Brand Column */}
              <div className="space-y-6">
                <Image
                  src="/logo.png"
                  alt="Shockwave Capital"
                  width={120}
                  height={120}
                  className="h-auto w-auto"
                />
                <p className="text-gray-400 text-sm">
                  High-octane funding for elite traders. Push your trading into Overdrive with industry-leading leverage and conditions.
                </p>
                <div className="flex space-x-4">
                  {[
                    { icon: "twitter", href: "#" },
                    { icon: "discord", href: "#" },
                    { icon: "telegram", href: "#" },
                    { icon: "instagram", href: "#" }
                  ].map(({ icon, href }) => (
                    <a
                      key={icon}
                      href={href}
                      className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#0FF1CE]/10 to-[#0FF1CE]/5 backdrop-blur-sm flex items-center justify-center group hover:scale-110 transition-all duration-300"
                      style={{ boxShadow: '0 0 20px rgba(15, 241, 206, 0.1)' }}
                    >
                      <span className="text-[#0FF1CE] group-hover:text-white transition-colors">
                        {icon === 'twitter' && (
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                          </svg>
                        )}
                        {icon === 'discord' && (
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
                          </svg>
                        )}
                        {icon === 'telegram' && (
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19c-.14.75-.42 1-.68 1.03c-.58.05-1.02-.38-1.58-.75c-.88-.58-1.38-.94-2.23-1.5c-.99-.65-.35-1.01.22-1.59c.15-.15 2.71-2.48 2.76-2.69c.01-.03-.01-.06-.03-.05c-.11.03-1.79 1.14-2.71 1.71c-.16.1-.51.33-1.09.33c-.58 0-1.58-.31-2.25-.57c-.91-.36-1.77-.79-1.77-1.77c0-.37.19-.67.48-.67c.89 0 2.12 1.28 2.12 1.28s3.72-1.58 5.57-2.38c.33-.14.73-.44 1.19-.44c.21 0 .41.08.54.23c.22.22.23.54.2.84z"/>
                          </svg>
                        )}
                        {icon === 'instagram' && (
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12.315 2c2.43 0 2.784.013 3.808.06c1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153a4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427c.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043c-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772a4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465c-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06c-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153a4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427c-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808c.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058c-.975.045-1.504.207-1.857.344c-.467.182-.8.398-1.15.748c-.35.35-.566.683-.748 1.15c-.137.353-.3.882-.344 1.857c-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807c.045.975.207 1.504.344 1.857c.182.466.399.8.748 1.15c.35.35.683.566 1.15.748c.353.137.882.3 1.857.344c1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058c.976-.045 1.505-.207 1.858-.344c.466-.182.8-.398 1.15-.748c.35-.35.566-.683.748-1.15c.137-.353.3-.882.344-1.857c.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96c-.045-.976-.207-1.505-.344-1.858c-.182-.466-.398-.8-.748-1.15c-.35-.35-.683-.566-1.15-.748c-.353-.137-.882-.3-1.857-.344c-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"/>
                          </svg>
                        )}
                      </span>
                    </a>
                  ))}
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h3 className="text-[#0FF1CE] font-bold text-lg mb-6">Quick Links</h3>
                <ul className="space-y-4">
                  {['Home', 'Challenge', 'Pricing', 'FAQ', 'Client Area'].map(link => (
                    <li key={link}>
                      <a href="#" className="text-gray-400 hover:text-[#0FF1CE] transition-colors">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Resources */}
              <div>
                <h3 className="text-[#0FF1CE] font-bold text-lg mb-6">Resources</h3>
                <ul className="space-y-4">
                  {['Trading Rules', 'Terms of Service', 'Privacy Policy', 'Support Center', 'Contact Us'].map(link => (
                    <li key={link}>
                      <a href="#" className="text-gray-400 hover:text-[#0FF1CE] transition-colors">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Newsletter */}
              <div>
                <h3 className="text-[#0FF1CE] font-bold text-lg mb-6">Stay Updated</h3>
                <p className="text-gray-400 text-sm mb-4">Subscribe to our newsletter for the latest updates and exclusive offers.</p>
                <form className="space-y-3">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full px-4 py-2 bg-[#181818] border border-[#0FF1CE]/20 rounded-lg focus:outline-none focus:border-[#0FF1CE] text-white placeholder-gray-400"
                  />
                  <button type="submit" className="w-full px-4 py-2 bg-[#0FF1CE] text-black font-bold rounded-lg hover:scale-105 transition-transform">
                    Subscribe
                  </button>
                </form>
              </div>
            </div>

            {/* Disclaimer and Copyright */}
            <div className="border-t border-[#2F2F2F] pt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="text-xs text-gray-500">
                  <p className="mb-2">
                    Trading foreign exchange and futures carries a high level of risk and may not be suitable for all investors. The high degree of leverage can work against you as well as for you.
                  </p>
                  <p>
                    &copy; {new Date().getFullYear()} Shockwave Capital. All rights reserved.
                  </p>
                </div>
                <div className="flex flex-wrap gap-4 md:justify-end text-xs">
                  <a href="#" className="text-gray-400 hover:text-[#0FF1CE] transition-colors">Terms</a>
                  <a href="#" className="text-gray-400 hover:text-[#0FF1CE] transition-colors">Privacy</a>
                  <a href="#" className="text-gray-400 hover:text-[#0FF1CE] transition-colors">Cookies</a>
                </div>
              </div>
            </div>
          </div>
        </footer>

        {/* Features Section */}
        <style jsx global>{`
          @keyframes float {
            0% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-10px);
            }
            100% {
              transform: translateY(0px);
            }
          }
        `}</style>
      </div>
    );
  }
  