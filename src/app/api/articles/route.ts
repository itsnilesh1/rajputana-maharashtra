export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Article from '@/models/Article';
import SubmissionRequest from '@/models/SubmissionRequest';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category') || '';
    const search = searchParams.get('search') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = 9;

    const query: any = { isPublished: true };
    if (category) query.category = category;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    const [articles, total] = await Promise.all([
      Article.find(query)
        .populate('author', 'name')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Article.countDocuments(query),
    ]);

    return NextResponse.json({ articles, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !['admin', 'moderator'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await dbConnect();
    const { title, description, content, image, category, tags } = await req.json();

    if (!title || !description || !content || !category) {
      return NextResponse.json({ error: 'Required fields missing' }, { status: 400 });
    }

    const article = await Article.create({
      title, description, content,
      image: image || '',
      category,
      tags: tags || [],
      author: session.user.id,
      isPublished: true,
    });

    return NextResponse.json({ message: 'Article published', article }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
