// Tipos para las motos
export interface MotoSpec {
  cilindrada: string;
  motor: string;
  frenos: string;
  arranque: string;
  capacidadTanque: string;
}

export interface Moto {
  id: string;
  nombre: string;
  marca: string;
  tipo: 'urbana' | 'enduro' | 'street' | 'scooter';
  imagen: string;
  cloudinary_public_id?: string;
  specs: MotoSpec;
  destacada?: boolean;
  show_in_hero?: boolean;
}

export interface Marca {
  id: string;
  nombre: string;
  logo?: string;
}

export interface PublicSettings {
  logoUrl: string;
  mapUrl: string;
  whatsappNumber: string;
  phone: string;
  address: string;
  email: string;
  instagramUrl: string;
  facebookUrl: string;
  heroImageScale: number;
  catalogImageHeight: number;
}

// Marcas disponibles
export const MARCAS: Marca[] = [
  { id: 'honda', nombre: 'Honda' },
  { id: 'motomel', nombre: 'Motomel' },
  { id: 'zanella', nombre: 'Zanella' },
  { id: 'corven', nombre: 'Corven' },
  { id: 'keller', nombre: 'Keller' },
  { id: 'guerrero', nombre: 'Guerrero' },
];

// Número de WhatsApp por defecto (fallback)
export const DEFAULT_WHATSAPP_NUMBER = '5491112345678';

// Mensaje predefinido para WhatsApp
export const getWhatsAppMessage = (motoNombre: string, marca: string) => {
  return `Hola! Me interesa la moto ${marca} ${motoNombre}. ¿Podrían darme más información?`;
};

// Generar link de WhatsApp
export const getWhatsAppLink = (
  whatsappNumber: string,
  motoNombre: string,
  marca: string
) => {
  const message = encodeURIComponent(getWhatsAppMessage(motoNombre, marca));
  const sanitizedNumber = whatsappNumber.replace(/[^\d]/g, '');
  return `https://wa.me/${sanitizedNumber}?text=${message}`;
};
