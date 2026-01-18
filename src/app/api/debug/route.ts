import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { getAdminSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  if (!getAdminSession(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { data: motos } = await supabaseAdmin
      .from('motos')
      .select('id, nombre, marca, imagen, show_in_hero')
      .order('marca');

    return NextResponse.json({
      count: motos?.length,
      motos: motos,
    });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

