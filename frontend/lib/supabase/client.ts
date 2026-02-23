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

export async function uploadImageToSupabaseStorage(upload_url: string, image: File) {
  const res = await fetch(upload_url, {
    method: 'PUT',
    body: image,
    headers: {
      'Content-Type': image.type,
    },
  });

  if (!res.ok) throw new Error('Something went wrong when uploading image to Supabase Storage.');
  return res;
}
