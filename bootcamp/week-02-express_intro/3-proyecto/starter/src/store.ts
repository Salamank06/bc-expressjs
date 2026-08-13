import type { Proyecto, CreateProyectoDto, UpdateProyectoDto } from './types.js';

const proyectos: Proyecto[] = [
  { id: 1, name: 'Casa Campestre La Esperanza', type: 'casa', phase: 'estructura', budget: 320000000, contractor: 'Obras Salamanca SAS', progress: 55, active: true },
  { id: 2, name: 'Edificio Torre Norte', type: 'edificio', phase: 'cimentacion', budget: 1850000000, contractor: 'Construcciones Norte S.A.', progress: 15, active: true },
  { id: 3, name: 'Local Comercial Plaza 5', type: 'local', phase: 'acabados', budget: 95000000, contractor: 'Comercializadora Andina', progress: 90, active: true },
  { id: 4, name: 'Bodega Industrial El Carmen', type: 'bodega', phase: 'instalaciones', budget: 480000000, contractor: 'Metálicas del Valle', progress: 30, active: true },
  { id: 5, name: 'Conjunto Residencial Los Pinos', type: 'edificio', phase: 'estructura', budget: 760000000, contractor: 'Obras Salamanca SAS', progress: 45, active: true },
  { id: 6, name: 'Edificio Torre Sur', type: 'edificio', phase: 'cimentacion', budget: 2100000000, contractor: 'Construcciones Norte S.A.', progress: 10, active: true },
];

let nextId = 7;

export function getAll(): Proyecto[] {
  return proyectos;
}

export function getById(id: number): Proyecto | undefined {
  return proyectos.find((p) => p.id === id);
}

export function create(data: CreateProyectoDto): Proyecto {
  const nuevo: Proyecto = { id: nextId++, ...data };
  proyectos.push(nuevo);
  return nuevo;
}

export function update(id: number, data: UpdateProyectoDto): Proyecto | undefined {
  const index = proyectos.findIndex((p) => p.id === id);
  if (index === -1) return undefined;
  proyectos[index] = { ...proyectos[index]!, ...data, id };
  return proyectos[index];
}

export function remove(id: number): boolean {
  const index = proyectos.findIndex((p) => p.id === id);
  if (index === -1) return false;
  proyectos.splice(index, 1);
  return true;
}
