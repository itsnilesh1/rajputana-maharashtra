export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import MemberProfile from '@/models/MemberProfile';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const profile = await MemberProfile.findById(params.id)
      .populate('user', 'name email')
      .lean();
    if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    if (!(profile as any).isPublic) return NextResponse.json({ error: 'Profile is private' }, { status: 403 });
    return NextResponse.json({ profile });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
