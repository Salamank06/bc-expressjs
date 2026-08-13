import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { Material, MaterialConTotal } from './types';

const dataPath = join(__dirname, '..', 'data', 'materiales.json');

export async function listarMaterialesConAsyncAwait(): Promise<MaterialConTotal[]> {
  try {
    const raw = await readFile(dataPath, 'utf-8');
    const materiales = JSON.parse(raw) as Material[];
    return materiales.map((m) => ({ ...m, valorTotal: m.precioUnidad * m.stock }));
  } catch (err) {
    const error = err as Error;
    console.error('[async/await] Error al leer materiales:', error.message);
    throw error;
  }
}

const ejemplo = async () => {
  const data = await listarMaterialesConAsyncAwait();
  console.log('[async/await] Materiales cargados:', data.length);
  console.log('[async/await] Primer material:', data[0]);
};

ejemplo();
