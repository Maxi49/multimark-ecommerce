'use client';

import { useCallback, useState } from 'react';
import { useKeenSlider } from 'keen-slider/react';
import type { KeenSliderInstance } from 'keen-slider';
import { Moto } from '@/types';
import { MotoCard } from '@/components/MotoCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface RecentCarouselProps {
  motos: Moto[];
  onMotoClick: (moto: Moto) => void;
  imageHeight?: number;
}

export function RecentCarousel({ motos, onMotoClick, imageHeight }: RecentCarouselProps) {
  const enableCarousel = motos.length > 1;
  const [currentSlide, setCurrentSlide] = useState(0);
  const [maxIdx, setMaxIdx] = useState(0);

  const updateDetails = useCallback((slider: KeenSliderInstance) => {
    setCurrentSlide(slider.track.details.rel);
    setMaxIdx(slider.track.details.maxIdx);
  }, []);

  const [sliderRef, sliderInstanceRef] = useKeenSlider<HTMLDivElement>(
    {
      loop: false,
      renderMode: 'precision',
      dragSpeed: 0.9,
      slides: { perView: 1.2, spacing: 16, origin: 'auto' },
      breakpoints: {
        '(min-width: 640px)': {
          slides: { perView: 2, spacing: 16, origin: 'auto' },
        },
        '(min-width: 1024px)': {
          slides: { perView: 3, spacing: 16, origin: 'auto' },
        },
      },
      created: updateDetails,
      updated: updateDetails,
      detailsChanged: updateDetails,
    },
    []
  );

  if (!enableCarousel) {
    return (
      <div className="flex justify-center">
        {motos.map((moto) => (
          <div key={moto.id} className="w-full sm:max-w-sm">
            <MotoCard moto={moto} onClick={onMotoClick} imageHeight={imageHeight} />
          </div>
        ))}
      </div>
    );
  }

  const handlePrev = () => {
    sliderInstanceRef.current?.prev();
  };

  const handleNext = () => {
    sliderInstanceRef.current?.next();
  };

  const handleDotClick = (index: number) => {
    sliderInstanceRef.current?.moveToIdx(index);
  };

  const canPrev = currentSlide > 0;
  const canNext = currentSlide < maxIdx;

  return (
    <div className="relative">
      <div ref={sliderRef} className="keen-slider">
        {motos.map((moto) => (
          <div key={moto.id} className="keen-slider__slide">
            <MotoCard moto={moto} onClick={onMotoClick} imageHeight={imageHeight} />
          </div>
        ))}
      </div>

      {motos.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Anterior"
            onClick={handlePrev}
            disabled={!canPrev}
            className="absolute left-2 top-1/2 z-10 h-7 w-7 -translate-y-1/2 rounded-full border border-gray-200 bg-white/90 text-gray-700 shadow-sm transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft className="mx-auto h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            aria-label="Siguiente"
            onClick={handleNext}
            disabled={!canNext}
            className="absolute right-2 top-1/2 z-10 h-7 w-7 -translate-y-1/2 rounded-full border border-gray-200 bg-white/90 text-gray-700 shadow-sm transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronRight className="mx-auto h-3.5 w-3.5" />
          </button>
        </>
      )}

      {motos.length > 1 && (
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {motos.map((_, index) => (
            <button
              key={`dot-${index}`}
              type="button"
              aria-label={`Ir al item ${index + 1}`}
              onClick={() => handleDotClick(index)}
              className={`h-2 w-2 rounded-full transition-all ${
                currentSlide === index ? 'bg-primary' : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
