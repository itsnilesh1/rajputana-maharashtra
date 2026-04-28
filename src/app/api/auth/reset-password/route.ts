import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'crypto';
import connectDB from '@/lib/db';
import User from '@/models/User';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { token, password } = body;

    if (!token || typeof token !== 'string' || token.length < 10) {
      return NextResponse.json({ error: 'Invalid or missing reset token.' }, { status: 400 });
    }

    if (!password || password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters.' },
        { status: 400 }
      );
    }

    // Password strength check
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    if (!hasUpper || !hasLower || !hasNumber) {
      return NextResponse.json(
        { error: 'Password must include uppercase, lowercase, and a number.' },
        { status: 400 }
      );
    }

    await connectDB();

    // Hash the incoming token to compare with stored hash
    const hashedToken = createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpiry: { $gt: new Date() }, // Not expired
      isActive: true,
    }).select('+password +passwordResetToken +passwordResetExpiry');

    if (!user) {
      return NextResponse.json(
        { error: 'Reset link is invalid or has expired. Please request a new one.' },
        { status: 400 }
      );
    }

    // Set new password and clear reset token
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpiry = undefined;
    await user.save();

    return NextResponse.json({ message: 'Password reset successful. You can now log in.' });
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again later.' },
      { status: 500 }
    );
  }
}
