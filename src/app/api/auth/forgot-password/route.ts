import { NextRequest, NextResponse } from 'next/server';
import { randomBytes, createHash } from 'crypto';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { sendPasswordResetEmail } from '@/lib/mailer';

export const dynamic = 'force-dynamic';

// Rate limiting: simple in-memory store (per process)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60_000 }); // 1 min window
    return false;
  }
  if (entry.count >= 3) return true; // Max 3 requests per minute per IP
  entry.count++;
  return false;
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || 'unknown';

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait a minute before trying again.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const email = (body.email || '').trim().toLowerCase();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Valid email address required.' }, { status: 400 });
    }

    await connectDB();

    const user = await User.findOne({ email, isActive: true });

    // Always return success — don't reveal whether email exists (prevents enumeration)
    if (!user) {
      return NextResponse.json({
        message: 'If that email is registered, a reset link has been sent.',
      });
    }

    // Generate cryptographically secure random token
    const rawToken = randomBytes(32).toString('hex');

    // Hash it before storing — if DB is compromised, tokens are useless
    const hashedToken = createHash('sha256').update(rawToken).digest('hex');

    // Expire in 1 hour
    const expiry = new Date(Date.now() + 60 * 60 * 1000);

    await User.findByIdAndUpdate(user._id, {
      passwordResetToken: hashedToken,
      passwordResetExpiry: expiry,
    });

    await sendPasswordResetEmail(user.email, user.name, rawToken);

    return NextResponse.json({
      message: 'If that email is registered, a reset link has been sent.',
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    // Generic error — don't leak internals
    return NextResponse.json(
      { error: 'Something went wrong. Please try again later.' },
      { status: 500 }
    );
  }
}
