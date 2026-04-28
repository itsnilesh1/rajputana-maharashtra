import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import dbConnect from './db';
import User from '@/models/User';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password required');
        }
        await dbConnect();
        const user = await User.findOne({ email: credentials.email.toLowerCase() }).select('+password');
        if (!user) throw new Error('No account found with this email');
        if (!user.isActive) throw new Error('Your account has been suspended');
        const valid = await bcrypt.compare(credentials.password, user.password);
        if (!valid) throw new Error('Invalid password');
        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
          image: user.avatar || null,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger }) {
      // On first login, populate token
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
      }
      // On session update or token refresh, re-fetch user from DB to get latest role
      if (trigger === 'update' || (!user && token.id)) {
        try {
          await dbConnect();
          const freshUser = await User.findById(token.id).lean() as any;
          if (freshUser) {
            token.role = freshUser.role;
            token.name = freshUser.name;
            token.email = freshUser.email;
          }
        } catch {}
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
    updateAge: 60 * 60, // Re-check DB every 1 hour
  },
  secret: process.env.NEXTAUTH_SECRET,
};
