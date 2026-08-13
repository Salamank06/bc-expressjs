import { leerProyectos } from './reader';
import { resumir, formatearPesos } from './processor';

const proyectos = leerProyectos();
const resumen = resumir(proyectos);

console.log('=== Resumen de obras — Constructora Salamanca ===');
console.log(`Total de proyectos: ${resumen.totalProyectos}`);
console.log(`Proyectos activos:  ${resumen.proyectosActivos}`);
console.log(`Presupuesto total:  ${formatearPesos(resumen.presupuestoTotal)}`);
console.log('Proyectos por fase:');
for (const [fase, cantidad] of Object.entries(resumen.porFase)) {
  console.log(`  - ${fase.padEnd(15)}: ${cantidad}`);
}
