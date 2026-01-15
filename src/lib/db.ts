import fs from 'fs';
import path from 'path';
import { Moto } from '@/types';

const DB_PATH = path.join(process.cwd(), 'src', 'data', 'motos.json');

export function getMotosServer(): Moto[] {
  try {
    const data = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

export function saveMotosServer(motos: Moto[]) {
  fs.writeFileSync(DB_PATH, JSON.stringify(motos, null, 2));
}
