'use client';

import { useState } from 'react';
import type { CSSProperties } from 'react';
import { Moto, DEFAULT_WHATSAPP_NUMBER } from '@/types';
import { MotoCard } from '@/components/MotoCard';
import { MotoModal } from '@/components/MotoModal';

interface BrandPageClientProps {
  motos: Moto[];
  whatsappNumber?: string;
  catalogImageHeight?: number;
}

export function BrandPageClient({
  motos,
  whatsappNumber,
  catalogImageHeight,
}: BrandPageClientProps) {
  const [selectedMoto, setSelectedMoto] = useState<Moto | null>(null);
  const resolvedCatalogImageHeight =
    typeof catalogImageHeight === 'number' && Number.isFinite(catalogImageHeight)
      ? catalogImageHeight
      : 192;

  if (motos.length === 0) {
    return <p className="text-gray-500">No hay motos disponibles en este momento.</p>;
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {motos.map((moto, index) => (
          <div
            key={moto.id}
            data-reveal
            className="reveal"
            style={{
              '--reveal-delay': `${(index % 4) * 90}ms`,
            } as CSSProperties}
          >
            <MotoCard
              moto={moto}
              onClick={setSelectedMoto}
              imageHeight={resolvedCatalogImageHeight}
            />
          </div>
        ))}
      </div>
      <MotoModal
        moto={selectedMoto}
        isOpen={!!selectedMoto}
        onClose={() => setSelectedMoto(null)}
        whatsappNumber={whatsappNumber || DEFAULT_WHATSAPP_NUMBER}
      />
    </>
  );
}
