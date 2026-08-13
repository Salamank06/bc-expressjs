import { Router } from 'express';
import * as store from '../store.js';
import type { CreateProyectoDto, UpdateProyectoDto } from '../types.js';

export const proyectosRouter = Router();

proyectosRouter.get('/', (_req, res) => {
  const data = store.getAll();
  res.json({ data, total: data.length });
});

proyectosRouter.get('/:id', (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ error: 'Bad Request', message: 'id inválido' });
    return;
  }
  const proyecto = store.getById(id);
  if (!proyecto) {
    res.status(404).json({ error: 'Not Found', message: `Proyecto ${id} no existe` });
    return;
  }
  res.json({ data: proyecto });
});

proyectosRouter.post('/', (req, res) => {
  const dto = req.body as Partial<CreateProyectoDto>;
  if (!dto.name || typeof dto.name !== 'string') {
    res.status(400).json({ error: 'Bad Request', message: 'name es obligatorio' });
    return;
  }
  if (!dto.type || !['casa', 'edificio', 'local', 'bodega'].includes(dto.type)) {
    res.status(400).json({ error: 'Bad Request', message: 'type debe ser casa|edificio|local|bodega' });
    return;
  }
  if (!dto.phase || !['cimentacion', 'estructura', 'instalaciones', 'acabados', 'entrega'].includes(dto.phase)) {
    res.status(400).json({ error: 'Bad Request', message: 'phase debe ser cimentacion|estructura|instalaciones|acabados|entrega' });
    return;
  }
  if (typeof dto.budget !== 'number' || dto.budget <= 0) {
    res.status(400).json({ error: 'Bad Request', message: 'budget debe ser un número positivo' });
    return;
  }
  if (!dto.contractor || typeof dto.contractor !== 'string') {
    res.status(400).json({ error: 'Bad Request', message: 'contractor es obligatorio' });
    return;
  }
  if (typeof dto.progress !== 'number' || dto.progress < 0 || dto.progress > 100) {
    res.status(400).json({ error: 'Bad Request', message: 'progress debe estar entre 0 y 100' });
    return;
  }

  const nuevo = store.create({
    name: dto.name,
    type: dto.type,
    phase: dto.phase,
    budget: dto.budget,
    contractor: dto.contractor,
    progress: dto.progress,
    active: dto.active ?? true,
  });
  res.status(201).json({ data: nuevo });
});

proyectosRouter.put('/:id', (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ error: 'Bad Request', message: 'id inválido' });
    return;
  }
  const dto = req.body as UpdateProyectoDto;
  const actualizado = store.update(id, dto);
  if (!actualizado) {
    res.status(404).json({ error: 'Not Found', message: `Proyecto ${id} no existe` });
    return;
  }
  res.json({ data: actualizado });
});

proyectosRouter.delete('/:id', (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ error: 'Bad Request', message: 'id inválido' });
    return;
  }
  const ok = store.remove(id);
  if (!ok) {
    res.status(404).json({ error: 'Not Found', message: `Proyecto ${id} no existe` });
    return;
  }
  res.status(204).send();
});
