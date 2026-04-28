export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import SubmissionRequest from '@/models/SubmissionRequest';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await dbConnect();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const type = searchParams.get('type');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = 20;

    const isAdmin = session.user.role === 'admin' || session.user.role === 'moderator';
    const query: any = isAdmin ? {} : { submittedBy: session.user.id };
    if (status) query.status = status;
    if (type) query.requestType = type;

    const [submissions, total] = await Promise.all([
      SubmissionRequest.find(query)
        .populate('submittedBy', 'name email')
        .populate('reviewedBy', 'name')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      SubmissionRequest.countDocuments(query),
    ]);

    return NextResponse.json({ submissions, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await dbConnect();
    const { requestType, payload } = await req.json();

    if (!requestType || !payload) {
      return NextResponse.json({ error: 'requestType and payload are required' }, { status: 400 });
    }

    const validTypes = ['member_profile', 'event', 'article', 'gallery', 'announcement', 'contact', 'volunteer', 'suggestion'];
    if (!validTypes.includes(requestType)) {
      return NextResponse.json({ error: 'Invalid request type' }, { status: 400 });
    }

    const submission = await SubmissionRequest.create({
      requestType,
      submittedBy: session.user.id,
      payload,
      status: 'pending',
    });

    return NextResponse.json({ message: 'Submission received. Awaiting admin review.', submission }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
