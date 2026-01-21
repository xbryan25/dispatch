import { createClient } from '@/lib/supabase/client';

export async function register(email: string, password: string, displayName: string) {
  const supabase = createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        displayName,
      },
      emailRedirectTo: `${window.location.origin}/email-confirmed`,
    },
  });

  if (error) throw error;

  return data;
}

export async function login(email: string, password: string) {
  const supabase = createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;

  return data;
}
