import { type Request, type Response, type NextFunction } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
import { AppError, isAppError, type PrismaKnownError } from '../errors/AppError';
import { logger } from '../config/logger';
import type { ErrorResponse, ValidationErrorResponse } from '../types';

export const errorHandler: (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) => void = (err, _req, res, _next) => {
  if (err instanceof ZodError) {
    const body: ValidationErrorResponse = {
      error: 'Validation Error',
      message: 'Datos de entrada inválidos',
      issues: err.issues.map((issue) => ({
        field: issue.path.join('.') || 'root',
        message: issue.message,
      })),
    };
    logger.warn(`[zod] ${body.issues.length} issue(s)`, { issues: body.issues });
    res.status(400).json(body);
    return;
  }

  if (isAppError(err)) {
    const body: ErrorResponse = { error: 'Application Error', message: err.message };
    logger.warn(`[app:${err.statusCode}] ${err.message}`);
    res.status(err.statusCode).json(body);
    return;
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    const known = err as PrismaKnownError;
    const code = known.code ?? 'UNKNOWN';
    if (code === 'P2002') {
      const target = (known.meta?.['target'] as string[] | string | undefined) ?? 'campo único';
      const targetStr = Array.isArray(target) ? target.join(', ') : String(target);
      const body: ErrorResponse = {
        error: 'Unique Constraint',
        message: `Ya existe un registro con ese valor en: ${targetStr}`,
      };
      logger.warn(`[prisma:P2002] ${targetStr}`);
      res.status(409).json(body);
      return;
    }
    if (code === 'P2025') {
      const body: ErrorResponse = {
        error: 'Not Found',
        message: 'Recurso no encontrado en la base de datos',
      };
      logger.warn(`[prisma:P2025] recurso no encontrado`);
      res.status(404).json(body);
      return;
    }
    const body: ErrorResponse = {
      error: `Prisma Error ${code}`,
      message: known.message,
    };
    logger.error(`[prisma:${code}] ${known.message}`);
    res.status(500).json(body);
    return;
  }

  const unknown = err as Error;
  const isProduction = process.env['NODE_ENV'] === 'production';
  const body: ErrorResponse = {
    error: 'Internal Server Error',
    message: unknown?.message ?? 'Error no controlado',
    ...(isProduction ? {} : { stack: unknown?.stack }),
  };
  logger.error(`[unhandled] ${body.message}`, { stack: body.stack });
  res.status(500).json(body);
};

void AppError;
