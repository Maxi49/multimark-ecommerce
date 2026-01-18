import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { getAdminSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  if (!getAdminSession(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 1. Fetch all motos
    const { data: motos, error } = await supabaseAdmin
      .from('motos')
      .select('id, nombre, marca, created_at')
      .order('created_at', { ascending: true }); // Keep oldest, delete newest

    if (error) throw error;
    if (!motos) return NextResponse.json({ message: 'No motos found' });

    const seen = new Set();
    const duplicates = [] as string[];

    // 2. Identify duplicates (same marca + nombre)
    for (const moto of motos) {
      const key = `${moto.marca}-${moto.nombre}`.toLowerCase();
      if (seen.has(key)) {
        duplicates.push(moto.id);
      } else {
        seen.add(key);
      }
    }

    // 3. Delete duplicates
    if (duplicates.length > 0) {
      const { error: deleteError } = await supabaseAdmin
        .from('motos')
        .delete()
        .in('id', duplicates);

      if (deleteError) throw deleteError;
    }

    return NextResponse.json({
      message: 'Cleanup finished',
      totalMotos: motos.length,
      deletedCount: duplicates.length,
      deletedIds: duplicates,
    });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

