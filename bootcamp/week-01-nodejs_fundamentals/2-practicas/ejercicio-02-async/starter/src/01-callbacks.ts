import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { Material, MaterialConTotal } from './types';

const dataPath = join(__dirname, '..', 'data', 'materiales.json');

function cargarMateriales(): Material[] {
  const raw = readFileSync(dataPath, 'utf-8');
  return JSON.parse(raw) as Material[];
}

export function listarMaterialesConCallback(cb: (err: Error | null, data?: MaterialConTotal[]) => void): void {
  setImmediate(() => {
    try {
      const materiales = cargarMateriales();
      const totales = materiales.map((m) => ({ ...m, valorTotal: m.precioUnidad * m.stock }));
      cb(null, totales);
    } catch (err) {
      cb(err as Error);
    }
  });
}

listarMaterialesConCallback((err, data) => {
  if (err) {
    console.error('[callbacks] Error:', err.message);
    return;
  }
  console.log('[callbacks] Materiales cargados:', data?.length ?? 0);
  console.log('[callbacks] Primer material:', data?.[0]);
});
