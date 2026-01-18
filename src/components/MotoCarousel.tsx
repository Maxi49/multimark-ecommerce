'use client';

import { useState } from 'react';
import type { CSSProperties } from 'react';
import { MotoCard } from './MotoCard';
import { MotoModal } from './MotoModal';
import { Moto, MARCAS } from '@/types';
import { BrandCarousel } from './BrandCarousel';

interface MotoCarouselProps {
  searchQuery?: string;
  motos: Moto[];
  whatsappNumber: string;
  catalogImageHeight?: number;
}

export function MotoCarousel({
  searchQuery,
  motos,
  whatsappNumber,
  catalogImageHeight,
}: MotoCarouselProps) {
  const [selectedMoto, setSelectedMoto] = useState<Moto | null>(null);
  const resolvedCatalogImageHeight =
    typeof catalogImageHeight === 'number' && Number.isFinite(catalogImageHeight)
      ? catalogImageHeight
      : 192;

  // Si hay búsqueda, mostrar resultados filtrados
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    const filteredMotos = motos.filter(
      (moto) =>
        moto.marca.toLowerCase().includes(query) ||
        moto.nombre.toLowerCase().includes(query)
    );

    return (
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="font-bebas text-3xl uppercase mb-6">
            Resultados para &quot;{searchQuery}&quot;
          </h2>
          {filteredMotos.length === 0 ? (
            <p className="text-gray-500">No se encontraron motos.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredMotos.map((moto, index) => (
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
          )}
        </div>
        <MotoModal
          moto={selectedMoto}
          isOpen={!!selectedMoto}
          onClose={() => setSelectedMoto(null)}
          whatsappNumber={whatsappNumber}
        />
      </section>
    );
  }

  // Mostrar carruseles por marca
  return (
    <section id="catalogo" className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="font-bebas text-4xl uppercase text-center mb-2">
          Nuestro Catálogo
        </h2>
        <p className="text-gray-500 text-center mb-12">
          Explorá nuestra selección de motos por marca
        </p>

        {MARCAS.map((marca, index) => {
          const marcaMotos = motos.filter((m) => m.marca === marca.nombre);
          if (marcaMotos.length === 0) return null;

          return (
            <div
              key={marca.id}
              id={marca.id}
              data-reveal
              className="mb-12 scroll-mt-24 reveal"
              style={{
                '--reveal-delay': `${index * 120}ms`,
              } as CSSProperties}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bebas text-2xl uppercase text-primary border-l-4 border-secondary pl-3">
                  {marca.nombre}
                </h3>
              </div>

              <BrandCarousel
                motos={marcaMotos}
                onMotoClick={setSelectedMoto}
                imageHeight={resolvedCatalogImageHeight}
              />
            </div>
          );
        })}
      </div>

      <MotoModal
        moto={selectedMoto}
        isOpen={!!selectedMoto}
        onClose={() => setSelectedMoto(null)}
        whatsappNumber={whatsappNumber}
      />
    </section>
  );
}
