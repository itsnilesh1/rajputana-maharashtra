export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import SubmissionRequest from '@/models/SubmissionRequest';
import MemberProfile from '@/models/MemberProfile';
import Event from '@/models/Event';
import Article from '@/models/Article';
import { Announcement, Gallery, ActivityLog, Notification } from '@/models/index';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !['admin', 'moderator'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    await dbConnect();
    const submission = await SubmissionRequest.findById(params.id)
      .populate('submittedBy', 'name email role')
      .populate('reviewedBy', 'name')
      .lean();
    if (!submission) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ submission });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !['admin', 'moderator'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await dbConnect();
    const { action, moderatorNotes } = await req.json();
    const validActions = ['approve', 'reject', 'request_revision'];
    if (!validActions.includes(action)) {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    const submission = await SubmissionRequest.findById(params.id);
    if (!submission) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const statusMap: Record<string, string> = {
      approve: 'approved',
      reject: 'rejected',
      request_revision: 'revision_requested',
    };

    submission.status = statusMap[action] as any;
    submission.moderatorNotes = moderatorNotes || '';
    submission.reviewedBy = session.user.id as any;
    submission.reviewedAt = new Date();

    let publishedId: string | undefined;

    if (action === 'approve') {
      const p = submission.payload as any;

      if (submission.requestType === 'member_profile') {
        const existing = await MemberProfile.findOne({ user: submission.submittedBy });
        const profile = existing
          ? await MemberProfile.findOneAndUpdate(
              { user: submission.submittedBy },
              { ...p, approvalStatus: 'approved', isPublic: true },
              { new: true }
            )
          : await MemberProfile.create({
              ...p,
              user: submission.submittedBy,
              approvalStatus: 'approved',
              isPublic: true,
            });
        publishedId = profile?._id?.toString();
        submission.publishedId = profile?._id as any;
        submission.publishedModel = 'MemberProfile';
      }

      if (submission.requestType === 'event') {
        const slugify = (t: string) => t.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();
        const event = await Event.create({
          ...p,
          slug: slugify(p.title || 'event'),
          isPublished: true,
          submittedBy: submission.submittedBy,
        });
        publishedId = event._id.toString();
        submission.publishedId = event._id as any;
        submission.publishedModel = 'Event';
      }

      if (submission.requestType === 'article') {
        const slugify = (t: string) => t.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();
        const article = await Article.create({
          ...p,
          slug: slugify(p.title || 'article'),
          isPublished: true,
          author: submission.submittedBy,
        });
        publishedId = article._id.toString();
        submission.publishedId = article._id as any;
        submission.publishedModel = 'Article';
      }

      if (submission.requestType === 'gallery') {
        const img = await Gallery.create({
          ...p,
          isPublished: true,
          submittedBy: submission.submittedBy,
        });
        publishedId = img._id.toString();
        submission.publishedId = img._id as any;
        submission.publishedModel = 'Gallery';
      }
    }

    await submission.save();

    // Notify submitter
    const notifMessages: Record<string, { title: string; message: string }> = {
      approve: { title: 'Submission Approved ✓', message: `Your ${submission.requestType.replace('_', ' ')} has been approved and is now live.` },
      reject: { title: 'Submission Rejected', message: `Your ${submission.requestType.replace('_', ' ')} was not approved. ${moderatorNotes ? 'Note: ' + moderatorNotes : ''}` },
      request_revision: { title: 'Revision Requested', message: `Please update your ${submission.requestType.replace('_', ' ')}. ${moderatorNotes || ''}` },
    };

    await Notification.create({
      user: submission.submittedBy,
      title: notifMessages[action].title,
      message: notifMessages[action].message,
      type: action === 'approve' ? 'approval' : action === 'reject' ? 'rejection' : 'revision',
      link: '/dashboard/submissions',
    });

    await ActivityLog.create({
      action: `submission_${action}`,
      performedBy: session.user.id,
      targetId: submission._id,
      targetModel: 'SubmissionRequest',
      details: `${action} ${submission.requestType}`,
    });

    return NextResponse.json({ message: `Submission ${action}d successfully`, submission, publishedId });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
