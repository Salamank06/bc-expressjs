import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { Reporte } from './types';

const outputPath = join(__dirname, '..', 'data', 'reporte.json');

export async function escribirReporte(reporte: Reporte): Promise<string> {
  await writeFile(outputPath, JSON.stringify(reporte, null, 2), 'utf-8');
  return outputPath;
}
