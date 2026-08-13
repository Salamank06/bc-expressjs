import express from 'express';
import { morganMiddleware } from './config/logger';
import proyectosRouter from './routes/proyectos.routes';
import { notFound } from './middlewares/notFound';
import { errorHandler } from './middlewares/errorHandler';
import { prisma } from './lib/prisma';

const app = express();

app.use(express.json());
app.use(morganMiddleware);

app.get('/health', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok', week: '05', db: 'ok' });
  } catch (err) {
    res.status(503).json({ status: 'degraded', week: '05', db: 'down', error: (err as Error).message });
  }
});

app.use('/api/v1/proyectos', proyectosRouter);

app.use(notFound);
app.use(errorHandler);

export default app;
