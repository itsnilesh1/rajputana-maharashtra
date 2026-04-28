export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import MemberProfile from '@/models/MemberProfile';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    await dbConnect();
    const profile = await MemberProfile.findOne({ user: session.user.id }).lean();
    return NextResponse.json({ profile });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
