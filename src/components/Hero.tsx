import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { MotoModal } from '@/components/MotoModal';
import { cn } from '@/lib/utils';
import { getMotoImageUrl } from '@/lib/cloudinary-url';
import { Moto } from '@/types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface HeroProps {
  heroMotos?: Moto[];
  imageScale?: number;
  whatsappNumber?: string;
}

export function Hero({ heroMotos = [], imageScale, whatsappNumber }: HeroProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedMoto, setSelectedMoto] = useState<Moto | null>(null);
  const lastInteractionRef = useRef(0);

  const registerInteraction = () => {
    lastInteractionRef.current = Date.now();
  };

  // Auto-advance carousel if more than 1 moto
  useEffect(() => {
    if (heroMotos.length <= 1) return;

    const interval = setInterval(() => {
      const now = Date.now();
      if (now - lastInteractionRef.current < 3300) {
        return;
      } 
      setCurrentIndex((prev) => (prev + 1) % heroMotos.length);
    }, 3300); // 5 seconds per slide

    return () => clearInterval(interval);
  }, [heroMotos.length]);

  const scrollToCatalogo = () => {
    const catalogo = document.getElementById('catalogo');
    catalogo?.scrollIntoView({ behavior: 'smooth' });
  };

  const hasHeroMotos = heroMotos.length > 0;
  const currentMoto = hasHeroMotos ? heroMotos[currentIndex] : null;
  const heroImageScale =
    typeof imageScale === 'number' && Number.isFinite(imageScale) ? imageScale : 1.05;
  const displayName = currentMoto
    ? `${currentMoto.marca} ${currentMoto.nombre}`
    : 'MODELOS EXCLUSIVOS';

  const handlePrev = () => {
    if (heroMotos.length <= 1) return;
    registerInteraction();
    setCurrentIndex((prev) => (prev - 1 + heroMotos.length) % heroMotos.length);
  };

  const handleNext = () => {
    if (heroMotos.length <= 1) return;
    registerInteraction();
    setCurrentIndex((prev) => (prev + 1) % heroMotos.length);
  };

  return (
    <>
      <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-white py-10 md:py-0">
      {/* Abstract Background Element - Minimal Gray Shape */}
      <div className="absolute right-0 top-0 h-full w-2/3 bg-gray-50/80 -skew-x-12 translate-x-1/4 z-0" />

      <div className="container mx-auto px-6 md:px-4 relative z-10">
        <div className="grid lg:grid-cols-5 gap-8 items-center">
          {/* Content (2 cols) */}
          <div className="lg:col-span-2 space-y-6 md:space-y-8 text-center md:text-left">
            <div>
              <p className="font-script text-lg text-gray-700">
                La evolución del movimiento
                <span className="ml-2 inline-block h-2 w-2 rounded-full bg-secondary align-middle" />
              </p>
              <h1 className="font-bebas text-6xl md:text-8xl uppercase leading-[0.9] text-black">
                POTENCIA <br />
                <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-blue-700">
                  SIN LÍMITES
                </span>
              </h1>
            </div>

            <p className="text-gray-600 text-lg leading-relaxed max-w-md mx-auto md:mx-0">
              Descubrí nuestra selección premium de motocicletas.
              Financiación exclusiva del 100% y entrega inmediata.
            </p>

            <div className="flex flex-wrap justify-center md:justify-start gap-3 md:gap-4 pt-2 md:pt-4">
              <Button
                onClick={scrollToCatalogo}
                size="lg"
                className="h-14 px-8 bg-primary hover:bg-primary/90 text-white font-bold uppercase tracking-wider text-base rounded-full shadow-lg shadow-primary/20"
              >
                Ver Catálogo
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="h-14 px-8 border-2 border-gray-200 text-gray-900 hover:bg-gray-50 uppercase tracking-wider text-base rounded-full font-bold"
                asChild
              >
                <a href="/quienes-somos">Conócenos</a>
              </Button>
            </div>
          </div>

          {/* Image (3 cols) */}
          <div className="lg:col-span-3 relative h-125 md:h-150 w-full flex items-center justify-center overflow-hidden">
            {/* Moto Name Label (Dynamic) */}
            {currentMoto && (
              <div
                key={currentMoto.id}
                className="absolute top-10 left-1/2 -translate-x-1/2 z-20 bg-white/80 backdrop-blur-sm border border-gray-200 px-6 py-3 rounded-2xl shadow-sm pointer-events-none animate-in fade-in-0 slide-in-from-bottom-2 duration-500 md:top-10 md:left-auto md:right-10 md:translate-x-0"
              >
                <p className="font-bebas text-xl text-gray-800 uppercase tracking-wider">
                  {displayName}
                </p>
              </div>
            )}

            {hasHeroMotos ? (
              heroMotos.map((moto, idx) => (
                <div
                  key={moto.id}
                  className={cn(
                    "absolute inset-0 flex items-center justify-center transition-all duration-600 ease-out will-change-transform will-change-opacity motion-reduce:transition-none",
                    idx === currentIndex
                      ? "opacity-100 translate-y-0 scale-100 cursor-pointer"
                      : "opacity-0 translate-y-3 scale-[0.98] pointer-events-none"
                  )}
                  onClick={() => {
                    registerInteraction();
                    setSelectedMoto(moto);
                  }}
                  onPointerDown={registerInteraction}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      registerInteraction();
                      setSelectedMoto(moto);
                    }
                  }}
                  role="button"
                  tabIndex={idx === currentIndex ? 0 : -1}
                  aria-label={`Ver detalles de ${moto.marca} ${moto.nombre}`}
                >
                  <div className="relative h-full w-full">
                    <Image
                      src={getMotoImageUrl(moto.imagen)}
                      alt="Moto destacada"
                      fill
                      className="object-contain mix-blend-multiply transition-transform duration-700"
                      style={{ transform: `scale(${heroImageScale})` }}
                      priority={idx === currentIndex}
                      sizes="(max-width: 768px) 100vw, 60vw"
                      quality={95}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative h-full w-full">
                  <Image
                    src={getMotoImageUrl('/images/hero-moto.png')}
                    alt="Moto destacada"
                    fill
                    className="object-contain mix-blend-multiply transition-transform duration-700"
                    style={{ transform: `scale(${heroImageScale})` }}
                    priority
                    sizes="(max-width: 768px) 100vw, 60vw"
                    quality={95}
                  />
                </div>
              </div>
            )}

            {heroMotos.length > 1 && (
              <>
                <button
                  type="button"
                  aria-label="Anterior"
                  onClick={handlePrev}
                  className="absolute left-3 top-1/2 z-20 h-7 w-7 -translate-y-1/2 rounded-full border border-gray-200 bg-white/90 text-gray-700 shadow-sm transition hover:bg-white"
                >
                  <ChevronLeft className="mx-auto h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  aria-label="Siguiente"
                  onClick={handleNext}
                  className="absolute right-3 top-1/2 z-20 h-7 w-7 -translate-y-1/2 rounded-full border border-gray-200 bg-white/90 text-gray-700 shadow-sm transition hover:bg-white"
                >
                  <ChevronRight className="mx-auto h-3.5 w-3.5" />
                </button>
              </>
            )}

            {/* Carousel Indicators */}
            {heroMotos.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {heroMotos.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      registerInteraction();
                      setCurrentIndex(idx);
                    }}
                    className={`h-2 rounded-full transition-all ${
                      idx === currentIndex ? 'w-8 bg-primary' : 'w-2 bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      </section>
      <MotoModal
        moto={selectedMoto}
        isOpen={!!selectedMoto}
        onClose={() => setSelectedMoto(null)}
        whatsappNumber={whatsappNumber}
      />
    </>
  );
}
