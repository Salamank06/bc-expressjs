import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma';
import type { PaginatedResponse } from '../types';

type Proyecto = Prisma.ProyectoGetPayload<{ include: { avances: true } }>;

interface FindAllParams {
  page: number;
  limit: number;
}

export async function findAll({ page, limit }: FindAllParams): Promise<PaginatedResponse<Proyecto>> {
  const skip = (page - 1) * limit;
  const [total, data] = await Promise.all([
    prisma.proyecto.count({ where: { active: true } }),
    prisma.proyecto.findMany({
      where: { active: true },
      skip,
      take: limit,
      orderBy: { id: 'asc' },
      include: { avances: { orderBy: { date: 'asc' } } },
    }),
  ]);
  return { data, total, page, limit };
}

export async function findById(id: number): Promise<Proyecto | null> {
  return prisma.proyecto.findUnique({
    where: { id },
    include: { avances: { orderBy: { date: 'asc' } } },
  });
}

export async function findByName(name: string): Promise<Proyecto | null> {
  return prisma.proyecto.findUnique({ where: { name } });
}

export async function create(data: Prisma.ProyectoCreateInput): Promise<Proyecto> {
  return prisma.proyecto.create({
    data,
    include: { avances: true },
  });
}

export async function update(id: number, data: Prisma.ProyectoUpdateInput): Promise<Proyecto> {
  return prisma.proyecto.update({
    where: { id },
    data,
    include: { avances: true },
  });
}

export async function remove(id: number): Promise<void> {
  await prisma.proyecto.delete({ where: { id } });
}
