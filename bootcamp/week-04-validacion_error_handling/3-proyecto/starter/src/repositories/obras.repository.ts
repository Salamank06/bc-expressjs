import type { Obra } from '../types';

export type CreateObraRepoDto = Omit<Obra, 'id' | 'createdAt'>;
export type UpdateObraRepoDto = Partial<CreateObraRepoDto>;

const seedDate = (yyyy: number, mm: number, dd: number): Date => new Date(Date.UTC(yyyy, mm - 1, dd, 12));

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
    createdAt: seedDate(2026, 1, 15),
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
    createdAt: seedDate(2026, 2, 2),
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
    createdAt: seedDate(2026, 2, 20),
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
    createdAt: seedDate(2026, 3, 5),
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
    createdAt: seedDate(2026, 3, 12),
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
    createdAt: seedDate(2026, 3, 22),
  },
];

let nextId = 7;

export async function findAll(): Promise<Obra[]> {
  return store.map((o) => ({ ...o, createdAt: new Date(o.createdAt) }));
}

export async function findById(id: number): Promise<Obra | undefined> {
  const found = store.find((o) => o.id === id);
  return found ? { ...found, createdAt: new Date(found.createdAt) } : undefined;
}

export async function findByName(name: string): Promise<Obra | undefined> {
  const found = store.find((o) => o.name.toLowerCase() === name.toLowerCase());
  return found ? { ...found, createdAt: new Date(found.createdAt) } : undefined;
}

export async function create(dto: CreateObraRepoDto): Promise<Obra> {
  const nueva: Obra = {
    id: nextId++,
    ...dto,
    createdAt: new Date(),
  };
  store.push(nueva);
  return { ...nueva, createdAt: new Date(nueva.createdAt) };
}

export async function update(id: number, dto: UpdateObraRepoDto): Promise<Obra | undefined> {
  const index = store.findIndex((o) => o.id === id);
  if (index === -1) return undefined;
  store[index] = { ...store[index]!, ...dto };
  return { ...store[index]!, createdAt: new Date(store[index]!.createdAt) };
}

export async function remove(id: number): Promise<boolean> {
  const index = store.findIndex((o) => o.id === id);
  if (index === -1) return false;
  store.splice(index, 1);
  return true;
}
