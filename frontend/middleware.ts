import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  console.log('Middleware triggered for path:', req.nextUrl.pathname);

  if (req.nextUrl.pathname === '/email-confirmed') {
    const errorCode = req.nextUrl.searchParams.get('error_code');

    console.log(req.nextUrl.searchParams);

    if (errorCode === 'otp_expired') {
      return NextResponse.redirect(new URL('/resend-confirmation-email', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/email-confirmed'],
};
