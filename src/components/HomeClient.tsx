'use client';

import { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Hero } from '@/components/Hero';
import { MotoCarousel } from '@/components/MotoCarousel';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { ScrollReveal } from '@/components/ScrollReveal';
import { Moto, PublicSettings } from '@/types';

interface HomeClientProps {
  motos: Moto[];
  settings: PublicSettings;
}

export function HomeClient({ motos, settings }: HomeClientProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const heroMotos = motos.filter((m) => m.show_in_hero);

  return (
    <div className="flex flex-col min-h-screen">
      <ScrollReveal />
      <Header onSearch={setSearchQuery} logoUrl={settings.logoUrl} />

      <main className="flex-1">
        {!searchQuery && (
          <Hero heroMotos={heroMotos} imageScale={settings.heroImageScale} />
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

