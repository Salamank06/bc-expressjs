import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { Proyecto } from './types';

const dataPath = join(__dirname, '..', 'data', 'proyectos.json');

export function leerProyectos(): Proyecto[] {
  const raw = readFileSync(dataPath, 'utf-8');
  return JSON.parse(raw) as Proyecto[];
}
