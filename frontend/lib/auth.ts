import { supabase } from '@/lib/supabase/client';

export async function register(email: string, password: string, displayName: string) {
  console.log({ email, password });

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        displayName,
      },
    },
  });

  if (error) throw error;

  console.log(data);

  return data;
}
