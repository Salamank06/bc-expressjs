import app from './app';
import { logger } from './config/logger';
import { prisma } from './lib/prisma';

const PORT = process.env['PORT'] ? Number(process.env['PORT']) : 3000;

async function bootstrap(): Promise<void> {
  try {
    await prisma.$connect();
    logger.info('[semana05-constructora] PostgreSQL conectado via Prisma');
  } catch (err) {
    logger.error(`[semana05-constructora] No se pudo conectar a PostgreSQL: ${(err as Error).message}`);
    process.exit(1);
  }

  const server = app.listen(PORT, () => {
    logger.info(`[semana05-constructora] Server running on http://localhost:${PORT}`);
    logger.info(`[semana05-constructora] API: http://localhost:${PORT}/api/v1/proyectos`);
  });

  function shutdown(signal: string): void {
    logger.warn(`[semana05-constructora] ${signal} received, cerrando...`);
    server.close(async () => {
      await prisma.$disconnect();
      logger.info('[semana05-constructora] Server y Prisma cerrados');
      process.exit(0);
    });
  }

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

void bootstrap();
