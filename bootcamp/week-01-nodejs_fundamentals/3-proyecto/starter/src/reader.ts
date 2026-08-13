import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { Obra, Contratista } from './types';

const dataPath = join(__dirname, '..', 'data', 'obras.json');

export async function leerDataset(): Promise<{ obras: Obra[]; contratistas: Contratista[] }> {
  const raw = await readFile(dataPath, 'utf-8');
  return JSON.parse(raw) as { obras: Obra[]; contratistas: Contratista[] };
}
