'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles, Loader2 } from 'lucide-react';
import JourniLogo from '@/components/shared/JourniLogo';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [keepSignedIn, setKeepSignedIn] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorText, setErrorText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorText('Please enter your email or phone number and password.');
      return;
    }
    setErrorText('');
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push('/home');
    }, 600);
  };

  const handleDemoLogin = () => {
    setEmail('elena@journi.travel');
    setPassword('Journi2026!Explore');
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push('/home');
    }, 500);
  };

  return (
    <div className="w-full min-h-screen bg-[#FFF5F8] dark:bg-[#1A030C] flex flex-col md:items-center md:justify-center md:p-6 lg:p-10">
      {/* Container: on mobile edge-to-edge with hero top + bottom sheet; on desktop 2-col card */}
      <div className="w-full max-w-5xl md:rounded-[36px] overflow-hidden md:shadow-2xl bg-white dark:bg-[#240612] md:border border-[#FF4F7A]/15 grid grid-cols-1 md:grid-cols-2 relative">
        
        {/* ===================== HERO SECTION (Top on Mobile, Left on Desktop) ===================== */}
        <div className="relative w-full h-[400px] sm:h-[440px] md:h-auto min-h-[420px] md:min-h-[640px] flex flex-col justify-between p-6 sm:p-8 overflow-hidden">
          {/* Background Image: Sunset traveler from input_file_0.png */}
          <div className="absolute inset-0 -z-10">
            <Image
              src="/images/onboarding/m05-login-bg.png"
              alt="Journi Sunset Traveler"
              fill
              priority
              className="object-cover object-top md:object-center"
            />
            {/* Soft gradient overlay for text legibility */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/40 md:to-transparent" />
          </div>

          {/* Top Row: Official Logo + Angled Cursive Script */}
          <div className="flex items-start justify-between z-10">
            <JourniLogo size="md" href="/" />
            <span
              className="text-[#FF2A6D] text-lg sm:text-xl font-bold tracking-tight select-none drop-shadow-sm rotate-[-10deg]"
              style={{ fontFamily: 'var(--font-caveat, cursive)' }}
            >
              Explore a Better Tomorrow
            </span>
          </div>

          {/* Middle Text: Welcome Back! */}
          <div className="z-10 mt-6 md:mt-10">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#5B0B24] tracking-tight leading-tight drop-shadow-sm">
              Welcome
              <br />
              <span className="text-[#E61E50]">Back!</span>
            </h1>
            <p className="text-sm sm:text-base text-[#5B0B24]/90 font-medium mt-2 max-w-xs drop-shadow-sm">
              Continue your journey and explore more.
            </p>
          </div>

          {/* Bottom Left Accent badge: Good Trips Brighter You */}
          <div className="z-10 pb-2">
            <span
              className="inline-block text-white/95 text-base sm:text-lg font-bold leading-tight drop-shadow-md rotate-[-8deg]"
              style={{ fontFamily: 'var(--font-caveat, cursive)' }}
            >
              Good
              <br />
              &nbsp;a Trips
              <br />
              &nbsp;&nbsp;Brighter
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;You
            </span>
          </div>
        </div>

        {/* ===================== FORM SECTION (Bottom Sheet on Mobile, Right on Desktop) ===================== */}
        <div className="relative -mt-8 md:mt-0 rounded-t-[36px] md:rounded-none bg-white dark:bg-[#240612] px-6 py-8 sm:p-10 lg:p-12 flex flex-col justify-between shadow-[0_-12px_32px_rgba(0,0,0,0.08)] md:shadow-none z-20">
          
          <div>
            {/* Header: Log In */}
            <div className="mb-6">
              <h2 className="text-2xl sm:text-3xl font-black text-[#3E0717] dark:text-[#FFF7FA] tracking-tight">
                Log In
              </h2>
              <p className="text-xs sm:text-sm text-[#704250] dark:text-[#FFB3C6] font-medium mt-1">
                Glad to see you again!
              </p>
            </div>

            {errorText && (
              <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-600 font-semibold">
                {errorText}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email or Phone Input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#704250] dark:text-[#FFB3C6]">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  placeholder="Email or Phone Number"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-[#FAF9FB] dark:bg-[#1A030C] border border-[#E8DFE3] dark:border-[#FF4F7A]/20 text-sm text-[#3E0717] dark:text-white placeholder-[#9C7F8C] focus:outline-none focus:border-[#E61E50] focus:ring-2 focus:ring-[#E61E50]/20 transition-all"
                  required
                />
              </div>

              {/* Password Input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#704250] dark:text-[#FFB3C6]">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3.5 rounded-2xl bg-[#FAF9FB] dark:bg-[#1A030C] border border-[#E8DFE3] dark:border-[#FF4F7A]/20 text-sm text-[#3E0717] dark:text-white placeholder-[#9C7F8C] focus:outline-none focus:border-[#E61E50] focus:ring-2 focus:ring-[#E61E50]/20 transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#704250] hover:text-[#E61E50] transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {/* Options Row: Keep me signed in + Forgot Password? */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2.5 cursor-pointer select-none text-xs sm:text-sm text-[#5B0B24] dark:text-[#FFB3C6] font-medium">
                  <input
                    type="checkbox"
                    checked={keepSignedIn}
                    onChange={(e) => setKeepSignedIn(e.target.checked)}
                    className="w-4 h-4 rounded border-[#D8C7CF] text-[#E61E50] focus:ring-[#E61E50] accent-[#E61E50]"
                  />
                  <span>Keep me signed in</span>
                </label>

                <Link
                  href="/forgot-password"
                  className="text-xs sm:text-sm font-semibold text-[#E61E50] hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>

              {/* Primary Gradient CTA Button: Log In -> */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 px-6 rounded-full bg-gradient-to-r from-[#C2185B] via-[#E91E63] to-[#FF5252] text-white font-bold text-base shadow-[0_8px_20px_rgba(233,30,99,0.35)] hover:shadow-[0_12px_26px_rgba(233,30,99,0.45)] hover:opacity-95 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin text-white" />
                    <span>Logging in...</span>
                  </span>
                ) : (
                  <>
                    <span>Log In</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            {/* OR Divider */}
            <div className="relative my-6 flex items-center justify-center">
              <div className="border-t border-[#E8DFE3] dark:border-[#FF4F7A]/20 w-full" />
              <span className="bg-white dark:bg-[#240612] px-3 text-[11px] font-bold text-[#8C7580] uppercase tracking-wider">
                OR
              </span>
              <div className="border-t border-[#E8DFE3] dark:border-[#FF4F7A]/20 w-full" />
            </div>

            {/* Social Buttons: 3 Column Grid (Google, Apple, Facebook) */}
            <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
              {/* Google */}
              <button
                type="button"
                onClick={handleDemoLogin}
                className="flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-2xl border border-[#E8DFE3] dark:border-[#FF4F7A]/20 hover:border-[#E61E50] hover:bg-[#FFF5F8] dark:hover:bg-[#2D0A18] transition-all text-center group"
                title="Continue with Google"
              >
                <svg className="w-5 h-5 mb-1" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span className="text-[10px] sm:text-[11px] font-semibold text-[#5B0B24] dark:text-[#FFB3C6] leading-tight">
                  Google
                </span>
              </button>

              {/* Apple */}
              <button
                type="button"
                onClick={handleDemoLogin}
                className="flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-2xl border border-[#E8DFE3] dark:border-[#FF4F7A]/20 hover:border-[#E61E50] hover:bg-[#FFF5F8] dark:hover:bg-[#2D0A18] transition-all text-center group"
                title="Continue with Apple"
              >
                <svg className="w-5 h-5 mb-1 fill-current text-black dark:text-white" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.42c.67-.82 1.12-1.96.99-3.1-.96.04-2.13.65-2.82 1.45-.61.71-1.15 1.87-1.01 2.98 1.07.08 2.17-.51 2.84-1.33z" />
                </svg>
                <span className="text-[10px] sm:text-[11px] font-semibold text-[#5B0B24] dark:text-[#FFB3C6] leading-tight">
                  Apple
                </span>
              </button>

              {/* Facebook */}
              <button
                type="button"
                onClick={handleDemoLogin}
                className="flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-2xl border border-[#E8DFE3] dark:border-[#FF4F7A]/20 hover:border-[#E61E50] hover:bg-[#FFF5F8] dark:hover:bg-[#2D0A18] transition-all text-center group"
                title="Continue with Facebook"
              >
                <svg className="w-5 h-5 mb-1 fill-[#1877F2]" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span className="text-[10px] sm:text-[11px] font-semibold text-[#5B0B24] dark:text-[#FFB3C6] leading-tight">
                  Facebook
                </span>
              </button>
            </div>

            {/* Demo 1-Click Fill Helper */}
            <div className="mt-4 pt-4 border-t border-[#E8DFE3] dark:border-[#FF4F7A]/15 text-center">
              <button
                type="button"
                onClick={handleDemoLogin}
                className="text-xs font-semibold text-[#E61E50] hover:underline flex items-center justify-center gap-1.5 mx-auto"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>1-Click Test Login (Demo Traveler)</span>
              </button>
            </div>
          </div>

          {/* Bottom Footer: New to Journi? Create an Account -> */}
          <div className="mt-8 text-center pt-2">
            <p className="text-xs sm:text-sm text-[#704250] dark:text-[#FFB3C6]">
              New to Journi?{' '}
              <Link
                href="/register"
                className="font-bold text-[#E61E50] hover:underline inline-flex items-center gap-1"
              >
                <span>Create an Account</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
