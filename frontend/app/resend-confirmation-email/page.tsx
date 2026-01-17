'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import Link from 'next/link';

export default function ResendConfirmationEmailPage() {
  const [email, setEmail] = useState('');

  const resendEmail = async () => {
    const { data, error } = await supabase.auth.resend({
      type: 'signup',
      email: email,
      options: {
        emailRedirectTo: 'http://localhost:3000/email-confirmed',
      },
    });

    if (error) {
      console.error('Failed to resend confirmation:', error.message);
    } else {
      alert('Confirmation email resent!');
    }
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-center gap-10 bg-zinc-50 font-sans dark:bg-black">
      <h1 className="font-semibold text-4xl">Expired confirmation email</h1>

      <div className="w-sm flex flex-col items-center gap-5">
        <div className="flex flex-col justify-center gap-5 max-w-xl">
          <p className="text-center">
            Your email confirmation link has expired. Input email below to resend confirmation
            email.
          </p>

          <div className="flex flex-col items-center gap-3">
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full"
            />
            <Button onClick={resendEmail} className="cursor-pointer w-full">
              Resend confirmation email
            </Button>
          </div>
        </div>

        <Link href="/login" className="cursor-pointer font-semibold hover:underline">
          Go to Login page
        </Link>
      </div>
    </div>
  );
}
