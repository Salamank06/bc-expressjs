import express from 'express';
import type { Application, Request, Response, NextFunction } from 'express';
import { obrasRouter } from './routes/obras.routes.js';
import type { ErrorResponse } from './types.js';

export function createApp(): Application {
  const app = express();

  app.use(express.json());

  app.use((req: Request, res: Response, next: NextFunction) => {
    const inicio = Date.now();
    res.on('finish', () => {
      const ms = Date.now() - inicio;
      console.log(`[logger] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${ms}ms)`);
    });
    next();
  });

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', week: '03', project: 'api-arquitectura' });
  });

  app.use('/api/v1/obras', obrasRouter);

  app.use((_req: Request, res: Response) => {
    const response: ErrorResponse = { error: 'Not Found', message: 'Ruta no encontrada' };
    res.status(404).json(response);
  });

  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error('[error]', err.message);
    const response: ErrorResponse = { error: 'Internal Server Error', message: err.message };
    res.status(500).json(response);
  });

  return app;
}
