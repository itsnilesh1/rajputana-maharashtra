export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import { Notification } from '@/models/index';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await dbConnect();
    const { searchParams } = new URL(req.url);
    const unreadOnly = searchParams.get('unread') === 'true';

    const query: any = { user: session.user.id };
    if (unreadOnly) query.isRead = false;

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    const unreadCount = await Notification.countDocuments({ user: session.user.id, isRead: false });

    return NextResponse.json({ notifications, unreadCount });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await dbConnect();
    const { notificationId, markAllRead } = await req.json();

    if (markAllRead) {
      await Notification.updateMany({ user: session.user.id, isRead: false }, { isRead: true });
      return NextResponse.json({ message: 'All notifications marked as read' });
    }

    if (notificationId) {
      await Notification.findOneAndUpdate(
        { _id: notificationId, user: session.user.id },
        { isRead: true }
      );
      return NextResponse.json({ message: 'Notification marked as read' });
    }

    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
