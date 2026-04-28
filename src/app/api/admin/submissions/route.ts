import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import SubmissionRequest from '@/models/SubmissionRequest';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !['admin', 'moderator'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await dbConnect();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') || '';
    const type = searchParams.get('type') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = 20;

    const query: any = {};
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

    // Get counts by status
    const counts = await SubmissionRequest.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);
    const statusCounts = counts.reduce((acc: any, c) => { acc[c._id] = c.count; return acc; }, {});

    return NextResponse.json({ submissions, total, page, pages: Math.ceil(total / limit), statusCounts });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
