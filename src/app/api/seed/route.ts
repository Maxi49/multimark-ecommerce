import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { getAdminSession } from '@/lib/auth';
import { motos } from '@/data/motos';

export async function GET(request: Request) {
  if (!getAdminSession(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const results = [];
    for (const moto of motos) {
      // Omitir ID del JSON para que Supabase genere uno nuevo UUID,
      // o podríamos forzar el uso del ID del JSON si es un UUID válido.
      // Como los IDs del JSON son strings tipo 'honda-wave', mejor dejamos que Supabase genere UUIDs.

      const motoData = { ...moto } as Partial<typeof moto>;
      delete motoData.id;

      const { data, error } = await supabaseAdmin
        .from('motos')
        .insert([
          {
            nombre: motoData.nombre,
            marca: motoData.marca,
            tipo: motoData.tipo,
            imagen: motoData.imagen,
            specs: motoData.specs,
            destacada: motoData.destacada,
          },
        ])
        .select();

      if (error) {
        console.error(`Error inserting ${moto.nombre}:`, error);
        results.push({ name: moto.nombre, status: 'error', error });
      } else {
        results.push({ name: moto.nombre, status: 'success', data });
      }
    }

    return NextResponse.json({ message: 'Migration completed', results });
  } catch {
    return NextResponse.json({ error: 'Migration failed' }, { status: 500 });
  }
}
