import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';

export async function GET(request: Request) {
  if (!getAdminSession(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json(
    {
      error: 'Seed disabled: no local dataset available. Use the admin panel or restore /src/data/motos.',
    },
    { status: 410 }
  );
}
