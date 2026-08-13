import { Proyecto, FaseObra } from './types';

export interface Resumen {
  totalProyectos: number;
  proyectosActivos: number;
  presupuestoTotal: number;
  porFase: Record<FaseObra, number>;
}

export function resumir(proyectos: Proyecto[]): Resumen {
  const porFase: Record<FaseObra, number> = {
    cimentacion: 0,
    estructura: 0,
    instalaciones: 0,
    acabados: 0,
    entrega: 0,
  };

  let presupuestoTotal = 0;
  let proyectosActivos = 0;

  for (const p of proyectos) {
    presupuestoTotal += p.presupuesto;
    if (p.activo) proyectosActivos += 1;
    porFase[p.fase] += 1;
  }

  return {
    totalProyectos: proyectos.length,
    proyectosActivos,
    presupuestoTotal,
    porFase,
  };
}

export function formatearPesos(valor: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(valor);
}
