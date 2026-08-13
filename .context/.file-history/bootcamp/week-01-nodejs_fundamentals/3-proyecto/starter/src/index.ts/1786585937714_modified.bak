import { leerDataset } from './reader';
import { generarReporte } from './processor';
import { escribirReporte } from './writer';

async function main(): Promise<void> {
  console.log('[1/3] Leyendo dataset...');
  const { obras, contratistas } = await leerDataset();
  console.log(`      Obras: ${obras.length}, Contratistas: ${contratistas.length}`);

  console.log('[2/3] Procesando reporte...');
  const reporte = generarReporte(obras, contratistas);
  console.log(`      Presupuesto total: ${new Intl.NumberFormat('es-CO').format(reporte.presupuestoTotal)} COP`);

  console.log('[3/3] Escribiendo reporte.json...');
  const path = await escribirReporte(reporte);
  console.log(`      Reporte guardado en: ${path}`);
}

main().catch((err) => console.error('Error fatal:', err));
