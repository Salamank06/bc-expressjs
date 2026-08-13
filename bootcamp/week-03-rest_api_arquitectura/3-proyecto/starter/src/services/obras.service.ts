import type { CreateObraDto, UpdateObraDto, Obra, PaginatedResponse, PaginationParams } from '../types.js';
import * as repo from '../repositories/obras.repository.js';

export async function findAll(params: PaginationParams): Promise<PaginatedResponse<Obra>> {
  const { page, limit } = params;
  const all = await repo.findAll();
  const start = (page - 1) * limit;
  const data = all.slice(start, start + limit);
  return { data, total: all.length, page, limit };
}

export async function findById(id: number): Promise<Obra | undefined> {
  return repo.findById(id);
}

export async function create(dto: CreateObraDto): Promise<Obra> {
  if (dto.budget <= 0) {
    throw new Error('El presupuesto debe ser un número positivo');
  }
  if (dto.progress < 0 || dto.progress > 100) {
    throw new Error('El progreso debe estar entre 0 y 100');
  }
  return repo.create(dto);
}

export async function update(id: number, dto: UpdateObraDto): Promise<Obra | undefined> {
  const existe = await repo.findById(id);
  if (!existe) return undefined;
  if (dto.progress !== undefined && (dto.progress < 0 || dto.progress > 100)) {
    throw new Error('El progreso debe estar entre 0 y 100');
  }
  return repo.update(id, dto);
}

export async function remove(id: number): Promise<boolean> {
  const existe = await repo.findById(id);
  if (!existe) return false;
  return repo.remove(id);
}
