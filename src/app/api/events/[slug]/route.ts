export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Event from '@/models/Event';

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    await dbConnect();
    const event = await Event.findOne({ slug: params.slug, isPublished: true })
      .populate('submittedBy', 'name')
      .lean();
    if (!event) return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    return NextResponse.json({ event });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const { getServerSession } = await import('next-auth');
    const { authOptions } = await import('@/lib/auth');
    const session = await getServerSession(authOptions);
    if (!session || !['admin', 'moderator'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    await dbConnect();
    await Event.findOneAndDelete({ slug: params.slug });
    return NextResponse.json({ message: 'Event deleted' });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
