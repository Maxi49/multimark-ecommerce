import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { deleteImage } from '@/lib/cloudinary';
import { getAdminSession } from '@/lib/auth';
import { Moto } from '@/types';

function ensureAdmin(request: Request) {
  if (!getAdminSession(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return null;
}

export async function GET(request: Request) {
  const unauthorized = ensureAdmin(request);
  if (unauthorized) return unauthorized;

  const { data, error } = await supabaseAdmin
    .from('motos')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const unauthorized = ensureAdmin(request);
  if (unauthorized) return unauthorized;

  try {
    const newMoto: Moto = await request.json();
    const motoData = { ...newMoto } as Partial<Moto>;
    delete motoData.id; // Remove ID if present to let DB generate UUID

    const { data, error } = await supabaseAdmin
      .from('motos')
      .insert([motoData])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Error creating moto' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const unauthorized = ensureAdmin(request);
  if (unauthorized) return unauthorized;

  try {
    const updatedMoto: Moto = await request.json();
    const { id, ...motoData } = updatedMoto;

    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }

    const { data: existingMoto, error: existingError } = await supabaseAdmin
      .from('motos')
      .select('cloudinary_public_id')
      .eq('id', id)
      .maybeSingle();

    if (existingError) {
      return NextResponse.json({ error: existingError.message }, { status: 500 });
    }

    if (
      motoData.cloudinary_public_id &&
      existingMoto?.cloudinary_public_id &&
      motoData.cloudinary_public_id !== existingMoto.cloudinary_public_id
    ) {
      try {
        await deleteImage(existingMoto.cloudinary_public_id);
      } catch (error) {
        console.error('Error deleting previous image:', error);
        return NextResponse.json({ error: 'Error deleting previous image' }, { status: 500 });
      }
    }

    // Asegurarse de quitar campos que no queremos updatear si fuera necesario,
    // pero por ahora specs es un jsonb y nombre/marca son text, coincide con types.
    const { data, error } = await supabaseAdmin
      .from('motos')
      .update(motoData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Error updating moto' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const unauthorized = ensureAdmin(request);
  if (unauthorized) return unauthorized;

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    const { data: moto, error: fetchError } = await supabaseAdmin
      .from('motos')
      .select('cloudinary_public_id')
      .eq('id', id)
      .maybeSingle();

    if (fetchError) {
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    if (moto?.cloudinary_public_id) {
      try {
        await deleteImage(moto.cloudinary_public_id);
      } catch (error) {
        console.error('Error deleting image:', error);
        return NextResponse.json({ error: 'Error deleting image' }, { status: 500 });
      }
    }

    const { error } = await supabaseAdmin
      .from('motos')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Error deleting moto' }, { status: 500 });
  }
}
