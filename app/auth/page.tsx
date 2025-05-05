'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Particles from '../components/Particles';
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock,
  User,
  ArrowRight,
  Check
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface AuthData {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface AuthErrors {
  email?: string;
  password?: string;
  terms?: string;
}

const FloatingLabelInput = ({ 
  id, 
  type = 'text', 
  label, 
  icon: Icon,
  showPasswordToggle,
  ...props 
}: { 
  id: string;
  type?: string;
  label: string;
  icon: React.ElementType;
  showPasswordToggle?: boolean;
  [key: string]: any;
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [value, setValue] = useState('');

  const isFloating = isFocused || value.length > 0;

  return (
    <div className="relative">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Icon size={18} className={`transition-colors ${isFloating ? 'text-[#0FF1CE]' : 'text-gray-400'}`} />
        </div>
        <input
          id={id}
          type={showPassword ? 'text' : type}
          className={`
            w-full bg-[#1A1A1A] border rounded-lg pl-10 pr-4 py-3 text-white 
            transition-all focus:outline-none placeholder-transparent
            ${isFloating ? 'border-[#0FF1CE]' : 'border-[#2F2F2F]'}
          `}
          placeholder={label}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        <label
          htmlFor={id}
          className={`
            absolute left-10 transition-all pointer-events-none
            ${isFloating 
              ? '-top-2 text-xs text-[#0FF1CE] bg-[#0D0D0D] px-2' 
              : 'top-3 text-gray-400'
            }
          `}
        >
          {label}
        </label>
        {showPasswordToggle && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-white"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
    </div>
  );
};

const SocialButton = ({ icon, label }: { icon: string; label: string }) => (
  <button className="w-full flex items-center justify-center gap-3 py-2.5 px-4 bg-[#1A1A1A] border border-[#2F2F2F] rounded-lg text-white hover:border-[#0FF1CE]/30 transition-colors">
    <Image src={icon} alt={label} width={20} height={20} />
    <span>Continue with {label}</span>
  </button>
);

export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [rememberMe, setRememberMe] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [formData, setFormData] = useState<AuthData>({
    email: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState<AuthErrors>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    // For login form
    if (isLogin) {
      // Simple validation
      if (!formData.email || !formData.password) {
        setErrors({ email: 'Please fill in all fields', password: 'Please fill in all fields' });
        setLoading(false);
        return;
      }

      // Test credentials check
      if (formData.email === 'test@gmail.com' && formData.password === '12345') {
        setTimeout(() => {
          // Simulate API call delay
          setLoading(false);
          router.push('/dashboard');
        }, 1000);
      } else {
        setErrors({ email: 'Invalid email or password', password: 'Invalid email or password' });
        setLoading(false);
      }
    } else {
      // For registration form - just redirect to login for now
      setTimeout(() => {
        setLoading(false);
        setIsLogin(true);
        setErrors({});
      }, 1000);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full bg-[#0FF1CE]/[0.02] background-noise"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full md:w-3/4 h-full rounded-full bg-[#0FF1CE]/[0.03] blur-[150px] opacity-60"></div>
      <Particles />

      {/* Content */}
      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <Image
            src="/logo.png"
            alt="Shockwave Capital"
            width={360}
            height={160}
            className="h-30 w-auto"
          />
        </div>

        {/* Form Container */}
        <div className="bg-[#0D0D0D]/80 backdrop-blur-sm rounded-2xl p-8 border border-[#2F2F2F]/50">
          {/* Form Toggle */}
          <div className="flex space-x-1 mb-8 bg-[#1A1A1A]/50 backdrop-blur-sm rounded-lg p-1">
            <button
              onClick={() => {
                setIsLogin(true);
                setErrors({});
              }}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                isLogin
                  ? 'bg-[#0FF1CE] text-black'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Log in
            </button>
            <button
              onClick={() => {
                setIsLogin(false);
                setErrors({});
              }}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                !isLogin
                  ? 'bg-[#0FF1CE] text-black'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Register
            </button>
          </div>

          {/* Error message */}
          {Object.keys(errors).length > 0 && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-sm text-red-200">
              {Object.values(errors).join('\n')}
            </div>
          )}

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {!isLogin && (
              <FloatingLabelInput
                id="name"
                label="Full Name"
                icon={User}
                required
              />
            )}
            
            <div className="relative">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Mail size={18} className={`transition-colors ${formData.email.length > 0 ? 'text-[#0FF1CE]' : 'text-gray-400'}`} />
                </div>
                <input
                  id="email"
                  type="email"
                  className={`
                    w-full bg-[#1A1A1A] border rounded-lg pl-10 pr-4 py-3 text-white 
                    transition-all focus:outline-none
                    ${formData.email.length > 0 ? 'border-[#0FF1CE]' : 'border-[#2F2F2F]'}
                  `}
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
                <label
                  htmlFor="email"
                  className={`
                    absolute left-10 transition-all pointer-events-none
                    ${formData.email.length > 0 
                      ? '-top-2 text-xs text-[#0FF1CE] bg-[#0D0D0D] px-2' 
                      : 'top-3 text-gray-400'
                    }
                  `}
                >
                  Email Address
                </label>
              </div>
            </div>
            
            <div className="relative">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Lock size={18} className={`transition-colors ${formData.password.length > 0 ? 'text-[#0FF1CE]' : 'text-gray-400'}`} />
                </div>
                <input
                  id="password"
                  type="password"
                  className={`
                    w-full bg-[#1A1A1A] border rounded-lg pl-10 pr-10 py-3 text-white 
                    transition-all focus:outline-none
                    ${formData.password.length > 0 ? 'border-[#0FF1CE]' : 'border-[#2F2F2F]'}
                  `}
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
                <label
                  htmlFor="password"
                  className={`
                    absolute left-10 transition-all pointer-events-none
                    ${formData.password.length > 0 
                      ? '-top-2 text-xs text-[#0FF1CE] bg-[#0D0D0D] px-2' 
                      : 'top-3 text-gray-400'
                    }
                  `}
                >
                  Password
                </label>
              </div>
            </div>

            {!isLogin && (
              <>
                <FloatingLabelInput
                  id="confirmPassword"
                  type="password"
                  label="Confirm Password"
                  icon={Lock}
                  showPasswordToggle
                  required
                />
                
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="terms"
                      type="checkbox"
                      checked={acceptTerms}
                      onChange={(e) => setAcceptTerms(e.target.checked)}
                      className="w-4 h-4 border border-[#2F2F2F] rounded bg-[#1A1A1A] focus:ring-[#0FF1CE] focus:ring-2"
                    />
                  </div>
                  <label htmlFor="terms" className="ml-2 text-sm text-gray-400">
                    I agree to the{' '}
                    <Link href="/terms" className="text-[#0FF1CE] hover:underline">
                      Terms and Conditions
                    </Link>
                  </label>
                </div>
              </>
            )}

            {isLogin && (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 border border-[#2F2F2F] rounded bg-[#1A1A1A] focus:ring-[#0FF1CE] focus:ring-2"
                  />
                  <label htmlFor="remember" className="ml-2 text-sm text-gray-400">
                    Remember me
                  </label>
                </div>
                <Link href="/forgot-password" className="text-sm text-[#0FF1CE] hover:underline">
                  Forgot password?
                </Link>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`
                w-full bg-[#0FF1CE] text-black font-bold py-3 rounded-lg 
                hover:bg-[#0FF1CE]/90 transition-colors flex items-center justify-center gap-2
                ${loading ? 'opacity-70 cursor-not-allowed' : ''}
              `}
            >
              {loading ? (
                <>
                  <span className="inline-block h-4 w-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                  <span>{isLogin ? 'Logging in...' : 'Creating Account...'}</span>
                </>
              ) : (
                <>
                  <span>{isLogin ? 'Log in' : 'Create Account'}</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Quick Test Login Note */}
          {isLogin && (
            <div className="mt-4 p-3 bg-[#0FF1CE]/10 border border-[#0FF1CE]/20 rounded-lg">
              <p className="text-sm text-gray-300">
                <span className="font-medium text-[#0FF1CE]">Test Credentials:</span>{' '}
                Email: <span className="text-white">test@gmail.com</span> | 
                Password: <span className="text-white">12345</span>
              </p>
            </div>
          )}

          {/* Social Login */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#2F2F2F]"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-[#0D0D0D] text-gray-400">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <SocialButton icon="/google.svg" label="Google" />
              <SocialButton icon="/apple.svg" label="Apple" />
              <SocialButton icon="/facebook.svg" label="Facebook" />
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