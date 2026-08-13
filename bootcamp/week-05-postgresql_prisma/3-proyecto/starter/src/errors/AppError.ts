import type { ErrorResponse, ValidationErrorResponse } from '../types';

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
    this.name = 'AppError';
  }
}

export function isAppError(err: unknown): err is AppError {
  return err instanceof AppError;
}

export type PrismaKnownError = Error & {
  code?: string;
  meta?: Record<string, unknown>;
};

void ({} as ErrorResponse);
void ({} as ValidationErrorResponse);
