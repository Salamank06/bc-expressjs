import app from './app';
import { logger } from './config/logger';

const PORT = process.env['PORT'] ? Number(process.env['PORT']) : 3000;

const server = app.listen(PORT, () => {
  logger.info(`[semana04-constructora] Server running on http://localhost:${PORT}`);
  logger.info(`[semana04-constructora] API: http://localhost:${PORT}/api/v1/obras`);
});

function shutdown(signal: string): void {
  logger.warn(`[semana04-constructora] ${signal} received, closing server...`);
  server.close(() => {
    logger.info('[semana04-constructora] Server closed gracefully');
    process.exit(0);
  });
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
