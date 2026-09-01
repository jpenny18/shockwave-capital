'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Particles from '../components/Particles';
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock,
  AlertCircle
} from 'lucide-react';
import { signInWithEmailAndPassword, onAuthStateChanged, getIdToken } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

interface AdminAuthData {
  email: string;
  password: string;
}

interface AuthErrors {
  email?: string;
  password?: string;
  general?: string;
}

const FloatingLabelInput = ({ 
  id, 
  type = 'text', 
  label, 
  icon: Icon,
  showPasswordToggle,
  value,
  onChange,
  error,
}: { 
  id: string;
  type?: string;
  label: string;
  icon: React.ElementType;
  showPasswordToggle?: boolean;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const isActive = isFocused || value.length > 0;

  return (
    <div className="relative">
      <label
        htmlFor={id}
        className={`
          mb-1.5 block text-[13px] font-medium tracking-wide transition-colors
          ${error ? 'text-red-400' : isActive ? 'text-[#0FF1CE]' : 'text-gray-400'}
        `}
      >
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
          <Icon
            size={18}
            className={`transition-colors ${error ? 'text-red-400' : isActive ? 'text-[#0FF1CE]' : 'text-gray-500'}`}
          />
        </div>
        <input
          id={id}
          type={showPassword ? 'text' : type}
          className={`
            w-full bg-[#0A0A0A]/80 border rounded-xl pl-11 py-3.5 text-base text-white
            placeholder:text-gray-600 transition-all duration-200
            focus:outline-none focus:ring-1
            ${showPasswordToggle ? 'pr-12' : 'pr-4'}
            ${error
              ? 'border-red-500/60 focus:border-red-400 focus:ring-red-400/20'
              : isActive
                ? 'border-[#0FF1CE]/50 focus:border-[#0FF1CE] focus:ring-[#0FF1CE]/20'
                : 'border-white/[0.08] hover:border-white/15 focus:border-[#0FF1CE]/40 focus:ring-[#0FF1CE]/15'
            }
          `}
          placeholder=""
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        {showPasswordToggle && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 flex items-center justify-center w-12 text-gray-500 hover:text-white transition-colors touch-manipulation"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error && (
        <p className="mt-1.5 text-sm text-red-400 flex items-center gap-1.5">
          <AlertCircle size={14} className="shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
};

export default function AdminAuthPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<AdminAuthData>({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<AuthErrors>({});
  const [loading, setLoading] = useState(false);

  // Check if user is already authenticated and is an admin
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Check if user has admin role
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists() && userDoc.data().role === 'admin') {
          router.push('/admin');
        }
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      // Validation
      if (!formData.email || !formData.password) {
        setErrors({ 
          email: !formData.email ? 'Please enter your email address' : undefined,
          password: !formData.password ? 'Please enter your password' : undefined
        });
        setLoading(false);
        return;
      }

      // Sign in with Firebase
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      // Get the ID token
      const idToken = await getIdToken(userCredential.user, true);

      // Create session cookie through our API
      const response = await fetch('/api/auth/create-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create session');
      }

      // If successful, redirect to admin dashboard
      router.push('/admin');
    } catch (error: any) {
      console.error('Admin authentication error:', error);
      setErrors({ 
        general: error.message || 'Authentication failed. Please try again.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[100svh] bg-[#050505] text-white flex flex-col overflow-x-hidden">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(15,241,206,0.07),_transparent_55%)]" />
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[min(900px,140vw)] h-[min(900px,140vw)] rounded-full bg-[#0FF1CE]/[0.06] blur-[120px]" />
        <div className="absolute bottom-[-30%] right-[-20%] w-[min(520px,90vw)] h-[min(520px,90vw)] rounded-full bg-[#00D9FF]/[0.04] blur-[100px]" />
        <div
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 250 250' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E")`,
          }}
        />
      </div>
      <Particles opacityMultiplier={0.7} />

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 pt-8 pb-[max(2rem,env(safe-area-inset-bottom))] sm:px-6 sm:py-12">
        <div className="w-full max-w-[420px]">
          <div className="text-center mb-7 sm:mb-9">
            <div className="inline-flex items-center justify-center mb-5">
              <Image
                src="/logo.png"
                alt="Shockwave Capital"
                width={80}
                height={80}
                className="h-16 w-auto sm:h-[4.5rem] drop-shadow-[0_0_18px_rgba(15,241,206,0.18)]"
                priority
              />
            </div>
            <h1 className="text-[1.65rem] sm:text-3xl font-semibold tracking-tight">
              Welcome back
            </h1>
            <p className="mt-2 text-sm sm:text-[15px] text-gray-400">
              Sign in to continue
            </p>
          </div>

          <div className="relative rounded-2xl border border-white/[0.08] bg-[#111111]/80 backdrop-blur-xl shadow-[0_24px_80px_rgba(0,0,0,0.55)]">
            <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#0FF1CE]/40 to-transparent" />

            <form
              onSubmit={handleSubmit}
              className="p-5 sm:p-7 space-y-5"
            >
              {errors.general && (
                <div className="p-3 bg-red-500/10 border border-red-500/25 rounded-xl text-red-400 text-sm flex items-start gap-2.5">
                  <AlertCircle size={16} className="shrink-0 mt-0.5" />
                  <span className="leading-snug">{errors.general}</span>
                </div>
              )}

              <div className="space-y-4">
                <FloatingLabelInput
                  id="email"
                  type="email"
                  label="Email address"
                  icon={Mail}
                  value={formData.email}
                  onChange={(value) => setFormData({ ...formData, email: value })}
                  error={errors.email}
                />

                <FloatingLabelInput
                  id="password"
                  type="password"
                  label="Password"
                  icon={Lock}
                  showPasswordToggle
                  value={formData.password}
                  onChange={(value) => setFormData({ ...formData, password: value })}
                  error={errors.password}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`
                  w-full bg-[#0FF1CE] text-black font-semibold py-3.5 px-4 rounded-xl
                  transition-all duration-200 relative overflow-hidden touch-manipulation
                  text-base shadow-[0_0_24px_rgba(15,241,206,0.18)]
                  ${loading
                    ? 'opacity-80 cursor-not-allowed'
                    : 'hover:bg-[#0FF1CE]/90 hover:shadow-[0_0_32px_rgba(15,241,206,0.28)] active:scale-[0.98]'
                  }
                `}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin mr-2"></div>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
