'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';

export function Hero() {
  const scrollToCatalogo = () => {
    const catalogo = document.getElementById('catalogo');
    catalogo?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-white">
      {/* Abstract Background Element - Minimal Gray Shape */}
      <div className="absolute right-0 top-0 h-full w-2/3 bg-gray-50/80 -skew-x-12 translate-x-1/4 z-0" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-5 gap-8 items-center">
          {/* Content (2 cols) */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <p className="text-primary font-bold tracking-widest uppercase text-sm mb-4">
                La evolución del movimiento
              </p>
              <h1 className="font-bebas text-6xl md:text-8xl uppercase leading-[0.9] text-black">
                POTENCIA <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-700">
                  SIN LÍMITES
                </span>
              </h1>
            </div>

            <p className="text-gray-600 text-lg leading-relaxed max-w-md">
              Descubrí nuestra selección premium de motocicletas. 
              Financiación exclusiva del 100% y entrega inmediata.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <Button
                onClick={scrollToCatalogo}
                size="lg"
                className="h-14 px-8 bg-primary hover:bg-primary/90 text-white font-bold uppercase tracking-wider text-base rounded-full shadow-lg shadow-primary/20 transition-all hover:scale-105"
              >
                Ver Catálogo
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="h-14 px-8 border-2 border-gray-200 text-gray-900 hover:bg-gray-50 uppercase tracking-wider text-base rounded-full font-bold"
                asChild
              >
                <a href="/quienes-somos">Conocenos</a>
              </Button>
            </div>
          </div>

          {/* Image (3 cols) */}
           <div className="lg:col-span-3 relative h-[500px] md:h-[600px] w-full">
              <Image
                src="/images/hero-moto.png"
                alt="Moto destacada"
                fill
                className="object-contain scale-110 drop-shadow-2xl mix-blend-multiply"
                priority
              />
          </div>
        </div>
      </div>
    </section>
  );
}
