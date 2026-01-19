'use client';

import { useKeenSlider } from 'keen-slider/react';
import { Moto } from '@/types';
import { MotoCard } from '@/components/MotoCard';

interface RecentCarouselProps {
  motos: Moto[];
  onMotoClick: (moto: Moto) => void;
  imageHeight?: number;
}

export function RecentCarousel({ motos, onMotoClick, imageHeight }: RecentCarouselProps) {
  const enableCarousel = motos.length > 1;

  const [sliderRef] = useKeenSlider<HTMLDivElement>(
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

  return (
    <div ref={sliderRef} className="keen-slider">
      {motos.map((moto) => (
        <div key={moto.id} className="keen-slider__slide">
          <MotoCard moto={moto} onClick={onMotoClick} imageHeight={imageHeight} />
        </div>
      ))}
    </div>
  );
}
