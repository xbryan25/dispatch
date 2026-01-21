import { createServerClient } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  // With Fluid compute, don't put this client in a global environment
  // variable. Always create a new one on each request.
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Do not run code between createServerClient and
  // supabase.auth.getClaims(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: If you remove getClaims() and you use server-side rendering
  // with the Supabase client, your users may be randomly logged out.
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  const path = request.nextUrl.pathname;
  const LOGIN_PATH = '/login';
  const REGISTER_PATH = '/register';
  const REDIRECT_AFTER_LOGIN = '/messages';
  const EMAIL_CONFIRMED_PATH = '/email-confirmed';
  const RESEND_PATH = '/resend-confirmation-email';

  const isPublicPage =
    path.startsWith(LOGIN_PATH) ||
    path.startsWith(REGISTER_PATH) ||
    path.startsWith(EMAIL_CONFIRMED_PATH) ||
    path.startsWith(RESEND_PATH);

  // Main guest guard, redirect to login if no user and not on a public page
  if (!user && !isPublicPage) {
    const url = request.nextUrl.clone();
    url.pathname = LOGIN_PATH;
    return NextResponse.redirect(url);
  }

  // Auth guard, prevents logged in users from accessing public pages
  if (user && isPublicPage) {
    const url = request.nextUrl.clone();
    url.pathname = REDIRECT_AFTER_LOGIN;
    return NextResponse.redirect(url);
  }

  // Special case guest guard, handling expired email links
  if (!user && path.startsWith(EMAIL_CONFIRMED_PATH)) {
    const errorCode = request.nextUrl.searchParams.get('error_code');

    if (errorCode === 'otp_expired') {
      const url = request.nextUrl.clone();
      url.pathname = RESEND_PATH;
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
