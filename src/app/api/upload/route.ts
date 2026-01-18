import { NextResponse } from 'next/server';
import { uploadImage } from '@/lib/cloudinary';
import { getAdminSession } from '@/lib/auth';

export async function POST(request: Request) {
  if (!getAdminSession(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const kind = formData.get('kind');

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 });
    }

    const uploadResult = await uploadImage(file, kind === 'logo' ? 'logo' : 'moto');

    return NextResponse.json(uploadResult);
  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}

