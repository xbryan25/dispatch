'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import { toast } from 'sonner';

import Link from 'next/link';

export default function ResendConfirmationEmailPage() {
  const supabase = createClient();

  const [email, setEmail] = useState('');

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const resendEmail = async () => {
    setIsLoading(true);

    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email,
      options: {
        emailRedirectTo: `${window.location.origin}/email-confirmed`,
      },
    });

    if (error) {
      toast.error('Failed to resend confirmation email.');
    } else {
      toast.success('If an account exists for this email, a new link has been sent.');
    }

    setIsLoading(false);

    setEmail('');
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
              disabled={isLoading}
            />
            <Button onClick={resendEmail} className="cursor-pointer w-full" disabled={isLoading}>
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
