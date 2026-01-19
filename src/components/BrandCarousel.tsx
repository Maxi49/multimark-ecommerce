'use client';

import { useCallback, useEffect, useMemo, useState, useRef } from 'react';
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
  const enableCarousel = motos.length > 3;
  const { slides, repeatCount, groupSize } = useMemo(() => {
    if (motos.length === 0) {
      return { slides: [], repeatCount: 1, groupSize: 0 };
    }

    if (!enableCarousel) {
      return {
        slides: motos.map((moto) => ({ moto, key: moto.id })),
        repeatCount: 1,
        groupSize: motos.length,
      };
    }

    const minLoopSlides = 8;
    const baseRepeat = Math.ceil(minLoopSlides / motos.length);
    const repeatCount = motos.length < minLoopSlides ? Math.max(3, baseRepeat) : 1;

    if (repeatCount === 1) {
      return {
        slides: motos.map((moto) => ({ moto, key: moto.id })),
        repeatCount,
        groupSize: motos.length,
      };
    }

    const slides = Array.from({ length: repeatCount }, (_, repeatIndex) =>
      motos.map((moto) => ({ moto, key: `${moto.id}-${repeatIndex}` }))
    ).flat();

    return { slides, repeatCount, groupSize: motos.length };
  }, [enableCarousel, motos]);

  const startIndex = repeatCount >= 3 ? groupSize : 0;
  const autoplay = useRef(
    Autoplay({ delay: 3000, stopOnInteraction: false, stopOnMouseEnter: true })
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: enableCarousel,
      align: 'center',
      skipSnaps: !enableCarousel,
      draggable: enableCarousel,
      startIndex,
    },
    enableCarousel ? [autoplay.current] : []
  );

  const resumeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [tweenValues, setTweenValues] = useState<number[]>([]);

  const onScroll = useCallback(
    (_emblaApi?: unknown, eventName?: string) => {
      if (!emblaApi || !enableCarousel) return;

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

        const scale = 1 - Math.abs(diffToTarget * 0.2);
        return Math.min(Math.max(scale, 0.85), 1.1);
      });

      setTweenValues(styles);
    },
    [emblaApi, enableCarousel]
  );

  useEffect(() => {
    if (!emblaApi || !enableCarousel) return;

    emblaApi.on('scroll', onScroll);
    emblaApi.on('reInit', onScroll);
    onScroll();

    return () => {
      emblaApi.off('scroll', onScroll);
      emblaApi.off('reInit', onScroll);
    };
  }, [emblaApi, enableCarousel, onScroll]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.reInit();
  }, [emblaApi, enableCarousel, slides.length, startIndex]);

  useEffect(() => {
    if (!emblaApi || !enableCarousel || repeatCount < 3 || groupSize === 0) return;

    const handleWrap = () => {
      const selected = emblaApi.selectedScrollSnap();
      const lastGroupStart = slides.length - groupSize;

      if (selected < groupSize) {
        emblaApi.scrollTo(selected + groupSize, true);
        return;
      }

      if (selected >= lastGroupStart) {
        emblaApi.scrollTo(selected - groupSize, true);
      }
    };

    emblaApi.on('select', handleWrap);
    emblaApi.on('reInit', handleWrap);
    return () => {
      emblaApi.off('select', handleWrap);
      emblaApi.off('reInit', handleWrap);
    };
  }, [emblaApi, enableCarousel, repeatCount, groupSize, slides.length]);

  const handleTouchStart = () => {
    if (!enableCarousel) return;
    autoplay.current.stop();
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
  };

  const handleTouchEnd = () => {
    if (!enableCarousel) return;
    resumeTimeoutRef.current = setTimeout(() => {
      if (autoplay.current && emblaApi) {
        autoplay.current.play();
      }
    }, 10000);
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
    <div
      className="overflow-hidden py-8"
      ref={emblaRef}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="flex touch-pan-y -ml-4">
        {slides.map(({ moto, key }, index) => {
          const scale = tweenValues.length ? tweenValues[index] || 0.9 : 1;
          const isCenter = scale > 1.0;

          return (
            <div
              key={key}
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
