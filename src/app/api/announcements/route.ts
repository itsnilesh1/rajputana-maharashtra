export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import { Announcement } from '@/models/index';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const district = searchParams.get('district') || '';
    const limit = parseInt(searchParams.get('limit') || '10');

    const query: any = { isActive: true, $or: [{ expiresAt: { $gt: new Date() } }, { expiresAt: null }] };
    if (district) query.$or = [{ isGlobal: true }, { district }];
    else query.isGlobal = true;

    const announcements = await Announcement.find(query)
      .sort({ priority: -1, createdAt: -1 })
      .limit(limit)
      .lean();

    return NextResponse.json({ announcements });
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !['admin', 'moderator'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await dbConnect();
    const { title, content, district, isGlobal, priority, expiresAt } = await req.json();

    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content required' }, { status: 400 });
    }

    const ann = await Announcement.create({
      title, content,
      district: district || '',
      isGlobal: isGlobal !== false,
      priority: priority || 'medium',
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      createdBy: session.user.id,
      isActive: true,
    });

    return NextResponse.json({ message: 'Announcement created', announcement: ann }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
