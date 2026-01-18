'use client';

import { MessageCircle } from 'lucide-react';
import { DEFAULT_WHATSAPP_NUMBER } from '@/types';

interface WhatsAppButtonProps {
  whatsappNumber?: string;
  message?: string;
}

export function WhatsAppButton({ whatsappNumber, message }: WhatsAppButtonProps) {
  const handleClick = () => {
    const text = encodeURIComponent(
      message || 'Hola! Me gustaría recibir información sobre las motos disponibles.'
    );
    const number = (whatsappNumber || DEFAULT_WHATSAPP_NUMBER).replace(/[^\d]/g, '');
    window.open(`https://wa.me/${number}?text=${text}`, '_blank');
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-[#25D366] hover:bg-[#20BD5A] text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 group"
      aria-label="Contactar por WhatsApp"
    >
      <MessageCircle className="h-7 w-7" />

      {/* Tooltip */}
      <span className="absolute right-16 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap">
        ¿Necesitás ayuda?
      </span>

      {/* Ping animation */}
      <span className="absolute flex h-full w-full">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-75"></span>
      </span>
    </button>
  );
}

