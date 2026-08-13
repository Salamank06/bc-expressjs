import { readFile } from 'node:fs/promises';
import type { Proyecto } from './types.js';

export async function readCatalog(path: string): Promise<Proyecto[]> {
  let raw: string;
  try {
    raw = await readFile(path, 'utf-8');
  } catch {
    console.error(`Error: no se encontró el catálogo en "${path}".`);
    process.exit(1);
  }
  return JSON.parse(raw) as Proyecto[];
}
