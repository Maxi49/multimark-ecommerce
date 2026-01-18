import motosData from './motos.json';
import { Moto } from '@/types';

// Para el cliente usamos el JSON importado estáticamente
// Nota: En un entorno de producción ideal, el cliente debería hacer fetch a la API
// para tener datos frescos, pero para el MVP esto asegura que compile y funcione rápido.
export const motos = motosData as Moto[];

export const getMotosByMarca = (marca: string): Moto[] => {
  return motos.filter((moto) => moto.marca.toLowerCase() === marca.toLowerCase());
};

export const getMotoById = (id: string): Moto | undefined => {
  return motos.find((moto) => moto.id === id);
};

export const searchMotos = (query: string): Moto[] => {
  const lowerQuery = query.toLowerCase();
  return motos.filter(
    (moto) =>
      moto.nombre.toLowerCase().includes(lowerQuery) ||
      moto.marca.toLowerCase().includes(lowerQuery) ||
      moto.tipo.toLowerCase().includes(lowerQuery)
  );
};

