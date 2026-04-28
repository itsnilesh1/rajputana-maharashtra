import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth';

export function apiSuccess(data: unknown, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function apiError(message: string, status = 400) {
  return NextResponse.json({ success: false, error: message }, { status });
}

export async function requireAuth() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return { error: apiError('Authentication required', 401), session: null };
  }
  return { error: null, session };
}

export async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return { error: apiError('Authentication required', 401), session: null };
  }
  if (!['admin', 'moderator'].includes(session.user.role)) {
    return { error: apiError('Admin access required', 403), session: null };
  }
  return { error: null, session };
}

export function sanitizeString(str: string): string {
  return str.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '').trim();
}
