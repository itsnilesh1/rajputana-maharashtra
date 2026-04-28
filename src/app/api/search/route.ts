export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import MemberProfile from '@/models/MemberProfile';
import Event from '@/models/Event';
import Article from '@/models/Article';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q') || '';
    const type = searchParams.get('type') || 'all';

    if (!q || q.length < 2) {
      return NextResponse.json({ results: { members: [], events: [], articles: [] } });
    }

    const regex = { $regex: q, $options: 'i' };
    const limit = 6;

    const results: any = {};

    if (type === 'all' || type === 'members') {
      results.members = await MemberProfile.find({
        approvalStatus: 'approved',
        isPublic: true,
        $or: [{ name: regex }, { city: regex }, { clan: regex }, { profession: regex }],
      }).select('name district city clan profession photo').limit(limit).lean();
    }

    if (type === 'all' || type === 'events') {
      results.events = await Event.find({
        isPublished: true,
        $or: [{ title: regex }, { description: regex }, { venue: regex }, { district: regex }],
      }).select('title date venue district').limit(limit).lean();
    }

    if (type === 'all' || type === 'articles') {
      results.articles = await Article.find({
        isPublished: true,
        $or: [{ title: regex }, { description: regex }, { tags: regex }],
      }).select('title description category slug').limit(limit).lean();
    }

    const total = Object.values(results).reduce((sum: number, arr: any) => sum + arr.length, 0);
    return NextResponse.json({ results, total, query: q });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
