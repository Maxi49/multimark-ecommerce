'use client';

import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { DEFAULT_WHATSAPP_NUMBER, Moto, getWhatsAppLink } from '@/types';
import { MessageCircle, Fuel, Gauge, Disc, Zap } from 'lucide-react';

interface MotoModalProps {
  moto: Moto | null;
  isOpen: boolean;
  onClose: () => void;
  whatsappNumber?: string;
}

export function MotoModal({ moto, isOpen, onClose, whatsappNumber }: MotoModalProps) {
  if (!moto) return null;

  const handleWhatsAppClick = () => {
    const number = whatsappNumber || DEFAULT_WHATSAPP_NUMBER;
    window.open(getWhatsAppLink(number, moto.nombre, moto.marca), '_blank');
  };

  const specs = [
    { icon: Gauge, label: 'Cilindrada', value: moto.specs.cilindrada },
    { icon: Zap, label: 'Motor', value: moto.specs.motor },
    { icon: Disc, label: 'Frenos', value: moto.specs.frenos },
    { icon: Zap, label: 'Arranque', value: moto.specs.arranque },
    { icon: Fuel, label: 'Tanque', value: moto.specs.capacidadTanque },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl p-0 overflow-hidden">
        <div className="grid md:grid-cols-2">
          {/* Imagen */}
          <div className="relative h-64 md:h-full min-h-75 bg-linear-to-br from-gray-100 to-gray-50">
            <Image
              src={moto.imagen}
              alt={`${moto.marca} ${moto.nombre}`}
              fill
              className="object-contain p-6 mix-blend-multiply"
            />
            <span className="absolute top-4 left-4 px-3 py-1 text-xs font-semibold uppercase bg-primary text-white rounded-full">
              {moto.tipo}
            </span>
          </div>

          {/* Info */}
          <div className="p-6 flex flex-col">
            <DialogHeader className="text-left">
              <p className="text-sm font-semibold text-primary uppercase tracking-wider">
                {moto.marca}
              </p>
              <DialogTitle className="font-bebas text-4xl uppercase text-gray-900">
                {moto.nombre}
              </DialogTitle>
            </DialogHeader>

            {/* Specs */}
            <div className="mt-6 space-y-3 flex-1">
              <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                Especificaciones
              </h4>
              <div className="space-y-2">
                {specs.map((spec, index) => (
                  <div key={index} className="flex items-start gap-3 text-sm">
                    <spec.icon className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <div>
                      <span className="font-medium text-gray-900">{spec.label}:</span>{' '}
                      <span className="text-gray-600">{spec.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA WhatsApp */}
            <Button
              onClick={handleWhatsAppClick}
              className="mt-6 w-full bg-[#25D366] hover:bg-[#20BD5A] text-white font-semibold gap-2"
              size="lg"
            >
              <MessageCircle className="h-5 w-5" />
              Consultar por WhatsApp
            </Button>

            <p className="mt-3 text-xs text-center text-gray-500">
              100% financiada · Sin anticipo
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
