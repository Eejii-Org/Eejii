import { verify } from 'argon2';
import { getServerSession, type NextAuthOptions } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import type { GetServerSidePropsContext } from 'next/types';

import { db } from '@/server/db';

import { loginSchema } from './validation/user-schema';

export const nextAuthOptions: NextAuthOptions = {
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'jsmith@gmail.com',
        },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async credentials => {
        try {
          const { email, password } = await loginSchema.parseAsync(credentials);

          // const result = await prisma.user.findFirst({
          //   where: { email },
          // });
          const result = await db
            .selectFrom('User')
            .where('email', '=', email)
            .selectAll()
            .executeTakeFirst();

          if (!result || !result.password) return null;

          const isValidPassword = await verify(result.password, password);

          if (!isValidPassword) return null;

          return {
            id: result.id,
            email,
            userType: result.type,
            role: result.role,
          };
        } catch {
          return null;
        }
      },
    }),
    // FacebookProvider({
    //   clientId: process.env.FACEBOOK_CLIENT_ID,
    //   clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    // }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.userId = user.id;
        token.role = user.role;
        token.email = user.email;
        token.userType = user.userType;
      }

      return token;
    },
    session: async ({ session, token }) => {
      if (token) {
        session.user.id = token.userId as string;
        session.user.email = token.email;
        session.user.role = token.role;
        session.user.userType = token.userType;
      }

      return session;
    },
  },
  jwt: {
    maxAge: 15 * 24 * 30 * 60, // 15 days
  },
  pages: {
    signIn: '/auth/login',
    // newUser: '/signup',
    error: '/auth/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */

export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext['req'];
  res: GetServerSidePropsContext['res'];
}) => {
  return getServerSession(ctx.req, ctx.res, nextAuthOptions);
};
