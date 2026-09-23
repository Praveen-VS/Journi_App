'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import JourniLogo from '@/components/shared/JourniLogo';
import { Mail, ArrowLeft, CheckCircle2, Send } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 600);
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center p-4 sm:p-6">
      <Card variant="elevated" className="w-full max-w-md p-6 sm:p-8 text-left bg-white dark:bg-[#280814] shadow-2xl">
        <div className="flex justify-center mb-6">
          <JourniLogo size="md" showTagline />
        </div>

        {!isSubmitted ? (
          <>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#5B0B24] dark:text-[#FFF7FA] tracking-tight mb-2">
              Reset Your Password
            </h1>
            <p className="text-xs sm:text-sm text-[#5B0B24]/70 dark:text-[#FF8BA7]/70 leading-relaxed mb-6">
              Enter the email address registered with your Journi account and we will send you a recovery link.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email Address"
                type="email"
                placeholder="elena@journi.travel"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<Mail className="w-4 h-4" />}
                required
              />

              <Button
                type="submit"
                variant="sunset"
                size="lg"
                isLoading={isLoading}
                className="w-full font-bold shadow-sunset"
                rightIcon={<Send className="w-4 h-4" />}
              >
                Send Recovery Link
              </Button>
            </form>
          </>
        ) : (
          <div className="text-center py-4">
            <div className="w-14 h-14 rounded-full bg-emerald-500/15 text-emerald-600 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-[#5B0B24] dark:text-[#FFF7FA] mb-2">
              Check Your Inbox
            </h2>
            <p className="text-xs text-[#5B0B24]/70 dark:text-[#FF8BA7]/70 mb-6 leading-relaxed">
              We have dispatched a reset link to <strong className="text-[#5B0B24] dark:text-white">{email}</strong>.
            </p>
            <Button
              variant="secondary"
              size="md"
              onClick={() => setIsSubmitted(false)}
              className="w-full"
            >
              Try Another Email
            </Button>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-[#5B0B24]/8 dark:border-[#FF8BA7]/12 text-center">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5B0B24]/70 dark:text-[#FF8BA7]/70 hover:text-[#5B0B24]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Sign In</span>
          </Link>
        </div>
      </Card>
    </div>
  );
}
