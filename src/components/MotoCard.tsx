'use client';

import Image from 'next/image';
import { Moto } from '@/types';
import { ArrowRight } from 'lucide-react';

interface MotoCardProps {
  moto: Moto;
  onClick: (moto: Moto) => void;
}

export function MotoCard({ moto, onClick }: MotoCardProps) {
  return (
    <div
      className="group cursor-pointer text-center p-4 transition-all duration-300 hover:bg-gray-50 rounded-xl"
      onClick={() => onClick(moto)}
    >
      {/* Imagen Limpia */}
      <div className="relative h-48 w-full mb-6 transition-transform duration-500 group-hover:scale-105">
         <Image
            src={moto.imagen}
            alt={`${moto.marca} ${moto.nombre}`}
            fill
            className="object-contain mix-blend-multiply"
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
