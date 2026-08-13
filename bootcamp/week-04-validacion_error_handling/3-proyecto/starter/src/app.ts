import express from 'express';
import { morganMiddleware } from './config/logger';
import obrasRouter from './routes/obras.routes';
import { notFound } from './middlewares/notFound';
import { errorHandler } from './middlewares/errorHandler';

const app = express();

app.use(express.json());
app.use(morganMiddleware);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', week: '04', domain: 'Constructora' });
});

app.use('/api/v1/obras', obrasRouter);

app.use(notFound);
app.use(errorHandler);

export default app;
