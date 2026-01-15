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
    <section className="relative min-h-[80vh] flex items-center overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Red accent line */}
      <div className="absolute top-0 left-0 w-2 h-full bg-primary" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-white space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 border border-primary/30 rounded-full">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span className="text-sm font-medium text-primary">
                100% Financiada
              </span>
            </div>

            <h1 className="font-bebas text-5xl md:text-7xl uppercase leading-tight">
              Tu próxima moto
              <br />
              <span className="text-primary">está acá</span>
            </h1>

            <p className="text-gray-300 text-lg max-w-lg">
              Encontrá la moto perfecta para vos. Las mejores marcas, los mejores
              precios y la financiación que necesitás.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button
                onClick={scrollToCatalogo}
                size="lg"
                className="bg-primary hover:bg-primary/90 text-white font-semibold uppercase tracking-wider"
              >
                Ver Catálogo
              </Button>
              <Button
                variant="ghost"
                size="lg"
                className="border border-white text-white hover:bg-white hover:text-black uppercase tracking-wider"
                asChild
              >
                <a href="/quienes-somos">Conocenos</a>
              </Button>
            </div>

            {/* Stats */}
            <div className="flex gap-8 pt-8 border-t border-white/10">
              <div>
                <p className="font-bebas text-4xl text-primary">6+</p>
                <p className="text-sm text-gray-400">Marcas</p>
              </div>
              <div>
                <p className="font-bebas text-4xl text-primary">50+</p>
                <p className="text-sm text-gray-400">Modelos</p>
              </div>
              <div>
                <p className="font-bebas text-4xl text-primary">100%</p>
                <p className="text-sm text-gray-400">Financiación</p>
              </div>
            </div>
          </div>

          {/* Image placeholder - se puede reemplazar con una imagen real */}
          <div className="relative hidden lg:block">
            <div className="relative h-[500px] w-full">
              {/* Placeholder para imagen de moto destacada */}
              <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-transparent z-10" />
              <Image
                src="/images/hero-moto.png"
                alt="Moto destacada"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <button
        onClick={scrollToCatalogo}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 hover:text-white transition-colors animate-bounce"
      >
        <ChevronDown className="h-8 w-8" />
      </button>
    </section>
  );
}
