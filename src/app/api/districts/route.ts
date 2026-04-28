export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { District } from '@/models/index';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const region = searchParams.get('region') || '';

    const query: any = { isActive: true };
    if (region) query.region = region;

    const districts = await District.find(query)
      .sort({ region: 1, name: 1 })
      .lean();

    return NextResponse.json({ districts });
  } catch (err) {
    console.error('Districts API error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
