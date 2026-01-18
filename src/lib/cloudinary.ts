import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import { getLogoImageUrl, getMotoImageUrl } from '@/lib/cloudinary-url';
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

interface UploadResult {
  url: string;
  publicId: string;
}

type UploadKind = 'moto' | 'logo';

export async function uploadImage(file: File, kind: UploadKind = 'moto'): Promise<UploadResult> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        folder: 'multimark-motos',
        background_removal: 'cloudinary_ai',
        notification_url: '',
        format: 'png', // Force PNG format on upload
      },
      (error, result) => {
        if (error) return reject(error);

        // Inject e_bgremoval transformation to fetch the version with background removed
        // This assumes the Cloudinary AI Background Removal add-on is enabled.
        const url = result?.secure_url;
        const publicId = result?.public_id || '';
        if (url) {
          const transformedUrl = kind === 'logo' ? getLogoImageUrl(url) : getMotoImageUrl(url);
          resolve({ url: transformedUrl, publicId });
        } else {
          resolve({ url: '', publicId });
        }
      }
    ).end(buffer);
  });
}

export async function deleteImage(publicId: string) {
  if (!publicId) return;
  await cloudinary.uploader.destroy(publicId, { invalidate: true });
}
