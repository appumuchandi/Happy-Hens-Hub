'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { loginAction, verifyOtpAction } from '../actions';
import { Lock, User, AlertCircle, Loader2, KeyRound, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [step, setStep] = useState<'credentials' | 'otp'>('credentials');
  const [otp, setOtp] = useState('');
  const router = useRouter();

  async function handleCredentialsSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsPending(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = await loginAction(formData);

    if (result.success) {
      if (result.requiresOtp) {
        setStep('otp');
        setIsPending(false);
      } else {
        router.push('/super-admin/dashboard');
        router.refresh();
      }
    } else {
      setError(result.error || 'Login failed');
      setIsPending(false);
    }
  }

  async function handleOtpSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (otp.length !== 6) return;

    setIsPending(true);
    setError(null);

    const result = await verifyOtpAction(otp);

    if (result.success) {
      router.push('/super-admin/dashboard');
      router.refresh();
    } else {
      setError(result.error || 'Verification failed');
      setIsPending(false);
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl p-8 md:p-12">
            <div className="text-center mb-10">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-primary">
                {step === 'credentials' ? <Lock className="h-8 w-8" /> : <KeyRound className="h-8 w-8" />}
              </div>
              <h1 className="text-2xl font-black text-slate-900">
                {step === 'credentials' ? 'Admin Access' : 'Verification Required'}
              </h1>
              <p className="text-slate-500 text-sm mt-2">
                {step === 'credentials' 
                  ? 'Enter your credentials to manage registrations' 
                  : 'We sent a 6-digit code to your registered email'}
              </p>
            </div>

            {error && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive text-xs p-4 rounded-xl flex items-center gap-3 mb-6 animate-in fade-in slide-in-from-top-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <p className="font-bold">{error}</p>
              </div>
            )}

            {step === 'credentials' ? (
              <form onSubmit={handleCredentialsSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">User ID</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input 
                      name="userid" 
                      type="text" 
                      required 
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                      placeholder="Admin Username"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input 
                      name="password" 
                      type="password" 
                      required 
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  disabled={isPending}
                  className="w-full rounded-xl h-12 font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all"
                >
                  {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Continue'}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleOtpSubmit} className="space-y-6">
                <div className="space-y-2 text-center">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500 block mb-4">Enter 6-Digit Code</label>
                  <input 
                    type="text"
                    required
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="w-full text-center text-3xl tracking-[12px] font-black py-4 rounded-xl border-2 border-slate-200 outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all font-mono"
                    placeholder="000000"
                    autoFocus
                  />
                  <p className="text-[10px] font-bold text-slate-400 mt-4">Code expires in 2 minutes</p>
                </div>

                <div className="flex flex-col gap-3">
                  <Button 
                    type="submit" 
                    disabled={isPending || otp.length !== 6}
                    className="w-full rounded-xl h-12 font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all"
                  >
                    {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Verify & Login'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    onClick={() => { setStep('credentials'); setOtp(''); setError(null); }}
                    className="w-full rounded-xl h-10 text-xs text-slate-400 gap-2"
                  >
                    <ArrowLeft className="h-3 w-3" /> Back to Credentials
                  </Button>
                </div>
              </form>
            )}
          </div>
          <p className="text-center text-slate-400 text-[10px] mt-8 uppercase tracking-[0.2em] font-bold">
            PoultryManager Secure Administration
          </p>
        </div>
      </main>
    </div>
  );
}
