import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { getAdminSession } from '@/lib/auth';
import { v2 as cloudinary } from 'cloudinary';
import type { UploadApiResponse } from 'cloudinary';
import { getMotoImageUrl } from '@/lib/cloudinary-url';
import fs from 'fs';
import path from 'path';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

export async function GET(request: Request) {
  if (!getAdminSession(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const results: Array<{
      file: string;
      cloudinaryUrl: string;
      motosUpdated: number;
      error?: string;
    }> = [];
    // Directorio de imágenes locales
    const imagesDir = path.join(process.cwd(), 'public', 'images', 'motos');

    if (!fs.existsSync(imagesDir)) {
      return NextResponse.json({ error: 'Directory not found' }, { status: 404 });
    }

    const files = fs.readdirSync(imagesDir);

    for (const file of files) {
      if (!file.endsWith('.png') && !file.endsWith('.jpg')) continue;

      const filePath = path.join(imagesDir, file);
      const fileBuffer = fs.readFileSync(filePath);
      const dbPath = `/images/motos/${file}`; // El path tal cual está guardado en la DB

      console.log(`Processing ${file}...`);

      // 1. Subir a Cloudinary con Background Removal
      const uploadResult = await new Promise<UploadApiResponse>((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            folder: 'multimark-motos',
            background_removal: 'cloudinary_ai', // Activa el add-on
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result as UploadApiResponse);
          }
        ).end(fileBuffer);
      });

      if (uploadResult?.secure_url) {
        const transformedUrl = getMotoImageUrl(uploadResult.secure_url);
        // 2. Actualizar en Supabase todas las motos que usen esta imagen
        const { data, error } = await supabaseAdmin
          .from('motos')
          .update({
            imagen: transformedUrl,
            cloudinary_public_id: uploadResult.public_id,
          })
          .eq('imagen', dbPath)
          .select();

        results.push({
          file,
          cloudinaryUrl: transformedUrl,
          motosUpdated: data?.length || 0,
          error: error?.message,
        });
      }
    }

    return NextResponse.json({
      message: 'Image migration process finished',
      details: results,
    });
  } catch (error) {
    console.error('Migration error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: 'Migration failed', details: message }, { status: 500 });
  }
}
