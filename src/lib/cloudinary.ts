import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key:    process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
  secure: true,
});

export default cloudinary;

/** Delete a single image from Cloudinary by publicId. Safe to call even if publicId is empty. */
export async function deleteCloudinaryImage(publicId: string): Promise<void> {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    // Log but don't throw — deletion failures should not break main flows
    console.warn('Cloudinary delete warning:', publicId, err);
  }
}

/** Upload a base64 string to Cloudinary. Returns { url, publicId }. */
export async function uploadToCloudinary(
  base64: string,
  folder: string,
  options: Record<string, unknown> = {}
): Promise<{ url: string; publicId: string }> {
  const result = await cloudinary.uploader.upload(base64, {
    folder: `rajputana-maharashtra/${folder}`,
    transformation: [{ quality: 'auto', fetch_format: 'auto' }],
    ...options,
  });
  return { url: result.secure_url, publicId: result.public_id };
}
