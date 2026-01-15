import { NextResponse } from 'next/server';
import { getMotosServer, saveMotosServer } from '@/lib/db';
import { Moto } from '@/types';

export async function GET() {
  const motos = getMotosServer();
  return NextResponse.json(motos);
}

export async function POST(request: Request) {
  try {
    const newMoto: Moto = await request.json();
    const motos = getMotosServer();

    if (!newMoto.id) {
      newMoto.id = `${newMoto.marca.toLowerCase()}-${newMoto.nombre.toLowerCase().replace(/\s+/g, '-')}`;
    }

    motos.push(newMoto);
    saveMotosServer(motos);

    return NextResponse.json(newMoto);
  } catch (error) {
    return NextResponse.json({ error: 'Error creating moto' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const updatedMoto: Moto = await request.json();
    const motos = getMotosServer();

    const index = motos.findIndex(m => m.id === updatedMoto.id);
    if (index !== -1) {
      motos[index] = updatedMoto;
      saveMotosServer(motos);
      return NextResponse.json(updatedMoto);
    }

    return NextResponse.json({ error: 'Moto not found' }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ error: 'Error updating moto' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    const motos = getMotosServer();
    const newMotos = motos.filter(m => m.id !== id);

    saveMotosServer(newMotos);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Error deleting moto' }, { status: 500 });
  }
}
