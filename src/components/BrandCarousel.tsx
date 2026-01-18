'use client';

import { useCallback, useEffect, useState, useRef } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { Moto } from '@/types';
import { MotoCard } from './MotoCard';
import { cn } from '@/lib/utils';

interface BrandCarouselProps {
  motos: Moto[];
  onMotoClick: (moto: Moto) => void;
  imageHeight?: number;
}

export function BrandCarousel({ motos, onMotoClick, imageHeight }: BrandCarouselProps) {
  // Configuración de Autoplay
  const autoplay = useRef(
    Autoplay({ delay: 3000, stopOnInteraction: false, stopOnMouseEnter: true })
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: 'center', skipSnaps: false },
    [autoplay.current]
  );

  const resumeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Efecto de escala (3D)
  const [tweenValues, setTweenValues] = useState<number[]>([]);

  const onScroll = useCallback((_emblaApi?: unknown, eventName?: string) => {
    if (!emblaApi) return;

    const engine = emblaApi.internalEngine();
    const scrollProgress = emblaApi.scrollProgress();
    const slidesInView = emblaApi.slidesInView();
    const isScrollEvent = eventName === 'scroll';

    const styles = emblaApi.scrollSnapList().map((scrollSnap, index) => {
      let diffToTarget = scrollSnap - scrollProgress;
      const slidesInSnap = engine.slideRegistry[index];

      slidesInSnap.forEach((slideIndex) => {
        if (isScrollEvent && !slidesInView.includes(slideIndex)) return;

        if (engine.options.loop) {
          engine.slideLooper.loopPoints.forEach((loopItem) => {
            const target = loopItem.target();

            if (slideIndex === loopItem.index && target !== 0) {
              const sign = Math.sign(target);

              if (sign === -1) {
                diffToTarget = scrollSnap - (1 + scrollProgress);
              }
              if (sign === 1) {
                diffToTarget = scrollSnap + (1 - scrollProgress);
              }
            }
          });
        }
      });

      // Lógica simplificada de escala:
      // Cuanto más cerca del 0 (centro), más grande (1.1). Lejos -> 0.85
      const TWEEN_FACTOR_BASE = 0.2; // Cuánto se achica
      const scale = 1 - Math.abs(diffToTarget * TWEEN_FACTOR_BASE);

      // Clampear valores
      const number = Math.min(Math.max(scale, 0.85), 1.1);
      return number;
    });

    // NOTA: Para React puro y performante, a veces es mejor manipular el DOM directamente
    // pero intentaremos con estado primero si no son muchos items.
    // Si son muchos, esto puede ser lento. Para MVP con pocas motos por marca está bien.
    setTweenValues(styles);
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    emblaApi.on('scroll', onScroll);
    emblaApi.on('reInit', onScroll);
    onScroll(); // Init

    return () => {
      emblaApi.off('scroll', onScroll);
      emblaApi.off('reInit', onScroll);
    };
  }, [emblaApi, onScroll]);

  // Lógica de Touch Inteligente (10s delay)
  const handleTouchStart = () => {
    autoplay.current.stop();
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
  };

  const handleTouchEnd = () => {
    // Reiniciar autoplay después de 10 segundos
    resumeTimeoutRef.current = setTimeout(() => {
      if (autoplay.current && emblaApi) {
        autoplay.current.play();
      }
    }, 10000);
  };

  return (
    <div
      className="overflow-hidden py-8"
      ref={emblaRef}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="flex touch-pan-y -ml-4">
        {motos.map((moto, index) => {
          // Si el array de escalas aún no está listo, usar 1
          const scale = tweenValues[index] || 0.9;
          const isCenter = scale > 1.0;

          return (
            <div
              key={moto.id}
              className={cn(
                'flex-[0_0_80%] min-w-0 sm:flex-[0_0_50%] md:flex-[0_0_33.33%] pl-4 transition-[transform,opacity] duration-500 ease-out'
              )}
              style={{
                transform: `scale(${scale})`,
                opacity: scale < 0.9 ? 0.6 : 1,
                zIndex: isCenter ? 10 : 1,
                willChange: 'transform, opacity',
              }}
            >
              <div
                className={cn(
                  'transition-shadow duration-500 ease-out',
                  isCenter ? 'shadow-2xl ring-2 ring-primary/20 rounded-xl' : ''
                )}
              >
                <MotoCard moto={moto} onClick={onMotoClick} imageHeight={imageHeight} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
