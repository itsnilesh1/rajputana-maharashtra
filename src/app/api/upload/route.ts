export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { uploadToCloudinary, deleteCloudinaryImage } from '@/lib/cloudinary';

// Size limits in bytes
const SIZE_LIMITS: Record<string, number> = {
  profile: 2 * 1024 * 1024,   // 2 MB
  gallery: 3 * 1024 * 1024,   // 3 MB
  event:   3 * 1024 * 1024,
  article: 3 * 1024 * 1024,
  announcement: 3 * 1024 * 1024,
};

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const formData = await req.formData();
    const file      = formData.get('file') as File | null;
    const type      = ((formData.get('type') as string) || 'gallery').toLowerCase();
    const oldPublicId = (formData.get('oldPublicId') as string) || '';

    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });

    // Validate mime type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Only JPEG, PNG, and WebP images are allowed' },
        { status: 400 }
      );
    }

    // Validate size based on upload type
    const maxSize = SIZE_LIMITS[type] ?? SIZE_LIMITS.gallery;
    if (file.size > maxSize) {
      const mb = maxSize / (1024 * 1024);
      return NextResponse.json(
        { error: `File too large. Maximum size for ${type} uploads is ${mb}MB` },
        { status: 400 }
      );
    }

    // Convert to base64 for Cloudinary upload
    const bytes  = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = `data:${file.type};base64,${buffer.toString('base64')}`;

    // Upload to Cloudinary
    const { url, publicId } = await uploadToCloudinary(base64, type, {
      // Profile photos: square crop, face detection
      ...(type === 'profile' && {
        transformation: [
          { width: 400, height: 400, crop: 'fill', gravity: 'face', quality: 'auto', fetch_format: 'auto' },
        ],
      }),
    });

    // If profile upload and user had an old photo — delete it from Cloudinary
    if (type === 'profile' && oldPublicId) {
      await deleteCloudinaryImage(oldPublicId);
    }

    return NextResponse.json({ url, publicId });
  } catch (err) {
    console.error('Upload error:', err);
    return NextResponse.json({ error: 'Upload failed. Please try again.' }, { status: 500 });
  }
}
