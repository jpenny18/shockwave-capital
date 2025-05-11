'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock,
  User,
  ArrowRight,
  Check,
  AlertCircle
} from 'lucide-react';
import { signInUser, registerUser, resetPassword } from '@/lib/firebase';
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
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Icon size={18} className={`transition-colors ${value.length > 0 || isFocused ? 'text-[#0FF1CE]' : 'text-gray-400'}`} />
        </div>
        <input
          id={id}
          type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
          className={`
            w-full bg-[#1A1A1A] border rounded-lg pl-10 pr-4 py-3 text-white 
            transition-all focus:outline-none
            ${value.length > 0 || isFocused ? 'border-[#0FF1CE]' : 'border-[#2F2F2F]'}
            ${error ? 'border-red-500' : ''}
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
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-white"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
          <AlertCircle size={14} />
          {error}
        </p>
      )}
    </div>
  );
};

export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [errors, setErrors] = useState<AuthErrors>({});
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState<AuthData>({
    email: '',
    password: '',
    rememberMe: false,
  });

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        router.push('/dashboard');
      }
    });

    return () => unsubscribe();
  }, [router]);

  const validateForm = () => {
    const newErrors: AuthErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!isLogin && !formData.name) {
      newErrors.name = 'Name is required';
    }

    if (!isLogin && !acceptTerms) {
      newErrors.terms = 'You must accept the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      if (isLogin) {
        await signInUser(formData.email, formData.password);
        router.push('/dashboard');
      } else {
        const nameParts = (formData.name || '').split(' ');
        const firstName = nameParts[0];
        const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
        
        await registerUser(formData.email, formData.password, {
          displayName: formData.name,
          firstName,
          lastName
        });
        setSuccess('Account created successfully! Please sign in.');
        setIsLogin(true);
        setFormData({
          email: '',
          password: '',
          rememberMe: false,
        });
      }
    } catch (error: any) {
      setErrors({
        auth: error.message || 'An error occurred during authentication'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">Welcome Back</h1>
          <p className="text-gray-400">
            {isLogin ? 'Sign in to access your account' : 'Create your account to get started'}
          </p>
        </div>

        {success && (
          <div className="mb-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 flex items-center gap-2">
            <Check size={16} />
            {success}
          </div>
        )}

        {errors.auth && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 flex items-center gap-2">
            <AlertCircle size={16} />
            {errors.auth}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-gray-600 text-[#0FF1CE] focus:ring-[#0FF1CE] focus:ring-offset-0 bg-[#1A1A1A]"
              />
              <span className="text-sm text-gray-300">Remember me</span>
            </label>
            {isLogin && (
              <Link href="/forgot-password" className="text-sm text-[#0FF1CE] hover:underline">
                Forgot password?
              </Link>
            )}
          </div>

          {!isLogin && (
            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="terms"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-gray-600 text-[#0FF1CE] focus:ring-[#0FF1CE] focus:ring-offset-0 bg-[#1A1A1A]"
              />
              <label htmlFor="terms" className="text-sm text-gray-300">
                I agree to the{' '}
                <Link href="/terms" className="text-[#0FF1CE] hover:underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-[#0FF1CE] hover:underline">
                  Privacy Policy
                </Link>
              </label>
            </div>
          )}

          {errors.terms && (
            <p className="text-sm text-red-500 flex items-center gap-1">
              <AlertCircle size={14} />
              {errors.terms}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#0FF1CE] text-black font-semibold py-3 px-4 rounded-lg hover:bg-[#0FF1CE]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                <span>Processing...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                <ArrowRight size={16} />
              </div>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-400">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setErrors({});
                setSuccess('');
              }}
              className="text-[#0FF1CE] hover:underline"
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
} 