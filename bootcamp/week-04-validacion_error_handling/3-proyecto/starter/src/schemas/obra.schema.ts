import { z } from 'zod';

export const TIPOS_OBRA = ['casa', 'edificio', 'local', 'bodega'] as const;
export const FASES_OBRA = [
  'cimentacion',
  'estructura',
  'instalaciones',
  'acabados',
  'entrega',
] as const;

export const createObraSchema = z.object({
  name: z
    .string({ message: 'name es obligatorio' })
    .min(3, 'name debe tener al menos 3 caracteres')
    .max(120, 'name debe tener máximo 120 caracteres')
    .trim(),
  type: z.enum(TIPOS_OBRA, { message: 'type debe ser casa|edificio|local|bodega' }),
  phase: z.enum(FASES_OBRA, {
    message: 'phase debe ser cimentacion|estructura|instalaciones|acabados|entrega',
  }),
  budget: z
    .number({ message: 'budget es obligatorio' })
    .int('budget debe ser entero')
    .positive('budget debe ser mayor a 0')
    .max(100_000_000_000, 'budget excede el máximo permitido'),
  contractor: z
    .string({ message: 'contractor es obligatorio' })
    .min(3, 'contractor debe tener al menos 3 caracteres')
    .max(120, 'contractor debe tener máximo 120 caracteres')
    .trim(),
  progress: z
    .number({ message: 'progress es obligatorio' })
    .int('progress debe ser entero')
    .min(0, 'progress no puede ser negativo')
    .max(100, 'progress no puede superar 100')
    .default(0),
  active: z.boolean().default(true),
});

export const updateObraSchema = createObraSchema.partial();

export const idSchema = z.coerce
  .number({ message: 'id debe ser numérico' })
  .int('id debe ser entero')
  .positive('id debe ser positivo');

export type CreateObraDto = z.infer<typeof createObraSchema>;
export type UpdateObraDto = z.infer<typeof updateObraSchema>;
