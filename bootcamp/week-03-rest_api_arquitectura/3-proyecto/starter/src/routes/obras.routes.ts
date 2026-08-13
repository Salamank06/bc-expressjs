import { Router } from 'express';
import * as controller from '../controllers/obras.controller.js';

export const obrasRouter = Router();

obrasRouter.get('/', controller.getAll);
obrasRouter.get('/:id', controller.getById);
obrasRouter.post('/', controller.create);
obrasRouter.put('/:id', controller.update);
obrasRouter.delete('/:id', controller.remove);
