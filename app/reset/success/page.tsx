'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Particles from '../../components/Particles';
import { Check, RefreshCw, Mail, Clock, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function ResetSuccessPage() {
  const router = useRouter();
  const [resetData, setResetData] = useState<any>(null);

  useEffect(() => {
    const storedData = sessionStorage.getItem('resetData');
    if (storedData) {
      setResetData(JSON.parse(storedData));
    }
  }, []);

  return (
    <div className="bg-gradient-to-b from-[#0D0D0D] via-[#121212] to-[#151515] text-white min-h-screen font-sans">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full bg-[#0FF1CE]/[0.02] background-noise"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full md:w-3/4 h-full rounded-full bg-[#0FF1CE]/[0.03] blur-[150px] opacity-60"></div>
      <Particles />

      {/* Main Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-[#0FF1CE] to-[#00D4FF] flex items-center justify-center">
            <Check className="text-black" size={40} />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Reset Request Submitted! 🎉</h1>
          <p className="text-xl text-gray-300">Your account reset is being processed</p>
        </div>

        {/* Status Card */}
        <div className="bg-[#0D0D0D]/80 backdrop-blur-sm rounded-2xl p-8 border border-[#2F2F2F]/50 mb-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-full bg-[#0FF1CE]/10 flex items-center justify-center flex-shrink-0">
              <RefreshCw className="text-[#0FF1CE]" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white mb-2">Account Reset in Progress</h2>
              <p className="text-gray-400">
                We've received your payment and are now processing your account reset. 
                Your new account credentials will be sent to your email within the next few minutes.
              </p>
            </div>
          </div>

          {resetData && (
            <div className="bg-[#151515] rounded-xl p-6 border border-[#2F2F2F]/50">
              <h3 className="text-lg font-medium text-white mb-4">Reset Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-400">Challenge Type</div>
                  <div className="font-medium text-white">{resetData.type}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Account Size</div>
                  <div className="font-medium text-white">{resetData.amount}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Platform</div>
                  <div className="font-medium text-white">{resetData.platform}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Email</div>
                  <div className="font-medium text-white">{resetData.formData?.email}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Next Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* What Happens Next */}
          <div className="bg-[#0D0D0D]/80 backdrop-blur-sm rounded-2xl p-6 border border-[#2F2F2F]/50">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="text-[#0FF1CE]" size={24} />
              <h3 className="text-lg font-semibold text-white">What Happens Next?</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#0FF1CE] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-black text-sm font-bold">1</span>
                </div>
                <div>
                  <div className="font-medium text-white">Payment Verification</div>
                  <div className="text-sm text-gray-400">We verify your crypto payment on the blockchain</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#0FF1CE] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-black text-sm font-bold">2</span>
                </div>
                <div>
                  <div className="font-medium text-white">Account Creation</div>
                  <div className="text-sm text-gray-400">Fresh account is created with reset drawdown</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#0FF1CE] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-black text-sm font-bold">3</span>
                </div>
                <div>
                  <div className="font-medium text-white">Credentials Sent</div>
                  <div className="text-sm text-gray-400">New login details emailed to you</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#0FF1CE] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-black text-sm font-bold">4</span>
                </div>
                <div>
                  <div className="font-medium text-white">Start Trading</div>
                  <div className="text-sm text-gray-400">Log in and begin your fresh challenge</div>
                </div>
              </div>
            </div>
          </div>

          {/* Important Information */}
          <div className="bg-[#0D0D0D]/80 backdrop-blur-sm rounded-2xl p-6 border border-[#2F2F2F]/50">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="text-orange-500" size={24} />
              <h3 className="text-lg font-semibold text-white">Important Information</h3>
            </div>
            <div className="space-y-4">
              <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3">
                <div className="font-medium text-orange-500 mb-1">Previous Account Closure</div>
                <div className="text-sm text-gray-300">
                  Your previous account has been permanently closed and cannot be recovered.
                </div>
              </div>
              <div className="bg-[#0FF1CE]/10 border border-[#0FF1CE]/20 rounded-lg p-3">
                <div className="font-medium text-[#0FF1CE] mb-1">Check Your Email</div>
                <div className="text-sm text-gray-300">
                  New credentials will be sent to your email within 5-10 minutes.
                </div>
              </div>
              <div className="bg-gray-500/10 border border-gray-500/20 rounded-lg p-3">
                <div className="font-medium text-gray-300 mb-1">Processing Time</div>
                <div className="text-sm text-gray-400">
                  Crypto payments may take up to 30 minutes to confirm depending on network conditions.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Support Section */}
        <div className="bg-[#0D0D0D]/80 backdrop-blur-sm rounded-2xl p-6 border border-[#2F2F2F]/50 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Mail className="text-[#0FF1CE]" size={24} />
            <h3 className="text-lg font-semibold text-white">Need Help?</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="font-medium text-white mb-2">Contact Support</div>
              <div className="text-sm text-gray-400 mb-3">
                If you don't receive your credentials within 30 minutes, or if you have any questions:
              </div>
              <a 
                href="mailto:support@shockwave-capital.com" 
                className="inline-flex items-center gap-2 bg-[#0FF1CE]/10 hover:bg-[#0FF1CE]/20 text-[#0FF1CE] px-4 py-2 rounded-lg transition-colors"
              >
                <Mail size={16} />
                Email Support
              </a>
            </div>
            <div>
              <div className="font-medium text-white mb-2">Join Our Community</div>
              <div className="text-sm text-gray-400 mb-3">
                Connect with other traders and get updates on your challenges:
              </div>
              <a 
                href="https://discord.gg/shockwave" 
                className="inline-flex items-center gap-2 bg-[#5865F2]/10 hover:bg-[#5865F2]/20 text-[#5865F2] px-4 py-2 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.120.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
                Join Discord
              </a>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/dashboard" 
            className="bg-[#0FF1CE] hover:bg-[#0FF1CE]/90 text-black font-medium px-8 py-3 rounded-lg transition-colors text-center"
          >
            Go to Dashboard
          </Link>
          <Link 
            href="/reset" 
            className="bg-[#1A1A1A] hover:bg-[#212121] border border-[#2F2F2F]/50 text-white font-medium px-8 py-3 rounded-lg transition-colors text-center"
          >
            Reset Another Account
          </Link>
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