import { NextResponse } from 'next/server';

import { withAuth } from 'next-auth/middleware';
import { Role } from './lib/db/enums';

export default withAuth(
  async function middleware(request) {
    const token = request.nextauth.token;
    const userType = token?.userType;
    const role = token?.role;
    const url = new URL(request.url);

    let redirectPath;
    if (!token) {
      redirectPath = '/';
    }
    if (
      userType === 'USER_PARTNER' &&
      role === Role.ROLE_USER &&
      (url.pathname.startsWith('/s') || url.pathname.startsWith('/v'))
    ) {
      redirectPath = '/p';
    } else if (
      userType === 'USER_VOLUNTEER' &&
      role === Role.ROLE_USER &&
      (url.pathname.startsWith('/s') || url.pathname.startsWith('/p'))
    ) {
      redirectPath = '/v';
    } else if (
      userType === 'USER_SUPPORTER' &&
      role === Role.ROLE_USER &&
      (url.pathname.startsWith('/v') || url.pathname.startsWith('/p'))
    ) {
      redirectPath = '/s';
    }

    if (role !== 'ROLE_ADMIN' && url.pathname.startsWith('/admin')) {
      const redirectURL = new URL('/', url.origin);
      return NextResponse.redirect(redirectURL);
    }

    if (redirectPath) {
      const redirectURL = new URL(redirectPath, url.origin);
      return NextResponse.redirect(redirectURL.toString());
    }
    return NextResponse.next();
  },
  {
    pages: {
      signIn: '/auth/login',
      error: '/auth/login',
      // newUser: '/signup',
    },
  }
);

export const config = {
  matcher: [
    '/p',
    '/p/:path*',
    '/s',
    '/s/:path*',
    '/v',
    '/v/:path*',
    '/admin',
    '/admin/:path*',
  ],
};
