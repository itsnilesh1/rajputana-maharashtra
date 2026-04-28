export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import SubmissionRequest from '@/models/SubmissionRequest';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    const { type, ...payload } = body;

    const validTypes = ['contact', 'volunteer', 'suggestion'];
    if (!type || !validTypes.includes(type)) {
      return NextResponse.json({ error: 'Invalid form type' }, { status: 400 });
    }

    const session = await getServerSession(authOptions);

    // Allow guest submissions for contact forms (store email in payload)
    const submission = await SubmissionRequest.create({
      requestType: type,
      submittedBy: session?.user?.id || '000000000000000000000000', // placeholder for guest
      payload: { ...payload, submittedAt: new Date().toISOString() },
      status: 'pending',
    });

    return NextResponse.json({
      message: 'Thank you! Your message has been received. We will get back to you soon.',
      id: submission._id,
    }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
