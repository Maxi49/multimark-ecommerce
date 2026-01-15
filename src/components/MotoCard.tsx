'use client';

import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Moto } from '@/types';
import { ArrowRight } from 'lucide-react';

interface MotoCardProps {
  moto: Moto;
  onClick: (moto: Moto) => void;
}

export function MotoCard({ moto, onClick }: MotoCardProps) {
  return (
    <Card
      className="group cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-0 bg-gradient-to-b from-gray-50 to-white"
      onClick={() => onClick(moto)}
    >
      <CardContent className="p-0">
        {/* Imagen */}
        <div className="relative h-48 w-full bg-gradient-to-br from-gray-100 to-gray-50 overflow-hidden">
          <Image
            src={moto.imagen}
            alt={`${moto.marca} ${moto.nombre}`}
            fill
            className="object-contain p-4 transition-transform duration-300 group-hover:scale-110 mix-blend-multiply"
          />
          {/* Badge de tipo */}
          <span className="absolute top-3 left-3 px-2 py-1 text-xs font-semibold uppercase bg-primary text-white rounded">
            {moto.tipo}
          </span>
        </div>

        {/* Info */}
        <div className="p-4 space-y-2">
          <p className="text-xs font-semibold text-primary uppercase tracking-wider">
            {moto.marca}
          </p>
          <h3 className="font-bebas text-2xl text-gray-900 uppercase">
            {moto.nombre}
          </h3>
          <div className="flex items-center justify-between pt-2">
            <span className="text-sm text-gray-500">
              {moto.specs.cilindrada}
            </span>
            <span className="flex items-center gap-1 text-sm font-medium text-primary group-hover:gap-2 transition-all">
              Ver más <ArrowRight className="h-4 w-4" />
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
