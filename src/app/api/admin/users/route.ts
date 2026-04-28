export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import User from '@/models/User';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !['admin', 'moderator'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const search = searchParams.get('search') || '';
    const role = searchParams.get('role') || '';
    const limit = 20;

    const query: any = {};
    if (search) query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
    if (role) query.role = role;

    const [users, total] = await Promise.all([
      User.find(query).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
      User.countDocuments(query),
    ]);

    return NextResponse.json({ users, total, page, pages: Math.ceil(total / limit) });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    // Only admin (super admin) can change roles or suspend users
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Only admins can manage users' }, { status: 403 });
    }

    await dbConnect();
    const { userId, role, isActive } = await req.json();
    if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 });

    // Prevent modifying another admin account
    const targetUser = await User.findById(userId);
    if (!targetUser) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    
    // Cannot change role of another admin - only super admin (first admin) can
    if (targetUser.role === 'admin' && targetUser._id.toString() !== session.user.id) {
      return NextResponse.json({ error: 'Cannot modify another admin account' }, { status: 403 });
    }

    // Cannot downgrade yourself
    if (targetUser._id.toString() === session.user.id) {
      return NextResponse.json({ error: 'You cannot modify your own account' }, { status: 403 });
    }

    const update: any = {};
    // Only allow upgrading to moderator, not admin (only seed creates admins)
    if (role && ['user', 'moderator'].includes(role)) update.role = role;
    if (isActive !== undefined) update.isActive = isActive;

    const user = await User.findByIdAndUpdate(userId, update, { new: true });
    return NextResponse.json({ message: 'User updated', user });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
