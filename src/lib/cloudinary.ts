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
    type UploadOptions = Parameters<typeof cloudinary.uploader.upload_stream>[0] & {
      background_removal?: string;
    };
    const uploadOptions: UploadOptions = {
      folder: 'multimark-motos',
      notification_url: '',
      format: 'png', // Force PNG format on upload
    };

    if (kind !== 'logo') {
      uploadOptions.background_removal = 'cloudinary_ai';
    }

    cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) return reject(error);

        // Moto images get padded/transformed for consistent sizing; logos stay raw and skip
        // background removal to avoid artifacts on lettering.
        const url = result?.secure_url;
        const publicId = result?.public_id || '';
        if (url) {
          const resolvedUrl = kind === 'logo' ? getLogoImageUrl(url) : getMotoImageUrl(url);
          resolve({ url: resolvedUrl, publicId });
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
