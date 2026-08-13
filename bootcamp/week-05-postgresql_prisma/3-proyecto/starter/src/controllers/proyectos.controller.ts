import { type Request, type Response, type NextFunction } from 'express';
import { z } from 'zod';
import * as service from '../services/proyectos.service';
import {
  createProyectoSchema,
  updateProyectoSchema,
  idSchema,
  type CreateProyectoDto,
  type UpdateProyectoDto,
} from '../schemas/proyecto.schema';
import type { PaginatedResponse, SingleResponse, ValidationErrorResponse, ErrorResponse } from '../types';

function formatIssues(error: z.ZodError): ValidationErrorResponse['issues'] {
  return error.issues.map((issue) => ({
    field: issue.path.join('.') || 'root',
    message: issue.message,
  }));
}

function badRequest(res: Response, message: string, issues: ValidationErrorResponse['issues']): void {
  res.status(400).json({ error: 'Validation Error', message, issues } satisfies ValidationErrorResponse);
}

export async function getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const page = Math.max(1, Number(req.query['page']) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query['limit']) || 10));
    const result = await service.findAll({ page, limit });
    res.json(result satisfies PaginatedResponse<unknown>);
  } catch (err) {
    next(err);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsed = idSchema.safeParse(req.params['id']);
    if (!parsed.success) {
      badRequest(res, 'Parámetro inválido', formatIssues(parsed.error));
      return;
    }
    const proyecto = await service.findById(parsed.data);
    res.json({ data: proyecto } satisfies SingleResponse<unknown>);
  } catch (err) {
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = createProyectoSchema.safeParse(req.body);
    if (!result.success) {
      badRequest(res, 'Datos de entrada inválidos', formatIssues(result.error));
      return;
    }
    const dto: CreateProyectoDto = result.data;
    const proyecto = await service.create(dto);
    res.status(201).json({ data: proyecto } satisfies SingleResponse<unknown>);
  } catch (err) {
    next(err);
  }
}

export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsedId = idSchema.safeParse(req.params['id']);
    if (!parsedId.success) {
      badRequest(res, 'Parámetro inválido', formatIssues(parsedId.error));
      return;
    }
    const result = updateProyectoSchema.safeParse(req.body);
    if (!result.success) {
      badRequest(res, 'Datos de entrada inválidos', formatIssues(result.error));
      return;
    }
    const dto: UpdateProyectoDto = result.data;
    const proyecto = await service.update(parsedId.data, dto);
    res.json({ data: proyecto } satisfies SingleResponse<unknown>);
  } catch (err) {
    next(err);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsed = idSchema.safeParse(req.params['id']);
    if (!parsed.success) {
      badRequest(res, 'Parámetro inválido', formatIssues(parsed.error));
      return;
    }
    await service.remove(parsed.data);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

void ({} as ErrorResponse);
