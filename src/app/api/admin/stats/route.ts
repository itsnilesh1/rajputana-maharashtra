import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import Event from '@/models/Event';
import Article from '@/models/Article';
import MemberProfile from '@/models/MemberProfile';
import SubmissionRequest from '@/models/SubmissionRequest';
import { ActivityLog } from '@/models/index';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !['admin', 'moderator'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await dbConnect();

    const [
      totalUsers,
      totalMembers,
      totalEvents,
      totalArticles,
      pendingSubmissions,
      approvedThisMonth,
      recentActivity,
    ] = await Promise.all([
      User.countDocuments(),
      MemberProfile.countDocuments({ approvalStatus: 'approved' }),
      Event.countDocuments({ isPublished: true }),
      Article.countDocuments({ isPublished: true }),
      SubmissionRequest.countDocuments({ status: 'pending' }),
      SubmissionRequest.countDocuments({
        status: 'approved',
        updatedAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) },
      }),
      ActivityLog.find()
        .populate('performedBy', 'name')
        .sort({ createdAt: -1 })
        .limit(10)
        .lean(),
    ]);

    const submissionsByType = await SubmissionRequest.aggregate([
      { $match: { status: 'pending' } },
      { $group: { _id: '$requestType', count: { $sum: 1 } } },
    ]);

    return NextResponse.json({
      stats: {
        totalUsers,
        totalMembers,
        totalEvents,
        totalArticles,
        pendingSubmissions,
        approvedThisMonth,
      },
      submissionsByType,
      recentActivity,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
