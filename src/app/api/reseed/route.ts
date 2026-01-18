import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { getAdminSession } from '@/lib/auth';
import { motos } from '@/data/motos';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  if (!getAdminSession(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 1. DELETE ALL existing records
    const { error: deleteError } = await supabaseAdmin
      .from('motos')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete not empty

    if (deleteError) throw deleteError;

    // 2. Prepare data for insertion (map local logic to DB fields)
    const motosToInsert = motos.map((moto) => ({
      nombre: moto.nombre,
      marca: moto.marca,
      tipo: moto.tipo,
      imagen: moto.imagen,
      specs: moto.specs,
      destacada: moto.destacada || false,
      show_in_hero: false, // Reset logic
    }));

    // 3. Insert fresh batch
    const { data, error: insertError } = await supabaseAdmin
      .from('motos')
      .insert(motosToInsert)
      .select();

    if (insertError) throw insertError;

    return NextResponse.json({
      message: 'Database nuked and re-seeded',
      count: data.length,
      data,
    });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

