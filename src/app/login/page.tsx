'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Mail,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  RotateCcw,
  Sparkles,
  Lock,
} from 'lucide-react';

type AuthStep = 'EMAIL' | 'OTP' | 'SUCCESS';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '';

  // Form states
  const [step, setStep] = useState<AuthStep>('EMAIL');
  const [email, setEmail] = useState('');
  const [maskedEmail, setMaskedEmail] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // OTP 6-digit boxes state
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Timer & cooldown states
  const [resendSeconds, setResendSeconds] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // Status & feedback
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [infoMsg, setInfoMsg] = useState('');
  const [devOtpCode, setDevOtpCode] = useState<string | null>(null);

  // Cooldown countdown effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 'OTP' && resendSeconds > 0) {
      timer = setInterval(() => {
        setResendSeconds((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, resendSeconds]);

  // Focus first OTP box when transitioning to OTP step
  useEffect(() => {
    if (step === 'OTP') {
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    }
  }, [step]);

  // Handle Step 1: Send OTP
  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg('');
    setInfoMsg('');
    setDevOtpCode(null);

    const trimmed = email.trim();
    if (!trimmed) {
      setErrorMsg('Please enter your email address.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmed }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.error || 'Failed to send verification code. Please try again.');
        if (data.cooldownRemainingSeconds) {
          setResendSeconds(data.cooldownRemainingSeconds);
          setCanResend(false);
        }
        return;
      }

      setMaskedEmail(data.maskedEmail || trimmed);
      setStep('OTP');
      setResendSeconds(60);
      setCanResend(false);
      setOtpDigits(['', '', '', '', '', '']);
      setInfoMsg('Verification code sent to your email.');

      if (data.devCode) {
        setDevOtpCode(data.devCode);
      }
    } catch (err) {
      setErrorMsg('Network error. Please check your internet connection.');
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP digit changes
  const handleOtpChange = (index: number, value: string) => {
    if (value && !/^\d+$/.test(value)) return;

    const newDigits = [...otpDigits];

    if (value.length > 1) {
      // Handles pasting full OTP
      const pasted = value.replace(/\D/g, '').slice(0, 6);
      pasted.split('').forEach((digit, i) => {
        newDigits[i] = digit;
      });
      setOtpDigits(newDigits);
      const nextFocus = Math.min(pasted.length, 5);
      inputRefs.current[nextFocus]?.focus();

      if (pasted.length === 6) {
        submitOtp(pasted);
      }
      return;
    }

    newDigits[index] = value;
    setOtpDigits(newDigits);
    setErrorMsg('');

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit if all 6 digits entered
    const completeCode = newDigits.join('');
    if (completeCode.length === 6) {
      submitOtp(completeCode);
    }
  };

  // Handle backspace navigation
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle Paste Event
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasteData) return;

    const newDigits = [...otpDigits];
    pasteData.split('').forEach((char, i) => {
      newDigits[i] = char;
    });
    setOtpDigits(newDigits);

    const nextIndex = Math.min(pasteData.length, 5);
    inputRefs.current[nextIndex]?.focus();

    if (pasteData.length === 6) {
      submitOtp(pasteData);
    }
  };

  // Step 2: Submit OTP for verification
  const submitOtp = async (codeOverride?: string) => {
    const code = codeOverride || otpDigits.join('');
    if (code.length !== 6) {
      setErrorMsg('Please enter all 6 digits of your verification code.');
      return;
    }

    setErrorMsg('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), otp: code }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.error || 'Verification failed. Please check the code.');
        return;
      }

      setStep('SUCCESS');
      setInfoMsg(
        data.user.role === 'host'
          ? 'Host verified! Entering Owner Dashboard...'
          : 'Welcome back! Taking you to your account...'
      );

      // Trigger custom auth event so Header updates immediately
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('auth-state-changed'));
      }

      // Safe redirect based on Server Role
      setTimeout(() => {
        if (redirectUrl && redirectUrl.startsWith('/')) {
          router.push(redirectUrl);
        } else if (data.user.role === 'host') {
          router.push('/admin/dashboard');
        } else {
          router.push('/account');
        }
      }, 1200);
    } catch (err) {
      setErrorMsg('Network error occurred during verification.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#E8ECEF] flex items-center justify-center p-4 sm:p-8 font-sans selection:bg-[#881326] selection:text-white">
      {/* Outer Glow / Circular Neumorphic Backdrop */}
      <div className="relative w-full max-w-[430px] my-8">
        
        {/* Neumorphic 3D Embossed Card Plate */}
        <div className="neu-circle rounded-[48px] p-8 sm:p-12 border border-white/60 relative overflow-hidden transition-all duration-500">
          
          {/* Subtle Neumorphic Brand Badge */}
          <div className="flex flex-col items-center text-center space-y-2 mb-8">
            <div className="w-16 h-16 rounded-full neu-flat flex items-center justify-center border border-white/70 shadow-sm mb-1 group transition-transform hover:scale-105">
              <span className="text-[#881326] font-black text-2xl tracking-tighter">A</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-black text-[#2A2E35] tracking-tight">
              {step === 'OTP' ? 'Verify OTP' : 'Login'}
            </h1>
            
            <p className="text-xs font-semibold text-[#7E8896] tracking-wide">
              {step === 'OTP'
                ? `Code sent to ${maskedEmail}`
                : 'Sign in to ARAVIND READYMADE'}
            </p>
          </div>

          {/* Inline Alert / Feedback */}
          {errorMsg && (
            <div className="mb-6 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-700 text-xs font-medium flex items-center gap-2.5 shadow-sm animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {infoMsg && !errorMsg && (
            <div className="mb-6 p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 text-xs font-medium flex items-center gap-2.5 shadow-sm">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{infoMsg}</span>
            </div>
          )}

          {/* Dev Mode Simulated OTP Badge (shows when SMTP is not configured) */}
          {devOtpCode && (
            <div className="mb-6 p-3 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-900 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Dev Test Code: <strong className="font-mono text-sm tracking-widest">{devOtpCode}</strong></span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setOtpDigits(devOtpCode.split(''));
                  submitOtp(devOtpCode);
                }}
                className="text-[10px] font-black uppercase text-[#881326] hover:underline"
              >
                Auto-fill
              </button>
            </div>
          )}

          {/* STEP 1: Enter Email Form */}
          {step === 'EMAIL' && (
            <form onSubmit={handleSendOtp} className="space-y-6">
              {/* Inset Email Input */}
              <div className="space-y-1.5">
                <div className="relative neu-inset rounded-2xl p-1 flex items-center border border-white/40 neu-inset-focus transition-all">
                  <div className="pl-3.5 pr-2 text-[#7E8896]">
                    <Mail className="w-5 h-5" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setErrorMsg('');
                    }}
                    placeholder="Enter your email address"
                    className="w-full py-3 pr-4 bg-transparent text-xs sm:text-sm font-semibold text-[#2A2E35] placeholder:text-[#9AA2AB] focus:outline-none"
                    disabled={loading}
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Neumorphic Toggle Switch & Help */}
              <div className="flex items-center justify-between text-xs px-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  {/* Soft red toggle pill switch matching screenshot */}
                  <div
                    onClick={() => setRememberMe(!rememberMe)}
                    className={`w-10 h-5 rounded-full p-0.5 transition-all duration-300 flex items-center ${
                      rememberMe
                        ? 'bg-[#881326] justify-end'
                        : 'bg-[#D1D5DB] justify-start neu-inset'
                    }`}
                  >
                    <div className="w-4 h-4 rounded-full bg-white shadow-md transition-transform" />
                  </div>
                  <span className="font-semibold text-[#5A6370] text-[11px]">Remember me</span>
                </label>

                <span className="text-[11px] font-bold text-[#7E8896]">
                  OTP Sign-in
                </span>
              </div>

              {/* Crimson Gradient Action Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 rounded-2xl text-white font-black text-xs sm:text-sm uppercase tracking-wider neu-btn-crimson flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Sending Code...</span>
                  </>
                ) : (
                  <>
                    <span>SIGN IN</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Footer reassurance */}
              <div className="pt-2 text-center space-y-2">
                <p className="text-[11px] text-[#7E8896]">
                  New customer or store owner?{' '}
                  <span className="text-[#881326] font-black cursor-pointer hover:underline">
                    One unified login
                  </span>
                </p>
                <div className="flex items-center justify-center gap-1.5 text-[10px] text-[#9AA2AB] font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>Secure 256-bit Encrypted Authentication</span>
                </div>
              </div>
            </form>
          )}

          {/* STEP 2: Verify 6-digit OTP Form */}
          {step === 'OTP' && (
            <div className="space-y-6 animate-fadeIn">
              {/* 6 Neumorphic Inset Digit Boxes */}
              <div className="space-y-2">
                <label className="block text-[11px] font-bold text-center uppercase tracking-wider text-[#7E8896]">
                  Enter 6-Digit Code
                </label>
                <div className="flex items-center justify-center gap-2 sm:gap-2.5">
                  {otpDigits.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => {
                        inputRefs.current[idx] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(idx, e)}
                      onPaste={handlePaste}
                      disabled={loading}
                      className="w-10 h-12 sm:w-11 sm:h-13 neu-inset rounded-xl text-center text-lg sm:text-xl font-black text-[#2A2E35] focus:outline-none focus:ring-2 focus:ring-[#881326] transition-all bg-transparent border border-white/50"
                    />
                  ))}
                </div>
              </div>

              {/* Action Button: Verify */}
              <button
                type="button"
                onClick={() => submitOtp()}
                disabled={loading || otpDigits.join('').length !== 6}
                className="w-full py-3.5 px-6 rounded-2xl text-white font-black text-xs sm:text-sm uppercase tracking-wider neu-btn-crimson flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying Code...</span>
                  </>
                ) : (
                  <>
                    <span>VERIFY &amp; CONTINUE</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Resend & Change Email Navigation */}
              <div className="pt-2 flex flex-col items-center gap-2 text-xs">
                {canResend ? (
                  <button
                    type="button"
                    onClick={() => handleSendOtp()}
                    disabled={loading}
                    className="inline-flex items-center gap-1.5 text-xs font-black text-[#881326] hover:underline cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Resend OTP Code</span>
                  </button>
                ) : (
                  <span className="text-[#7E8896] text-[11px] font-semibold">
                    Resend code in <strong className="text-[#2A2E35]">00:{resendSeconds.toString().padStart(2, '0')}</strong>
                  </span>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setStep('EMAIL');
                    setErrorMsg('');
                    setInfoMsg('');
                  }}
                  className="text-[11px] font-semibold text-[#5A6370] hover:text-[#881326] hover:underline cursor-pointer"
                >
                  ← Change Email Address
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Verification Success */}
          {step === 'SUCCESS' && (
            <div className="py-8 text-center space-y-4 animate-fadeIn">
              <div className="w-16 h-16 rounded-full bg-emerald-500/15 border-2 border-emerald-500 flex items-center justify-center mx-auto text-emerald-600 shadow-lg">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-black text-[#2A2E35]">Authenticated</h3>
                <p className="text-xs text-[#7E8896]">Redirecting to your workspace...</p>
              </div>
              <Loader2 className="w-5 h-5 animate-spin mx-auto text-[#881326]" />
            </div>
          )}

        </div>

        {/* Back to store navigation */}
        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-xs font-bold text-[#7E8896] hover:text-[#881326] transition-colors"
          >
            ← Return to Aravind Readymades Store
          </Link>
        </div>

      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#E8ECEF] flex items-center justify-center text-xs text-gray-500">Loading authentication...</div>}>
      <LoginContent />
    </Suspense>
  );
}
