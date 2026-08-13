import type { Obra, PaginatedResponse } from '../types';
import * as repo from '../repositories/obras.repository';
import type { CreateObraDto, UpdateObraDto } from '../schemas/obra.schema';
import { AppError } from '../errors/AppError';

interface FindAllOptions {
  page: number;
  limit: number;
}

export async function findAll(opts: FindAllOptions): Promise<PaginatedResponse<Obra>> {
  const { page, limit } = opts;
  const all = await repo.findAll();
  const start = (page - 1) * limit;
  const data = all.slice(start, start + limit);
  return { data, total: all.length, page, limit };
}

export async function findById(id: number): Promise<Obra> {
  const obra = await repo.findById(id);
  if (!obra) throw new AppError(404, `Obra ${id} no existe`);
  return obra;
}

export async function create(dto: CreateObraDto): Promise<Obra> {
  const existe = await repo.findByName(dto.name);
  if (existe) throw new AppError(409, `Ya existe una obra con el nombre "${dto.name}"`);
  if (dto.phase === 'entrega' && dto.progress < 100) {
    throw new AppError(400, 'Una obra en fase "entrega" debe tener progress >= 100');
  }
  return repo.create(dto);
}

export async function update(id: number, dto: UpdateObraDto): Promise<Obra> {
  const existe = await repo.findById(id);
  if (!existe) throw new AppError(404, `Obra ${id} no existe`);
  if (dto.name && dto.name !== existe.name) {
    const duplicado = await repo.findByName(dto.name);
    if (duplicado && duplicado.id !== id) {
      throw new AppError(409, `Ya existe otra obra con el nombre "${dto.name}"`);
    }
  }
  if (dto.progress !== undefined && (dto.progress < 0 || dto.progress > 100)) {
    throw new AppError(400, 'El progreso debe estar entre 0 y 100');
  }
  const actualizada = await repo.update(id, dto);
  if (!actualizada) throw new AppError(404, `Obra ${id} no existe`);
  return actualizada;
}

export async function remove(id: number): Promise<void> {
  const existe = await repo.findById(id);
  if (!existe) throw new AppError(404, `Obra ${id} no existe`);
  await repo.remove(id);
}
