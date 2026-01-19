'use client';

import { useCallback, useMemo, useState } from 'react';
import { useKeenSlider } from 'keen-slider/react';
import type { KeenSliderInstance } from 'keen-slider';
import { Moto } from '@/types';
import { MotoCard } from './MotoCard';
import { cn } from '@/lib/utils';

interface BrandCarouselProps {
  motos: Moto[];
  onMotoClick: (moto: Moto) => void;
  imageHeight?: number;
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export function BrandCarousel({ motos, onMotoClick, imageHeight }: BrandCarouselProps) {
  const enableCarousel = motos.length > 3;
  const [tweenValues, setTweenValues] = useState<number[]>([]);

  const updateTweenValues = useCallback((slider: KeenSliderInstance) => {
    const slides = slider.track.details.slides;
    const values = slides.map((slide) => {
      const slideCenter = slide.distance + slide.size / 2;
      const distanceToCenter = Math.abs(slideCenter - 0.5);
      return clamp(1 - distanceToCenter * 0.6, 0.85, 1.1);
    });
    setTweenValues(values);
  }, []);

  const autoplay = useMemo(
    () => (slider: KeenSliderInstance) => {
      let timeout: ReturnType<typeof setTimeout> | null = null;
      let mouseOver = false;

      const clearNextTimeout = () => {
        if (timeout) clearTimeout(timeout);
      };

      const nextTimeout = () => {
        clearNextTimeout();
        if (mouseOver) return;
        timeout = setTimeout(() => {
          slider.next();
        }, 3000);
      };

      const handleMouseEnter = () => {
        mouseOver = true;
        clearNextTimeout();
      };

      const handleMouseLeave = () => {
        mouseOver = false;
        nextTimeout();
      };

      slider.on('created', () => {
        slider.container.addEventListener('mouseenter', handleMouseEnter);
        slider.container.addEventListener('mouseleave', handleMouseLeave);
        nextTimeout();
      });
      slider.on('dragStarted', clearNextTimeout);
      slider.on('animationEnded', nextTimeout);
      slider.on('updated', nextTimeout);
      slider.on('destroyed', () => {
        slider.container.removeEventListener('mouseenter', handleMouseEnter);
        slider.container.removeEventListener('mouseleave', handleMouseLeave);
        clearNextTimeout();
      });
    },
    []
  );

  const [sliderRef] = useKeenSlider<HTMLDivElement>(
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
      created: updateTweenValues,
      updated: updateTweenValues,
      detailsChanged: updateTweenValues,
    },
    enableCarousel ? [autoplay] : []
  );

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
      <div ref={sliderRef} className="keen-slider">
        {motos.map((moto, index) => {
          const scale = tweenValues.length ? tweenValues[index] || 0.9 : 1;
          const isCenter = scale > 1.0;

          return (
            <div key={moto.id} className="keen-slider__slide">
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
    </div>
  );
}
