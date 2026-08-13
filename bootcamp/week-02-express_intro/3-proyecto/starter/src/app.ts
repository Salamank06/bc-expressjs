import express from 'express';
import type { Application, Request, Response, NextFunction } from 'express';
import { proyectosRouter } from './routes/proyectos.routes.js';

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
    res.json({ status: 'ok', week: '02', domain: 'Constructora' });
  });

  app.use('/api/v1/proyectos', proyectosRouter);

  app.use((_req: Request, res: Response) => {
    res.status(404).json({ error: 'Not Found', message: 'Ruta no encontrada' });
  });

  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error('[error]', err.message);
    res.status(500).json({ error: 'Internal Server Error', message: err.message });
  });

  return app;
}
