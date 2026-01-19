import { supabase } from '@/lib/supabase';
import { getPublicSettings } from '@/lib/settings';
import { HomeClient } from '@/components/HomeClient';
import { Moto } from '@/types';

export const revalidate = 0;

export default async function Home() {
  const [{ data: motos }, settings] = await Promise.all([
    supabase
      .from('motos')
      .select('*')
      .order('created_at', { ascending: false }),
    getPublicSettings(),
  ]);

  const motosData = (motos || []) as Moto[];

  return <HomeClient motos={motosData} settings={settings} />;
}

