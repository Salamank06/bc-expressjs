import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { Material, MaterialConTotal } from './types';

const dataPath = join(__dirname, '..', 'data', 'materiales.json');

export function listarMaterialesConPromesa(): Promise<MaterialConTotal[]> {
  return readFile(dataPath, 'utf-8')
    .then((raw) => {
      const materiales = JSON.parse(raw) as Material[];
      return materiales.map((m) => ({ ...m, valorTotal: m.precioUnidad * m.stock }));
    })
    .catch((err) => {
      console.error('[promises] Error al leer materiales:', err.message);
      throw err;
    });
}

listarMaterialesConPromesa()
  .then((data) => {
    console.log('[promises] Materiales cargados:', data.length);
    console.log('[promises] Primer material:', data[0]);
  })
  .catch((err) => {
    console.error('[promises] Fallo:', err.message);
  });
