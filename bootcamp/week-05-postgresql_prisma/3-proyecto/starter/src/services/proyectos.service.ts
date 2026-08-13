import type { Proyecto } from '@prisma/client';
import * as repo from '../repositories/proyectos.repository';
import type { CreateProyectoDto, UpdateProyectoDto } from '../schemas/proyecto.schema';
import { AppError } from '../errors/AppError';

type ProyectoConAvances = Awaited<ReturnType<typeof repo.findById>>;

export async function findAll(opts: { page: number; limit: number }) {
  return repo.findAll(opts);
}

export async function findById(id: number): Promise<NonNullable<ProyectoConAvances>> {
  const proyecto = await repo.findById(id);
  if (!proyecto) throw new AppError(404, `Proyecto ${id} no existe`);
  return proyecto;
}

export async function create(dto: CreateProyectoDto): Promise<NonNullable<ProyectoConAvances>> {
  const existente = await repo.findByName(dto.name);
  if (existente) throw new AppError(409, `Ya existe un proyecto con el nombre "${dto.name}"`);
  if (dto.phase === 'entrega' && dto.progress < 100) {
    throw new AppError(400, 'Una obra en fase "entrega" debe tener progress >= 100');
  }
  const creado = await repo.create({
    name: dto.name,
    type: dto.type,
    phase: dto.phase,
    budget: dto.budget,
    contractor: dto.contractor,
    progress: dto.progress,
    active: dto.active,
  });
  if (!creado) throw new AppError(500, 'No se pudo crear el proyecto');
  return creado as NonNullable<ProyectoConAvances>;
}

export async function update(id: number, dto: UpdateProyectoDto): Promise<NonNullable<ProyectoConAvances>> {
  const existe = await repo.findById(id);
  if (!existe) throw new AppError(404, `Proyecto ${id} no existe`);
  if (dto.name && dto.name !== existe.name) {
    const duplicado = await repo.findByName(dto.name);
    if (duplicado) throw new AppError(409, `Ya existe otro proyecto con el nombre "${dto.name}"`);
  }
  if (dto.progress !== undefined && (dto.progress < 0 || dto.progress > 100)) {
    throw new AppError(400, 'El progreso debe estar entre 0 y 100');
  }
  const actualizado = await repo.update(id, dto);
  return actualizado as NonNullable<ProyectoConAvances>;
}

export async function remove(id: number): Promise<void> {
  const existe = await repo.findById(id);
  if (!existe) throw new AppError(404, `Proyecto ${id} no existe`);
  await repo.remove(id);
}

void ({} as Proyecto);
