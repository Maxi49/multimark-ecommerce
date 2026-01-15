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
  specs: MotoSpec;
  destacada?: boolean;
}

export interface Marca {
  id: string;
  nombre: string;
  logo?: string;
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

// Número de WhatsApp para consultas (cambiar por el real)
export const WHATSAPP_NUMBER = '5491112345678';

// Mensaje predefinido para WhatsApp
export const getWhatsAppMessage = (motoNombre: string, marca: string) => {
  return `Hola! Me interesa la moto ${marca} ${motoNombre}. ¿Podrían darme más información?`;
};

// Generar link de WhatsApp
export const getWhatsAppLink = (motoNombre: string, marca: string) => {
  const message = encodeURIComponent(getWhatsAppMessage(motoNombre, marca));
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
};
