'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Hero } from '@/components/Hero';
import { MotoCarousel } from '@/components/MotoCarousel';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { ScrollReveal } from '@/components/ScrollReveal';
import { MotoModal } from '@/components/MotoModal';
import { RecentCarousel } from '@/components/RecentCarousel';
import { Moto, PublicSettings } from '@/types';
import { getRecentViewedIds } from '@/lib/recent-viewed';

interface HomeClientProps {
  motos: Moto[];
  settings: PublicSettings;
}

export function HomeClient({ motos, settings }: HomeClientProps) {
  const searchParams = useSearchParams();
  const queryFromUrl = (searchParams.get('q') ?? '').trim();
  const [searchQuery, setSearchQuery] = useState(queryFromUrl);
  const [recentViewedIds, setRecentViewedIds] = useState<string[]>([]);
  const [selectedRecentMoto, setSelectedRecentMoto] = useState<Moto | null>(null);

  const heroMotos = motos.filter((m) => m.show_in_hero);
  const recentMotos = recentViewedIds
    .map((id) => motos.find((moto) => moto.id === id))
    .filter((moto): moto is Moto => Boolean(moto));

  useEffect(() => {
    setSearchQuery(queryFromUrl);
  }, [queryFromUrl]);

  useEffect(() => {
    setRecentViewedIds(getRecentViewedIds());
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <ScrollReveal />
      <Header
        onSearch={setSearchQuery}
        logoUrl={settings.logoUrl}
        initialQuery={queryFromUrl}
      />

      <main className="flex-1">
        {!searchQuery && (
          <Hero
            heroMotos={heroMotos}
            imageScale={settings.heroImageScale}
            whatsappNumber={settings.whatsappNumber}
          />
        )}
        {!searchQuery && recentMotos.length > 0 && (
          <section className="py-10 bg-white">
            <div className="container mx-auto px-4">
              <div className="mb-6 text-center">
                <h2 className="font-bebas text-3xl uppercase text-gray-900">
                  Porque lo viste antes
                </h2>
                <p className="text-gray-500">
                  Volve a mirar las motos que ya exploraste.
                </p>
              </div>
              <RecentCarousel
                motos={recentMotos}
                onMotoClick={setSelectedRecentMoto}
                imageHeight={settings.catalogImageHeight}
              />
            </div>
            <MotoModal
              moto={selectedRecentMoto}
              isOpen={!!selectedRecentMoto}
              onClose={() => setSelectedRecentMoto(null)}
              whatsappNumber={settings.whatsappNumber}
            />
          </section>
        )}
        <MotoCarousel
          searchQuery={searchQuery}
          motos={motos}
          whatsappNumber={settings.whatsappNumber}
          catalogImageHeight={settings.catalogImageHeight}
        />
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

