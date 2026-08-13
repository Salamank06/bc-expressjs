import { readCatalog } from './reader.js';
import { summarize, findLowProgress } from './processor.js';
import { writeReport } from './writer.js';

function parseUmbral(argv: string[]): number {
  const idx = argv.indexOf('--umbral');
  if (idx === -1) return 40;
  const value = Number(argv[idx + 1]);
  return Number.isFinite(value) ? value : 40;
}

function formatearPesos(valor: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(valor);
}

async function main(): Promise<void> {
  const umbral = parseUmbral(process.argv.slice(2));
  const proyectos = await readCatalog('data/proyectos.json');

  const summary = summarize(proyectos);
  const lowProgressAlerts = findLowProgress(proyectos, umbral);

  await writeReport({ summary, lowProgressAlerts }, 'output/report.json');

  console.log('=== Resumen — Constructora Salamanca ===');
  console.log(`Total de proyectos:    ${summary.total}`);
  console.log(`Proyectos activos:     ${summary.active}`);
  console.log(`Proyectos inactivos:   ${summary.inactive}`);
  console.log(`Presupuesto total:     ${formatearPesos(summary.totalBudget)}`);
  if (summary.lowestProgressProject) {
    const p = summary.lowestProgressProject;
    console.log(`Menor avance:          "${p.name}" (${p.progress}% — fase: ${p.phase})`);
  }
  console.log(`Alertas de avance bajo (umbral ${umbral}%): ${lowProgressAlerts.length}`);
  for (const p of lowProgressAlerts) {
    console.log(` - ${p.name} (avance: ${p.progress}%, fase: ${p.phase})`);
  }
  console.log('\nReporte guardado en: output/report.json');
}

main();
