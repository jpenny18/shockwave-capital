'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Particles from '../components/Particles';
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock,
  User,
  ArrowRight,
  Check,
  AlertCircle,
  Rocket,
  Zap,
  Shield,
  TrendingUp,
  X,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { registerUser, signInUser, resetPassword } from '@/lib/firebase';
import { auth } from '@/lib/firebase';

interface AuthData {
  email: string;
  password: string;
  rememberMe: boolean;
  name?: string;
}

interface AuthErrors {
  [key: string]: string | undefined;
}

// Launch Modal Component
const LaunchModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full h-full max-w-7xl max-h-[90vh] m-4 bg-[#0D0D0D] rounded-2xl border border-[#0FF1CE]/30 overflow-hidden shadow-2xl">
        {/* Header with close button */}
        <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-[#0D0D0D]/95 backdrop-blur-sm border-b border-[#2F2F2F]/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#0FF1CE]/20 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[#0FF1CE]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#0FF1CE]">New Launch Preview</h3>
              <p className="text-xs text-gray-400">See what's coming to Shockwave Capital</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Link 
              href="/launch" 
              target="_blank"
              className="flex items-center gap-1 px-3 py-1.5 text-xs bg-[#0FF1CE]/10 text-[#0FF1CE] rounded-lg hover:bg-[#0FF1CE]/20 transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
              Open Full Page
            </Link>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#2F2F2F]/50 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        {/* Iframe Content */}
        <div className="w-full h-full pt-16">
          <iframe
            src="/launch"
            className="w-full h-full border-0"
            title="Shockwave Capital Launch Preview"
          />
        </div>
      </div>
    </div>
  );
};

const FloatingLabelInput = ({ 
  id, 
  label, 
  icon: Icon, 
  type = 'text',
  required = false,
  value,
  onChange,
  error
}: {
  id: string;
  label: string;
  icon: any;
  type?: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative">
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
          <Icon size={18} className={`transition-all duration-300 ${value.length > 0 || isFocused ? 'text-[#0FF1CE]' : 'text-gray-500'}`} />
        </div>
        <input
          id={id}
          type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
          className={`
            w-full bg-[#1A1A1A]/50 backdrop-blur-sm border rounded-xl pl-11 pr-4 py-4 text-white 
            transition-all duration-300 focus:outline-none
            ${value.length > 0 || isFocused ? 'border-[#0FF1CE]/50 bg-[#0FF1CE]/5' : 'border-[#2F2F2F]/50 hover:border-[#2F2F2F]'}
            ${error ? 'border-red-500/50 bg-red-500/5' : ''}
            placeholder:text-gray-500 text-sm md:text-base
          `}
          placeholder={label}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-500 hover:text-[#0FF1CE] transition-colors"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
        {/* Glow effect on focus */}
        <div className={`absolute inset-0 rounded-xl bg-[#0FF1CE]/20 blur-xl transition-opacity duration-300 pointer-events-none ${isFocused ? 'opacity-100' : 'opacity-0'}`}></div>
      </div>
      {error && (
        <p className="mt-2 text-xs md:text-sm text-red-400 flex items-center gap-1 animate-shake">
          <AlertCircle size={14} />
          {error}
        </p>
      )}
    </div>
  );
};

export default function EarlyAccessPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [rememberMe, setRememberMe] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptDisclaimer, setAcceptDisclaimer] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showLaunchModal, setShowLaunchModal] = useState(false);
  const [formData, setFormData] = useState<AuthData>({
    email: '',
    password: '',
    rememberMe: false,
    name: ''
  });
  const [errors, setErrors] = useState<AuthErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState('');

  // Check if user is already logged in
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user && !loading) {
        router.push('/');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router, loading]);

  // Show launch modal after a delay when page loads
  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => {
        setShowLaunchModal(true);
      }, 2000); // Show modal after 2 seconds

      return () => clearTimeout(timer);
    }
  }, [loading]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0D0D0D]">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-[#0FF1CE]/20 rounded-full animate-spin"></div>
          <div className="w-12 h-12 border-4 border-[#0FF1CE] border-t-transparent rounded-full animate-spin absolute inset-0"></div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);
    setSuccess('');

    try {
      // For login form
      if (isLogin) {
        // Validation
        if (!formData.email || !formData.password) {
          setErrors({ 
            email: !formData.email ? 'Please enter your email address' : undefined,
            password: !formData.password ? 'Please enter your password' : undefined
          });
          setIsSubmitting(false);
          return;
        }

        if (!acceptDisclaimer) {
          setErrors({ disclaimer: 'You must acknowledge and accept the disclaimer' });
          setIsSubmitting(false);
          return;
        }

        // Sign in with Firebase
        await signInUser(formData.email, formData.password);
        // If successful, redirect to main page
        router.push('/');
      } else {
        // For registration form
        // Validation
        if (!formData.email || !formData.password || !formData.name) {
          setErrors({ 
            email: !formData.email ? 'Please enter your email address' : undefined,
            password: !formData.password ? 'Please enter your password' : undefined,
            name: !formData.name ? 'Please enter your name' : undefined
          });
          setIsSubmitting(false);
          return;
        }

        if (!acceptTerms || !acceptDisclaimer) {
          setErrors({ 
            terms: !acceptTerms ? 'You must accept the terms and conditions' : undefined,
            disclaimer: !acceptDisclaimer ? 'You must acknowledge and accept the disclaimer' : undefined
          });
          setIsSubmitting(false);
          return;
        }

        // Password strength check
        if (formData.password.length < 6) {
          setErrors({ password: 'Password must be at least 6 characters' });
          setIsSubmitting(false);
          return;
        }

        // Register with Firebase
        const nameParts = formData.name.split(' ');
        const firstName = nameParts[0];
        const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';

        await registerUser(formData.email, formData.password, {
          displayName: formData.name,
          firstName: firstName,
          lastName: lastName
        });

        // If successful, redirect to main page
        router.push('/');
      }
    } catch (error: any) {
      console.error('Authentication error:', error);
      // Handle different Firebase auth errors
      const errorCode = error.code;
      let errorMessage = 'An unexpected error occurred. Please try again.';
      
      switch (errorCode) {
        case 'auth/email-already-in-use':
          errorMessage = 'This email address is already in use.';
          setErrors({ email: errorMessage });
          break;
        case 'auth/invalid-email':
          errorMessage = 'The email address is not valid.';
          setErrors({ email: errorMessage });
          break;
        case 'auth/user-disabled':
          errorMessage = 'This user account has been disabled.';
          setErrors({ general: errorMessage });
          break;
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          errorMessage = 'Invalid email or password.';
          setErrors({ general: errorMessage });
          break;
        case 'auth/weak-password':
          errorMessage = 'The password is too weak.';
          setErrors({ password: errorMessage });
          break;
        default:
          setErrors({ general: errorMessage });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-[#0D0D0D] via-[#0D0D0D] to-[#151515] text-white relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-[#0FF1CE]/10 rounded-full blur-[150px] animate-pulse"></div>
          <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-[#0FF1CE]/10 rounded-full blur-[150px] animate-pulse delay-1000"></div>
        </div>
        <Particles />
        
        {/* Launch Modal */}
        <LaunchModal isOpen={showLaunchModal} onClose={() => setShowLaunchModal(false)} />
        
        <div className="relative z-10 flex min-h-screen">
          {/* Left Panel - Hidden on mobile */}
          <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12 relative">
            <div className="max-w-lg relative">
              {/* Animated Background Card */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#0FF1CE]/20 to-[#0FF1CE]/5 rounded-3xl blur-xl animate-pulse"></div>
              
              <div className="relative">
                {/* Logo */}
                <div className="mb-8 animate-float flex justify-center">
                  <div className="w-20 h-20 bg-[#0FF1CE]/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-[#0FF1CE]/30">
                    <Rocket className="w-10 h-10 text-[#0FF1CE]" />
                  </div>
                </div>

                {/* Welcome Text */}
                <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-[#0FF1CE] to-[#00D4FF] bg-clip-text text-transparent">
                  The Future of Trading
                </h1>
                <p className="text-xl text-gray-300 mb-12 leading-relaxed">
                  Become one of our elite traders in our high-octane trading environment.
                </p>

                {/* Feature Cards */}
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-[#1A1A1A]/50 backdrop-blur-sm rounded-xl border border-[#2F2F2F]/50 hover:border-[#0FF1CE]/30 transition-all">
                    <div className="w-12 h-12 bg-[#0FF1CE]/10 rounded-xl flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-[#0FF1CE]" />
                    </div>
                    <div>
                    <h3 className="font-semibold text-white">15% Max Drawdown</h3>
                    <p className="text-sm text-gray-400">Trade with confidence</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-[#1A1A1A]/50 backdrop-blur-sm rounded-xl border border-[#2F2F2F]/50 hover:border-[#0FF1CE]/30 transition-all">
                    <div className="w-12 h-12 bg-[#0FF1CE]/10 rounded-xl flex items-center justify-center">
                      <Zap className="w-6 h-6 text-[#0FF1CE]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">1:200 Leverage</h3>
                      <p className="text-sm text-gray-400">Maximum trading power</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-[#1A1A1A]/50 backdrop-blur-sm rounded-xl border border-[#2F2F2F]/50 hover:border-[#0FF1CE]/30 transition-all">
                    <div className="w-12 h-12 bg-[#0FF1CE]/10 rounded-xl flex items-center justify-center">
                      <Shield className="w-6 h-6 text-[#0FF1CE]" />
                    </div>
                    <div>
                    <h3 className="font-semibold text-white">Up to 100% Profit Split</h3>
                    <p className="text-sm text-gray-400">Keep more of what you earn</p>
                      
                    </div>
                  </div>
                </div>

                {/* New Launch Preview Button */}
                <div className="mt-8">
                  <button
                    onClick={() => setShowLaunchModal(true)}
                    className="w-full flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-[#0FF1CE]/20 to-[#00D4FF]/20 rounded-xl border border-[#0FF1CE]/30 hover:from-[#0FF1CE]/30 hover:to-[#00D4FF]/30 transition-all group"
                  >
                    <Sparkles className="w-5 h-5 text-[#0FF1CE] group-hover:animate-pulse" />
                    <div className="text-left">
                      <h4 className="font-semibold text-[#0FF1CE]">New Launch Preview</h4>
                      <p className="text-xs text-gray-400">See what's coming next</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#0FF1CE] group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Auth Form */}
          <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12">
            <div className="w-full max-w-md">
              {/* Mobile Logo */}
              <div className="lg:hidden text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#0FF1CE]/10 backdrop-blur-sm border border-[#0FF1CE]/30 mb-4">
                  <Rocket className="w-8 h-8 text-[#0FF1CE]" />
                </div>
                <h2 className="text-2xl font-bold text-[#0FF1CE]">Shockwave Capital</h2>
                
                {/* Mobile Launch Preview Button */}
                <button
                  onClick={() => setShowLaunchModal(true)}
                  className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-[#0FF1CE]/10 rounded-lg border border-[#0FF1CE]/30 text-sm text-[#0FF1CE] hover:bg-[#0FF1CE]/20 transition-colors"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>See New Launch</span>
                </button>
              </div>

              {/* Tab Switcher */}
              <div className="flex bg-[#1A1A1A]/30 backdrop-blur-sm rounded-xl p-1 mb-8">
                <button
                  onClick={() => {
                    setIsLogin(true);
                    setErrors({});
                  }}
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${
                    isLogin 
                      ? 'bg-[#0FF1CE] text-black' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    setIsLogin(false);
                    setErrors({});
                  }}
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${
                    !isLogin 
                      ? 'bg-[#0FF1CE] text-black' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Sign Up
                </button>
              </div>

              {/* Promo Badge - Simplified for mobile */}
              <div className="mb-6 p-4 bg-gradient-to-r from-[#0FF1CE]/10 to-[#00D4FF]/10 rounded-xl border border-[#0FF1CE]/20 backdrop-blur-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-[#0FF1CE]/20 rounded-full blur-3xl"></div>
                <div className="relative">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-5 h-5 text-[#0FF1CE]" />
                    <span className="text-sm font-bold text-white">Limited Time Offer</span>
                  </div>
                  <div className="text-xl md:text-2xl font-bold text-[#0FF1CE]">SAVE 30%</div>
                  <div className="text-xs text-gray-300 mt-1">Use code: <span className="font-mono font-bold text-[#0FF1CE]">SHOCKWAVE</span></div>
                </div>
              </div>

              {success && (
                <div className="mb-6 p-4 bg-green-500/10 backdrop-blur-sm border border-green-500/30 rounded-xl text-green-400 flex items-center gap-2 animate-slideIn">
                  <Check size={18} />
                  <span className="text-sm">{success}</span>
                </div>
              )}

              {errors.general && (
                <div className="mb-6 p-4 bg-red-500/10 backdrop-blur-sm border border-red-500/30 rounded-xl text-red-400 flex items-center gap-2 animate-shake">
                  <AlertCircle size={18} />
                  <span className="text-sm">{errors.general}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {!isLogin && (
                  <FloatingLabelInput
                    id="name"
                    label="Full Name"
                    icon={User}
                    value={formData.name || ''}
                    onChange={(value) => setFormData({ ...formData, name: value })}
                    error={errors.name}
                    required
                  />
                )}

                <FloatingLabelInput
                  id="email"
                  label="Email Address"
                  icon={Mail}
                  type="email"
                  value={formData.email}
                  onChange={(value) => setFormData({ ...formData, email: value })}
                  error={errors.email}
                  required
                />

                <FloatingLabelInput
                  id="password"
                  label="Password"
                  icon={Lock}
                  type="password"
                  value={formData.password}
                  onChange={(value) => setFormData({ ...formData, password: value })}
                  error={errors.password}
                  required
                />

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-600 text-[#0FF1CE] focus:ring-[#0FF1CE] focus:ring-offset-0 bg-[#1A1A1A]/50 backdrop-blur-sm"
                    />
                    <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">Remember me</span>
                  </label>
                </div>

                {/* Simplified Disclaimer for Mobile */}
                <div className="space-y-3">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      id="disclaimer"
                      checked={acceptDisclaimer}
                      onChange={(e) => setAcceptDisclaimer(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-600 text-[#0FF1CE] focus:ring-[#0FF1CE] focus:ring-offset-0 bg-[#1A1A1A]/50 backdrop-blur-sm mt-0.5"
                    />
                    <span className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors">
                      I acknowledge the simulated environment and agree to the{' '}
                      <Link href="/terms" className="text-[#0FF1CE] hover:underline">Terms</Link>,{' '}
                      <Link href="/privacy" className="text-[#0FF1CE] hover:underline">Privacy</Link>, and{' '}
                      <Link href="/disclaimer" className="text-[#0FF1CE] hover:underline">Disclaimer</Link>
                    </span>
                  </label>

                  {!isLogin && (
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        id="terms"
                        checked={acceptTerms}
                        onChange={(e) => setAcceptTerms(e.target.checked)}
                        className="w-4 h-4 rounded border-gray-600 text-[#0FF1CE] focus:ring-[#0FF1CE] focus:ring-offset-0 bg-[#1A1A1A]/50 backdrop-blur-sm mt-0.5"
                      />
                      <span className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors">
                        I accept the Terms of Service and Privacy Policy
                      </span>
                    </label>
                  )}

                  {(errors.disclaimer || errors.terms) && (
                    <p className="text-xs text-red-400 flex items-center gap-1 animate-shake">
                      <AlertCircle size={14} />
                      {errors.disclaimer || errors.terms}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="relative w-full bg-[#0FF1CE] text-black font-bold py-4 px-4 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#0FF1CE] to-[#00D4FF] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center justify-center gap-2">
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </div>
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-400">
                  {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
                  <button
                    onClick={() => {
                      setIsLogin(!isLogin);
                      setErrors({});
                      setSuccess('');
                    }}
                    className="text-[#0FF1CE] hover:underline font-semibold"
                  >
                    {isLogin ? 'Sign Up' : 'Sign In'}
                  </button>
                </p>
              </div>

              {/* Compact Disclaimer for Mobile */}
              <div className="mt-8">
                <details className="group">
                  <summary className="flex items-center gap-2 text-xs text-gray-500 cursor-pointer hover:text-gray-400 transition-colors">
                    <Shield className="w-4 h-4 text-orange-400" />
                    <span>Important Disclaimer</span>
                    <span className="ml-auto group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <div className="mt-4 p-4 bg-gradient-to-br from-orange-500/10 to-amber-500/10 rounded-xl border border-orange-500/20 text-xs text-gray-400 space-y-2 animate-slideIn">
                    <p>⚠️ <strong>Shockwave Capital offers access to a simulated trading environment for the sole purpose of evaluating trading skill and discipline.</strong> All trading activity occurs on demo accounts using real-time market data. No actual capital is deposited, invested, or traded on behalf of users.</p>
                    
                    <p>References to "funding," "capital," "payouts," or "profit splits" pertain exclusively to performance-based simulations and do not imply the transfer or management of real funds.</p>
                    
                    <p>Participation in Shockwave Capital's programs is strictly for educational and evaluative purposes and does not constitute financial advice, investment services, or brokerage activity.</p>
                    
                    <p className="text-orange-400 font-semibold pt-2">By signing up or logging in, you confirm that:</p>
                    
                    <ul className="space-y-1 ml-4 list-disc">
                      <li>You are not participating in real-money or live trading.</li>
                      <li>You understand this platform is not a broker-dealer, investment advisor, or asset management firm.</li>
                      <li>Any rewards, incentives, or performance-based milestones are tied to simulated results and subject to our internal review and compliance criteria.</li>
                      <li>You accept these terms and agree to our full Terms of Use and Privacy Policy.</li>
                    </ul>
                    
                    <p className="text-orange-400 font-semibold pt-2">If you do not agree to these conditions, please do not proceed.</p>
                  </div>
                </details>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
          20%, 40%, 60%, 80% { transform: translateX(2px); }
        }

        @keyframes slideIn {
          from { 
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }

        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }

        .delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </>
  );
} 