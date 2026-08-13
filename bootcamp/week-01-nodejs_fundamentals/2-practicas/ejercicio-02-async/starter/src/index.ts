import './01-callbacks';
import './02-promises';
import { listarMaterialesConAsyncAwait } from './03-async';

async function main(): Promise<void> {
  const data = await listarMaterialesConAsyncAwait();
  console.log('[index] Total materiales (todos los patrones):', data.length);
  console.log('[index] Valor total del inventario:', new Intl.NumberFormat('es-CO').format(
    data.reduce((acc, m) => acc + m.valorTotal, 0),
  ), 'COP');
}

main().catch((err) => console.error('[index] Error fatal:', err));
