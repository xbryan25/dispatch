import { supabase } from '@/lib/supabase/client';

export async function register(email: string, password: string, displayName: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        displayName,
      },
      emailRedirectTo: 'http://localhost:3000/email-confirmed',
    },
  });

  if (error) throw error;

  return data;
}
