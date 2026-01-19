'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import { useKeenSlider } from 'keen-slider/react';
import type { KeenSliderInstance } from 'keen-slider';
import { Moto } from '@/types';
import { MotoCard } from './MotoCard';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface BrandCarouselProps {
  motos: Moto[];
  onMotoClick: (moto: Moto) => void;
  imageHeight?: number;
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export function BrandCarousel({ motos, onMotoClick, imageHeight }: BrandCarouselProps) {
  const enableCarousel = motos.length > 1;
  const showDesktopGrid = motos.length <= 3;
  const [tweenValues, setTweenValues] = useState<number[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const pauseAutoplayRef = useRef<(() => void) | null>(null);
  const carouselMotos =
    enableCarousel && motos.length < 3 ? [...motos, ...motos] : motos;

  const updateTweenValues = useCallback((slider: KeenSliderInstance) => {
    const slides = slider.track.details.slides;
    const values = slides.map((slide) => {
      const slideCenter = slide.distance + slide.size / 2;
      const distanceToCenter = Math.abs(slideCenter - 0.5);
      return clamp(1 - distanceToCenter * 0.6, 0.85, 1.1);
    });
    setTweenValues(values);
  }, []);

  const updateCurrentSlide = useCallback(
    (slider: KeenSliderInstance) => {
      if (!motos.length) return;
      const relIndex = slider.track.details.rel;
      setCurrentSlide(relIndex % motos.length);
    },
    [motos.length]
  );

  const handleDetailsChanged = useCallback(
    (slider: KeenSliderInstance) => {
      updateTweenValues(slider);
      updateCurrentSlide(slider);
    },
    [updateTweenValues, updateCurrentSlide]
  );

  const autoplay = useMemo(
    () => (slider: KeenSliderInstance) => {
      let timeout: ReturnType<typeof setTimeout> | null = null;
      let mouseOver = false;
      let pausedUntil = 0;

      const clearNextTimeout = () => {
        if (timeout) clearTimeout(timeout);
      };

      const nextTimeout = () => {
        clearNextTimeout();
        if (mouseOver) return;
        const now = Date.now();
        const waitForPause = Math.max(0, pausedUntil - now);
        const delay = waitForPause > 0 ? waitForPause : 3500;
        timeout = setTimeout(() => {
          slider.next();
        }, delay);
      };

      const pauseForInteraction = () => {
        pausedUntil = Date.now() + 5000;
        nextTimeout();
      };

      const handleMouseEnter = () => {
        mouseOver = true;
        pauseForInteraction();
      };

      const handleMouseLeave = () => {
        mouseOver = false;
        nextTimeout();
      };

      slider.on('created', () => {
        pauseAutoplayRef.current = pauseForInteraction;
        slider.container.addEventListener('mouseenter', handleMouseEnter);
        slider.container.addEventListener('mouseleave', handleMouseLeave);
        slider.container.addEventListener('pointerdown', pauseForInteraction);
        nextTimeout();
      });
      slider.on('dragStarted', pauseForInteraction);
      slider.on('animationEnded', nextTimeout);
      slider.on('updated', nextTimeout);
      slider.on('destroyed', () => {
        pauseAutoplayRef.current = null;
        slider.container.removeEventListener('mouseenter', handleMouseEnter);
        slider.container.removeEventListener('mouseleave', handleMouseLeave);
        slider.container.removeEventListener('pointerdown', pauseForInteraction);
        clearNextTimeout();
      });
    },
    []
  );

  const [sliderRef, sliderInstanceRef] = useKeenSlider<HTMLDivElement>(
    {
      loop: enableCarousel,
      renderMode: 'precision',
      dragSpeed: 0.9,
      slides: { perView: 1.2, spacing: 16, origin: 'auto' },
      breakpoints: {
        '(min-width: 640px)': {
          slides: { perView: 2, spacing: 16, origin: 'center' },
        },
        '(min-width: 1024px)': {
          slides: { perView: 3, spacing: 16, origin: 'center' },
        },
      },
      created: handleDetailsChanged,
      updated: handleDetailsChanged,
      detailsChanged: handleDetailsChanged,
    },
    enableCarousel ? [autoplay] : []
  );

  const handlePrev = () => {
    pauseAutoplayRef.current?.();
    sliderInstanceRef.current?.prev();
  };

  const handleNext = () => {
    pauseAutoplayRef.current?.();
    sliderInstanceRef.current?.next();
  };

  const handleDotClick = (index: number) => {
    pauseAutoplayRef.current?.();
    sliderInstanceRef.current?.moveToIdx(index);
  };

  if (!enableCarousel) {
    return (
      <div className="py-8">
        <div className="flex flex-wrap justify-center gap-6">
          {motos.map((moto) => (
            <div
              key={moto.id}
              className="w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.33%-1rem)]"
            >
              <MotoCard moto={moto} onClick={onMotoClick} imageHeight={imageHeight} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className={cn('relative', showDesktopGrid && 'lg:hidden')}>
        <div ref={sliderRef} className="keen-slider">
          {carouselMotos.map((moto, index) => {
            const scale = tweenValues.length ? tweenValues[index] || 0.9 : 1;
            const isCenter = scale > 1.0;

            return (
              <div key={`${moto.id}-${index}`} className="keen-slider__slide">
                <div
                  className={cn(
                    'transition-[transform,opacity,box-shadow] duration-500 ease-out',
                    isCenter ? 'shadow-2xl ring-2 ring-primary/20 rounded-xl' : ''
                  )}
                  style={{
                    transform: `scale(${scale})`,
                    opacity: scale < 0.9 ? 0.6 : 1,
                    zIndex: isCenter ? 10 : 1,
                    willChange: 'transform, opacity',
                  }}
                >
                  <MotoCard moto={moto} onClick={onMotoClick} imageHeight={imageHeight} />
                </div>
              </div>
            );
          })}
        </div>

        {motos.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Anterior"
              onClick={handlePrev}
              className="absolute left-2 top-1/2 z-10 h-7 w-7 -translate-y-1/2 rounded-full border border-gray-200 bg-white/90 text-gray-700 shadow-sm transition hover:bg-white"
            >
              <ChevronLeft className="mx-auto h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              aria-label="Siguiente"
              onClick={handleNext}
              className="absolute right-2 top-1/2 z-10 h-7 w-7 -translate-y-1/2 rounded-full border border-gray-200 bg-white/90 text-gray-700 shadow-sm transition hover:bg-white"
            >
              <ChevronRight className="mx-auto h-3.5 w-3.5" />
            </button>
          </>
        )}
      </div>

      {motos.length > 1 && (
        <div
          className={cn(
            'mt-4 flex flex-wrap justify-center gap-2',
            showDesktopGrid && 'lg:hidden'
          )}
        >
          {motos.map((_, index) => (
            <button
              key={`dot-${index}`}
              type="button"
              aria-label={`Ir al item ${index + 1}`}
              onClick={() => handleDotClick(index)}
              className={cn(
                'h-2 w-2 rounded-full transition-all',
                currentSlide === index ? 'bg-primary' : 'bg-gray-300 hover:bg-gray-400'
              )}
            />
          ))}
        </div>
      )}

      {showDesktopGrid && (
        <div className="hidden lg:flex flex-wrap justify-center gap-6">
          {motos.map((moto) => (
            <div
              key={moto.id}
              className="w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.33%-1rem)]"
            >
              <MotoCard moto={moto} onClick={onMotoClick} imageHeight={imageHeight} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
