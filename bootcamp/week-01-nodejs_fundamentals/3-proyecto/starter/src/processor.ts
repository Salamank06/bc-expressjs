import type { Proyecto, Summary } from './types.js';

export function summarize(proyectos: Proyecto[]): Summary {
  const active = proyectos.filter((p) => p.active).length;
  const totalBudget = proyectos.reduce((acc, p) => acc + p.budget, 0);
  const lowestProgressProject = proyectos.reduce<Proyecto | null>(
    (lowest, p) => (lowest === null || p.progress < lowest.progress ? p : lowest),
    null,
  );
  return {
    total: proyectos.length,
    active,
    inactive: proyectos.length - active,
    totalBudget,
    lowestProgressProject,
  };
}

export function findLowProgress(proyectos: Proyecto[], umbral: number): Proyecto[] {
  return proyectos.filter((p) => p.progress <= umbral);
}
