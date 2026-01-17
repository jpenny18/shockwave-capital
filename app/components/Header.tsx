import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'FAQ', href: '/#faq' },
    { name: 'How Shockwave Operates', href: '/How-Shockwave-Operates' },
    { name: 'Shockwave Pulse', href: '/Shockwave-Pulse' }
  ];

  return (
    <header className="fixed w-full top-0 z-50 bg-[#121212]/80 backdrop-blur-sm border-b border-[#2F2F2F]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white p-2"
            >
              <div className="w-6 h-5 relative flex flex-col justify-between">
                <span className={`w-full h-0.5 bg-white transform transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
                <span className={`w-full h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`} />
                <span className={`w-full h-0.5 bg-white transform transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
              </div>
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-white hover:text-[#0FF1CE] transition-colors"
              >
                {item.name}
              </a>
            ))}
          </nav>

          {/* Logo */}
          <div className={`absolute left-1/2 top-1/2 -translate-x-1/2 md:-translate-x-1/2 -translate-y-1/2 md:left-1/2 left-[calc(50%-40px)] ${isMenuOpen ? 'md:block hidden' : 'block'}`}>
            <Link href="/">
              <Image
                src="/logo.png"
                alt="Shockwave Capital"
                width={80}
                height={80}
                className="h-auto w-auto"
                priority
              />
            </Link>
          </div>

          {/* Client Area Button */}
          <div>
            <Link href="/auth">
              <button className="group relative bg-gradient-to-r from-[#0FF1CE]/10 to-[#00D9FF]/10 backdrop-blur-sm border border-[#0FF1CE]/30 text-[#0FF1CE] px-6 py-2.5 rounded-lg font-semibold hover:border-[#0FF1CE]/50 hover:from-[#0FF1CE]/20 hover:to-[#00D9FF]/20 transition-all duration-300">
                <span className="relative z-10">Client Area</span>
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#0FF1CE]/0 to-[#00D9FF]/0 group-hover:from-[#0FF1CE]/10 group-hover:to-[#00D9FF]/10 transition-all duration-300"></div>
              </button>
            </Link>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out ${
            isMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
          } overflow-hidden`}
        >
          <nav className="py-4 space-y-4">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="block text-white hover:text-[#0FF1CE] transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
} 