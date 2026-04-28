export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import { Gallery } from '@/models/index';
import SubmissionRequest from '@/models/SubmissionRequest';
import { sanitizeString } from '@/lib/sanitize';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const district = searchParams.get('district') || '';
    const category = searchParams.get('category') || '';
    const page     = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit    = 12;

    const query: any = { isPublished: true };
    if (district) query.district = district;
    if (category && category !== 'all') query.category = category;

    const [items, total] = await Promise.all([
      Gallery.find(query).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
      Gallery.countDocuments(query),
    ]);

    return NextResponse.json({ items, total, page, pages: Math.ceil(total / limit) });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await dbConnect();
    const { title, imageUrl, imagePublicId, district, category, caption, tags } = await req.json();

    if (!title?.trim() || !imageUrl?.trim()) {
      return NextResponse.json({ error: 'Title and image URL are required' }, { status: 400 });
    }

    const submission = await SubmissionRequest.create({
      requestType: 'gallery',
      submittedBy: session.user.id,
      payload: {
        title:         sanitizeString(title, 200),
        imageUrl:      imageUrl.slice(0, 500),
        imagePublicId: (imagePublicId || '').slice(0, 300),
        district:      sanitizeString(district || '', 100),
        category:      sanitizeString(category || 'community', 50),
        caption:       sanitizeString(caption || '', 500),
        tags:          Array.isArray(tags) ? tags.slice(0, 10).map((t: any) => sanitizeString(String(t), 50)) : [],
      },
      status: 'pending',
    });

    return NextResponse.json({
      message: 'Photo submitted for review. It will appear in the gallery after admin approval.',
      submissionId: submission._id,
    }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
