import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { getPublicSettings } from '@/lib/settings';
import { MARCAS, Moto } from '@/types';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { ScrollReveal } from '@/components/ScrollReveal';
import { BrandPageClient } from '@/components/BrandPageClient';

export const revalidate = 0;

type MarcaParams = {
  marca: string;
};

export async function generateStaticParams() {
  return MARCAS.map((marca) => ({ marca: marca.id }));
}

export async function generateMetadata({
  params,
}: {
  params: MarcaParams | Promise<MarcaParams>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const brand = MARCAS.find((marca) => marca.id === resolvedParams.marca);
  if (!brand) {
    return {
      title: 'Marca no encontrada | Multimark Motos',
    };
  }

  const title = `${brand.nombre} en Rio Cuarto | Multimark Motos`;
  const description = `Modelos ${brand.nombre} disponibles en Rio Cuarto, Cordoba. Motos 100% financiadas y entrega inmediata.`;

  return {
    title,
    description,
    keywords: [
      brand.nombre,
      'motos',
      'concesionario',
      'motos financiadas',
      'Rio Cuarto',
      'Cordoba',
    ],
    openGraph: {
      title,
      description,
      type: 'website',
    },
  };
}

export default async function MarcaPage({
  params,
}: {
  params: MarcaParams | Promise<MarcaParams>;
}) {
  const resolvedParams = await params;
  const brand = MARCAS.find((marca) => marca.id === resolvedParams.marca);
  if (!brand) notFound();

  const [{ data: motos }, settings] = await Promise.all([
    supabase
      .from('motos')
      .select('*')
      .eq('marca', brand.nombre)
      .order('created_at', { ascending: false }),
    getPublicSettings(),
  ]);

  const motosData = (motos || []) as Moto[];

  return (
    <div className="flex flex-col min-h-screen">
      <Header logoUrl={settings.logoUrl} />

      <main className="flex-1">
        <ScrollReveal />
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="mb-8 text-center">
              <p className="text-sm font-semibold uppercase tracking-wider text-primary">
                {brand.nombre}
              </p>
              <h1 className="font-bebas text-4xl md:text-5xl uppercase text-gray-900">
                Motos {brand.nombre} en Rio Cuarto
              </h1>
              <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
                Catalogo de motos {brand.nombre} en Rio Cuarto, Cordoba. Financiacion
                y entrega inmediata.
              </p>
            </div>

            <BrandPageClient
              motos={motosData}
              whatsappNumber={settings.whatsappNumber}
              catalogImageHeight={settings.catalogImageHeight}
            />
          </div>
        </section>
      </main>

      <Footer
        logoUrl={settings.logoUrl}
        phone={settings.phone}
        email={settings.email}
        address={settings.address}
        instagramUrl={settings.instagramUrl}
        facebookUrl={settings.facebookUrl}
      />
      <WhatsAppButton whatsappNumber={settings.whatsappNumber} />
    </div>
  );
}
