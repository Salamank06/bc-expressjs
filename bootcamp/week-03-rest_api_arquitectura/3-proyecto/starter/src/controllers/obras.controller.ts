import type { Request, Response, NextFunction } from 'express';
import * as service from '../services/obras.service.js';
import type { CreateObraDto, UpdateObraDto } from '../types.js';

function parsePagination(req: Request): { page: number; limit: number } {
  const page = Math.max(1, Number(req.query['page'] ?? 1));
  const limit = Math.min(100, Math.max(1, Number(req.query['limit'] ?? 10)));
  return { page, limit };
}

export async function getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { page, limit } = parsePagination(req);
    const result = await service.findAll({ page, limit });
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = Number(req.params['id']);
    if (!Number.isInteger(id) || id <= 0) {
      res.status(400).json({ error: 'Bad Request', message: 'id inválido' });
      return;
    }
    const obra = await service.findById(id);
    if (!obra) {
      res.status(404).json({ error: 'Not Found', message: `Obra ${id} no existe` });
      return;
    }
    res.json({ data: obra });
  } catch (err) {
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const dto = req.body as CreateObraDto;
    if (!dto.name || typeof dto.name !== 'string') {
      res.status(400).json({ error: 'Bad Request', message: 'name es obligatorio' });
      return;
    }
    if (!dto.type || !['casa', 'edificio', 'local', 'bodega'].includes(dto.type)) {
      res.status(400).json({ error: 'Bad Request', message: 'type debe ser casa|edificio|local|bodega' });
      return;
    }
    if (!dto.phase || !['cimentacion', 'estructura', 'instalaciones', 'acabados', 'entrega'].includes(dto.phase)) {
      res.status(400).json({ error: 'Bad Request', message: 'phase debe ser cimentacion|estructura|instalaciones|acabados|entrega' });
      return;
    }
    if (typeof dto.budget !== 'number' || dto.budget <= 0) {
      res.status(400).json({ error: 'Bad Request', message: 'budget debe ser un número positivo' });
      return;
    }
    if (!dto.contractor || typeof dto.contractor !== 'string') {
      res.status(400).json({ error: 'Bad Request', message: 'contractor es obligatorio' });
      return;
    }
    if (typeof dto.progress !== 'number' || dto.progress < 0 || dto.progress > 100) {
      res.status(400).json({ error: 'Bad Request', message: 'progress debe estar entre 0 y 100' });
      return;
    }

    const nueva = await service.create({
      name: dto.name,
      type: dto.type,
      phase: dto.phase,
      budget: dto.budget,
      contractor: dto.contractor,
      progress: dto.progress,
      active: dto.active ?? true,
    });
    res.status(201).json({ data: nueva });
  } catch (err) {
    next(err);
  }
}

export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = Number(req.params['id']);
    if (!Number.isInteger(id) || id <= 0) {
      res.status(400).json({ error: 'Bad Request', message: 'id inválido' });
      return;
    }
    const dto = req.body as UpdateObraDto;
    const actualizada = await service.update(id, dto);
    if (!actualizada) {
      res.status(404).json({ error: 'Not Found', message: `Obra ${id} no existe` });
      return;
    }
    res.json({ data: actualizada });
  } catch (err) {
    next(err);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = Number(req.params['id']);
    if (!Number.isInteger(id) || id <= 0) {
      res.status(400).json({ error: 'Bad Request', message: 'id inválido' });
      return;
    }
    const ok = await service.remove(id);
    if (!ok) {
      res.status(404).json({ error: 'Not Found', message: `Obra ${id} no existe` });
      return;
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
