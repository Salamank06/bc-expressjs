import { type ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { AppError, isAppError } from '../errors/AppError';
import { logger } from '../config/logger';
import type { ErrorResponse, ValidationErrorResponse } from '../types';

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
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
    const body: ErrorResponse = {
      error: 'Application Error',
      message: err.message,
    };
    logger.warn(`[app:${err.statusCode}] ${err.message}`);
    res.status(err.statusCode).json(body);
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
