import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Supabase keys are missing. This is expected during CI build if using placeholders.'
  );
}

export const createClient = () =>
  createBrowserClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseAnonKey || 'placeholder'
  );
