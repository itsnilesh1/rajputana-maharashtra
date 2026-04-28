export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import MemberProfile from '@/models/MemberProfile';
import SubmissionRequest from '@/models/SubmissionRequest';
import { sanitizeString } from '@/lib/sanitize';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const district = searchParams.get('district') || '';
    const clan     = searchParams.get('clan') || '';
    const search   = searchParams.get('search') || '';
    const page     = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit    = 12;

    const query: any = { approvalStatus: 'approved', isPublic: true };
    if (district) query.district = district;
    if (clan && clan !== 'All Clans') query.clan = { $regex: sanitizeString(clan, 100), $options: 'i' };
    if (search) {
      const s = sanitizeString(search, 100);
      query.$or = [
        { name: { $regex: s, $options: 'i' } },
        { city: { $regex: s, $options: 'i' } },
        { profession: { $regex: s, $options: 'i' } },
      ];
    }

    const [members, total] = await Promise.all([
      MemberProfile.find(query)
        .select('name district city clan profession photo')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      MemberProfile.countDocuments(query),
    ]);

    return NextResponse.json({ members, total, page, pages: Math.ceil(total / limit) });
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
    const body = await req.json();
    const {
      name, district, city, clan, profession, bio, photo, photoPublicId, phone,
    } = body;

    // Validate required fields
    if (!name?.trim() || !district?.trim() || !city?.trim() || !clan?.trim() || !profession?.trim()) {
      return NextResponse.json({ error: 'Name, district, city, clan, and profession are required' }, { status: 400 });
    }

    // Sanitize
    const payload = {
      name:          sanitizeString(name, 100),
      district:      sanitizeString(district, 100),
      city:          sanitizeString(city, 100),
      clan:          sanitizeString(clan, 100),
      profession:    sanitizeString(profession, 100),
      bio:           sanitizeString(bio || '', 1000),
      photo:         typeof photo === 'string' ? photo.slice(0, 500) : '',
      photoPublicId: typeof photoPublicId === 'string' ? photoPublicId.slice(0, 300) : '',
      phone:         sanitizeString(phone || '', 20),
    };

    // Block if already has a pending submission
    const pendingSubmission = await SubmissionRequest.findOne({
      submittedBy: session.user.id,
      requestType: 'member_profile',
      status: 'pending',
    });
    if (pendingSubmission) {
      return NextResponse.json({ error: 'You already have a pending profile submission. Wait for review.' }, { status: 409 });
    }

    const existingProfile = await MemberProfile.findOne({ user: session.user.id });

    await SubmissionRequest.create({
      requestType: 'member_profile',
      submittedBy: session.user.id,
      payload,
      status: 'pending',
    });

    return NextResponse.json({
      message: existingProfile
        ? 'Profile update submitted for review.'
        : 'Profile submitted for review. You will be notified once approved.',
    }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
