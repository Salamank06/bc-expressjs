import { createApp } from './app.js';

const PORT = process.env.PORT ?? '3000';
const app = createApp();

const server = app.listen(Number(PORT), () => {
  console.log(`[semana02-constructora] Server running on http://localhost:${PORT}`);
  console.log(`[semana02-constructora] API: http://localhost:${PORT}/api/v1/proyectos`);
});

function shutdown(signal: string): void {
  console.log(`\n[semana02-constructora] ${signal} received, closing server...`);
  server.close(() => {
    console.log('[semana02-constructora] Server closed gracefully');
    process.exit(0);
  });
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
