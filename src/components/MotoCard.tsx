'use client';

import Image from 'next/image';
import { Moto } from '@/types';
import { ArrowRight } from 'lucide-react';
import { getMotoImageUrl } from '@/lib/cloudinary-url';

interface MotoCardProps {
  moto: Moto;
  onClick: (moto: Moto) => void;
  imageHeight?: number;
}

export function MotoCard({ moto, onClick, imageHeight }: MotoCardProps) {
  const resolvedImageHeight =
    typeof imageHeight === 'number' && Number.isFinite(imageHeight) ? imageHeight : 192;

  const imageUrl = getMotoImageUrl(moto.imagen);

  return (
    <div
      className="group cursor-pointer text-center p-4 transition-all duration-300 hover:bg-gray-50 rounded-xl"
      onClick={() => onClick(moto)}
    >
      {/* Imagen Limpia */}
      <div
        className="relative w-full mb-6 transition-transform duration-500 group-hover:scale-105"
        style={{ height: `${resolvedImageHeight}px` }}
      >
          <Image
            src={imageUrl}
            alt={`${moto.marca} ${moto.nombre}`}
            fill
            className="object-contain" // Quitamos mix-blend-multiply porque ahora confiamos en el PNG
            sizes="(max-width: 640px) 80vw, (max-width: 1024px) 33vw, 25vw"
            quality={95}
          />
      </div>

      {/* Info Minimalista */}
      <div className="space-y-1">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">
          {moto.marca}
        </p>
        <h3 className="font-bebas text-3xl text-gray-900 uppercase tracking-wide">
          {moto.nombre}
        </h3>
        
        <div className="pt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
          <span className="inline-flex items-center gap-2 text-sm font-bold text-primary uppercase tracking-wider">
            Ver Detalles <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </div>
  );
}
