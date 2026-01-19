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

  const normalizedQuery = searchQuery?.trim().toLowerCase() ?? '';
  const tokens = normalizedQuery.split(/\s+/).filter(Boolean);

  const toSearchableText = (moto: Moto) =>
    [
      moto.marca,
      moto.nombre,
      moto.tipo,
      moto.specs?.cilindrada,
      moto.specs?.motor,
      moto.specs?.frenos,
      moto.specs?.arranque,
      moto.specs?.capacidadTanque,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

  const matchesQuery = (moto: Moto) => {
    if (tokens.length === 0) return true;
    const haystack = toSearchableText(moto);
    return tokens.every((token) => haystack.includes(token));
  };

  const getMatchScore = (moto: Moto) => {
    const fields = [
      moto.nombre,
      moto.marca,
      moto.tipo,
      moto.specs?.cilindrada,
      moto.specs?.motor,
      moto.specs?.frenos,
      moto.specs?.arranque,
      moto.specs?.capacidadTanque,
    ].map((value) => (value ?? '').toLowerCase());

    let bestIndex = fields.length;
    let bestTokenCount = 0;

    fields.forEach((value, index) => {
      if (!value) return;
      const tokenCount = tokens.filter((token) => value.includes(token)).length;
      if (tokenCount === 0) return;
      if (index < bestIndex) {
        bestIndex = index;
        bestTokenCount = tokenCount;
        return;
      }
      if (index === bestIndex && tokenCount > bestTokenCount) {
        bestTokenCount = tokenCount;
      }
    });

    return { bestIndex, bestTokenCount };
  };

  // Si hay búsqueda, mostrar resultados filtrados
  if (tokens.length) {
    const filteredMotos = motos
      .filter(matchesQuery)
      .map((moto) => ({ moto, score: getMatchScore(moto) }))
      .sort((a, b) => {
        if (a.score.bestIndex !== b.score.bestIndex) {
          return a.score.bestIndex - b.score.bestIndex;
        }
        if (a.score.bestTokenCount !== b.score.bestTokenCount) {
          return b.score.bestTokenCount - a.score.bestTokenCount;
        }
        return a.moto.nombre.localeCompare(b.moto.nombre);
      })
      .map((item) => item.moto);

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
