'use client';

import { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Hero } from '@/components/Hero';
import { MotoCarousel } from '@/components/MotoCarousel';
import { WhatsAppButton } from '@/components/WhatsAppButton';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="flex flex-col min-h-screen">
      <Header onSearch={setSearchQuery} />
      
      <main className="flex-1">
        {!searchQuery && <Hero />}
        <MotoCarousel searchQuery={searchQuery} />
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
