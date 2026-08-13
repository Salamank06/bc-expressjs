import { type Request, type Response, type NextFunction } from 'express';
import { z } from 'zod';
import * as service from '../services/obras.service';
import {
  createObraSchema,
  updateObraSchema,
  idSchema,
  type CreateObraDto,
  type UpdateObraDto,
} from '../schemas/obra.schema';
import type { PaginatedResponse, SingleResponse, ValidationErrorResponse, Obra } from '../types';

function formatIssues(error: z.ZodError): ValidationErrorResponse['issues'] {
  return error.issues.map((issue) => ({
    field: issue.path.join('.') || 'root',
    message: issue.message,
  }));
}

export async function getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const page = Number(req.query['page']) || 1;
    const limit = Number(req.query['limit']) || 10;
    const result = await service.findAll({ page, limit });
    res.json(result satisfies PaginatedResponse<Obra>);
  } catch (err) {
    next(err);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsed = idSchema.safeParse(req.params['id']);
    if (!parsed.success) {
      res.status(400).json({
        error: 'Validation Error',
        message: 'Parámetro inválido',
        issues: formatIssues(parsed.error),
      } satisfies ValidationErrorResponse);
      return;
    }
    const obra = await service.findById(parsed.data);
    res.json({ data: obra } satisfies SingleResponse<Obra>);
  } catch (err) {
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = createObraSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({
        error: 'Validation Error',
        message: 'Datos de entrada inválidos',
        issues: formatIssues(result.error),
      } satisfies ValidationErrorResponse);
      return;
    }
    const dto: CreateObraDto = result.data;
    const obra = await service.create(dto);
    res.status(201).json({ data: obra } satisfies SingleResponse<Obra>);
  } catch (err) {
    next(err);
  }
}

export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsedId = idSchema.safeParse(req.params['id']);
    if (!parsedId.success) {
      res.status(400).json({
        error: 'Validation Error',
        message: 'Parámetro inválido',
        issues: formatIssues(parsedId.error),
      } satisfies ValidationErrorResponse);
      return;
    }
    const result = updateObraSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({
        error: 'Validation Error',
        message: 'Datos de entrada inválidos',
        issues: formatIssues(result.error),
      } satisfies ValidationErrorResponse);
      return;
    }
    const dto: UpdateObraDto = result.data;
    const obra = await service.update(parsedId.data, dto);
    res.json({ data: obra } satisfies SingleResponse<Obra>);
  } catch (err) {
    next(err);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsed = idSchema.safeParse(req.params['id']);
    if (!parsed.success) {
      res.status(400).json({
        error: 'Validation Error',
        message: 'Parámetro inválido',
        issues: formatIssues(parsed.error),
      } satisfies ValidationErrorResponse);
      return;
    }
    await service.remove(parsed.data);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
