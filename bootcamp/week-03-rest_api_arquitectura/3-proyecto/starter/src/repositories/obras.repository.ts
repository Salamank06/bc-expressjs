import type { Obra, CreateObraDto, UpdateObraDto } from '../types.js';

const store: Obra[] = [
  {
    id: 1,
    name: 'Casa Campestre La Esperanza',
    type: 'casa',
    phase: 'estructura',
    budget: 320000000,
    contractor: 'Obras Salamanca SAS',
    progress: 55,
    active: true,
    createdAt: '2026-01-15T10:00:00.000Z',
  },
  {
    id: 2,
    name: 'Edificio Torre Norte',
    type: 'edificio',
    phase: 'cimentacion',
    budget: 1850000000,
    contractor: 'Construcciones Norte S.A.',
    progress: 15,
    active: true,
    createdAt: '2026-02-02T09:30:00.000Z',
  },
  {
    id: 3,
    name: 'Local Comercial Plaza 5',
    type: 'local',
    phase: 'acabados',
    budget: 95000000,
    contractor: 'Comercializadora Andina',
    progress: 90,
    active: true,
    createdAt: '2026-02-20T14:15:00.000Z',
  },
  {
    id: 4,
    name: 'Bodega Industrial El Carmen',
    type: 'bodega',
    phase: 'instalaciones',
    budget: 480000000,
    contractor: 'Metálicas del Valle',
    progress: 30,
    active: true,
    createdAt: '2026-03-05T08:00:00.000Z',
  },
  {
    id: 5,
    name: 'Conjunto Residencial Los Pinos',
    type: 'edificio',
    phase: 'estructura',
    budget: 760000000,
    contractor: 'Obras Salamanca SAS',
    progress: 45,
    active: true,
    createdAt: '2026-03-12T11:45:00.000Z',
  },
  {
    id: 6,
    name: 'Edificio Torre Sur',
    type: 'edificio',
    phase: 'cimentacion',
    budget: 2100000000,
    contractor: 'Construcciones Norte S.A.',
    progress: 10,
    active: true,
    createdAt: '2026-03-22T16:00:00.000Z',
  },
];

let nextId = 7;

export async function findAll(): Promise<Obra[]> {
  return store.map((o) => ({ ...o }));
}

export async function findById(id: number): Promise<Obra | undefined> {
  const found = store.find((o) => o.id === id);
  return found ? { ...found } : undefined;
}

export async function create(dto: CreateObraDto): Promise<Obra> {
  const nueva: Obra = {
    id: nextId++,
    ...dto,
    createdAt: new Date().toISOString(),
  };
  store.push(nueva);
  return { ...nueva };
}

export async function update(id: number, dto: UpdateObraDto): Promise<Obra | undefined> {
  const index = store.findIndex((o) => o.id === id);
  if (index === -1) return undefined;
  store[index] = { ...store[index]!, ...dto };
  return { ...store[index]! };
}

export async function remove(id: number): Promise<boolean> {
  const index = store.findIndex((o) => o.id === id);
  if (index === -1) return false;
  store.splice(index, 1);
  return true;
}
