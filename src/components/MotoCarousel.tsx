'use client';

import { useState } from 'react';
import { MotoCard } from './MotoCard';
import { MotoModal } from './MotoModal';
import { Moto, MARCAS } from '@/types';
import { motos, getMotosByMarca, searchMotos } from '@/data/motos';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MotoCarouselProps {
  searchQuery?: string;
}

export function MotoCarousel({ searchQuery }: MotoCarouselProps) {
  const [selectedMoto, setSelectedMoto] = useState<Moto | null>(null);
  const [scrollPositions, setScrollPositions] = useState<Record<string, number>>({});

  // Si hay búsqueda, mostrar resultados filtrados
  const filteredMotos = searchQuery ? searchMotos(searchQuery) : null;

  const scroll = (marcaId: string, direction: 'left' | 'right') => {
    const container = document.getElementById(`carousel-${marcaId}`);
    if (container) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      setScrollPositions((prev) => ({
        ...prev,
        [marcaId]: container.scrollLeft + scrollAmount,
      }));
    }
  };

  // Mostrar resultados de búsqueda
  if (filteredMotos) {
    return (
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="font-bebas text-3xl uppercase mb-6">
            Resultados para "{searchQuery}"
          </h2>
          {filteredMotos.length === 0 ? (
            <p className="text-gray-500">No se encontraron motos.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredMotos.map((moto) => (
                <MotoCard
                  key={moto.id}
                  moto={moto}
                  onClick={setSelectedMoto}
                />
              ))}
            </div>
          )}
        </div>
        <MotoModal
          moto={selectedMoto}
          isOpen={!!selectedMoto}
          onClose={() => setSelectedMoto(null)}
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

        {MARCAS.map((marca) => {
          const marcaMotos = getMotosByMarca(marca.nombre);
          if (marcaMotos.length === 0) return null;

          return (
            <div key={marca.id} id={marca.id} className="mb-12 scroll-mt-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bebas text-2xl uppercase text-primary">
                  {marca.nombre}
                </h3>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => scroll(marca.id, 'left')}
                    className="rounded-full"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => scroll(marca.id, 'right')}
                    className="rounded-full"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div
                id={`carousel-${marca.id}`}
                className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {marcaMotos.map((moto) => (
                  <div
                    key={moto.id}
                    className="flex-shrink-0 w-72 snap-start"
                  >
                    <MotoCard moto={moto} onClick={setSelectedMoto} />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <MotoModal
        moto={selectedMoto}
        isOpen={!!selectedMoto}
        onClose={() => setSelectedMoto(null)}
      />
    </section>
  );
}
