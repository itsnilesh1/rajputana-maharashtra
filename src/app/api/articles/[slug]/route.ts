export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Article from '@/models/Article';

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    await dbConnect();
    const article = await Article.findOne({ slug: params.slug, isPublished: true })
      .populate('author', 'name')
      .lean();
    if (!article) return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    return NextResponse.json({ article });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
