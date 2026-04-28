export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Event from '@/models/Event';
import SubmissionRequest from '@/models/SubmissionRequest';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const district = searchParams.get('district') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = 12;

    const query: any = { isPublished: true };
    if (district) query.district = district;

    const [events, total] = await Promise.all([
      Event.find(query)
        .populate('organizer', 'name')
        .sort({ date: 1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Event.countDocuments(query),
    ]);

    return NextResponse.json({ events, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await dbConnect();
    const payload = await req.json();
    const { title, date, venue, district, description, banner } = payload;

    if (!title || !date || !venue || !district || !description) {
      return NextResponse.json({ error: 'Required fields missing' }, { status: 400 });
    }

    // Create submission request (not direct publish)
    const submission = await SubmissionRequest.create({
      requestType: 'event',
      submittedBy: session.user.id,
      payload: { title, date, venue, district, description, banner: banner || '' },
      status: 'pending',
    });

    return NextResponse.json({
      message: 'Event submitted for review. It will be published after admin approval.',
      submissionId: submission._id,
    }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
