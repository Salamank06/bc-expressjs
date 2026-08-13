# API REST — PostgreSQL + Prisma ORM (Constructora)

Entrega para **bc-expressjs, semana 05**.

- Aprendiz: SANTIAGO SALAMANCA NARVÀEZ (ID 3228973A)
- Email: santicosalamanca@gmail.com
- Dominio asignado: **Constructora**
- Recurso principal: `Proyecto` (la obra de construcción) — 9 campos
- Recurso secundario: `Avance` (hito/parcial de fase de la obra) — relación 1:N con `Proyecto`

## Stack

- PostgreSQL 16 (Alpine) vía Docker
- Prisma ORM 6.x con migraciones versionadas
- Singleton de Prisma Client en `src/lib/prisma.ts`
- Express 5 + Zod 4 (validación) + Winston + Morgan (logging)
- AppError + errorHandler central (reusado de semana 04)
- Manejo específico de errores Prisma: `P2025` → 404, `P2002` → 409

## Modelo de dominio

```
Proyecto (1) ─── (N) Avance

Proyecto:
  id            Int      @id @default(autoincrement())
  name          String   @unique       (cada obra tiene nombre único)
  type          TipoObra              (casa | edificio | local | bodega)
  phase         FaseObra              (cimentacion | estructura | instalaciones | acabados | entrega)
  budget        Int                   (COP, > 0)
  contractor    String
  progress      Int                   (0..100)
  active        Boolean  @default(true)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  avances       Avance[]

Avance:
  id            Int      @id @default(autoincrement())
  date          DateTime
  phase         FaseObra              (fase en la que se hizo el avance)
  percentage    Int                   (0..100, % de progreso acumulado)
  note          String                (nota libre)
  proyectoId    Int                   (FK → Proyecto.id, ON DELETE CASCADE)
  proyecto      Proyecto              @relation(fields: [proyectoId], references: [id])
  createdAt     DateTime @default(now())
```

## Estructura del starter

```
starter/
├── .env.example
├── .gitignore
├── README.md
├── docker-compose.yml
├── package.json
├── tsconfig.json
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts
│   └── migrations/                    (versionadas, NO en .gitignore)
└── src/
    ├── app.ts
    ├── server.ts
    ├── types.ts
    ├── config/logger.ts               # Winston + morganMiddleware
    ├── errors/AppError.ts
    ├── lib/prisma.ts                  # Singleton de Prisma Client
    ├── middlewares/errorHandler.ts    # 4-param, distingue ZodError / AppError / Prisma errors
    ├── middlewares/notFound.ts
    ├── schemas/proyecto.schema.ts     # Zod create/update/id
    ├── repositories/proyectos.repository.ts  # CRUD con Prisma + errores P2025/P2002
    ├── services/proyectos.service.ts
    ├── controllers/proyectos.controller.ts
    └── routes/proyectos.routes.ts
```

## Endpoints

| Método | Ruta | Status | Descripción |
|---|---|---|---|
| GET | `/health` | 200 | Health check (incluye `db: 'ok'`) |
| GET | `/api/v1/proyectos` | 200 | Lista paginada (`?page&limit`) |
| GET | `/api/v1/proyectos/:id` | 200 / 404 | Detalle con `avances` (include) |
| POST | `/api/v1/proyectos` | 201 / 400 / 409 | Crea (valida Zod, unique en name) |
| PUT | `/api/v1/proyectos/:id` | 200 / 404 | Actualización parcial |
| DELETE | `/api/v1/proyectos/:id` | 204 / 404 | Elimina (cascade de avances) |

## Cómo correr

```bash
# 1. Levantar PostgreSQL en Docker (espera a que el healthcheck pase)
pnpm db:up

# 2. Instalar dependencias
pnpm install

# 3. Generar Prisma Client (ya lo hace `prisma migrate dev` también)
pnpm prisma:generate

# 4. Aplicar la migración init
pnpm prisma:migrate

# 5. Sembrar datos demo (idempotente)
pnpm prisma:seed

# 6. Arrancar la API
pnpm dev

# 7. Cuando termines, bajar el contenedor
pnpm db:down
```

## Pruebas con curl

```bash
# Health
curl http://localhost:3000/health

# Listado paginado
curl "http://localhost:3000/api/v1/proyectos?page=1&limit=5"

# Detalle con avances
curl http://localhost:3000/api/v1/proyectos/1

# Crear
curl -X POST http://localhost:3000/api/v1/proyectos \
  -H "Content-Type: application/json" \
  -d '{"name":"Casa Vereda Norte","type":"casa","phase":"cimentacion","budget":280000000,"contractor":"Obras Salamanca SAS","progress":15,"active":true}'

# Crear con nombre duplicado → 409 (P2002)
curl -X POST http://localhost:3000/api/v1/proyectos \
  -H "Content-Type: application/json" \
  -d '{"name":"Casa Vereda Norte","type":"casa","phase":"cimentacion","budget":1,"contractor":"X","progress":0}'

# Crear con body inválido → 400 (Zod)
curl -X POST http://localhost:3000/api/v1/proyectos \
  -H "Content-Type: application/json" \
  -d '{"budget":-5}'

# Actualizar parcial
curl -X PUT http://localhost:3000/api/v1/proyectos/1 \
  -H "Content-Type: application/json" \
  -d '{"progress":80,"phase":"acabados"}'

# Eliminar (cascadea avances)
curl -i -X DELETE http://localhost:3000/api/v1/proyectos/1
```

## Tipos derivados de Prisma

```ts
import type { Proyecto, Avance, TipoObra, FaseObra } from '@prisma/client';
```

**No se duplican interfaces**: el repository importa `Prisma.ProyectoCreateInput`, `Prisma.ProyectoUpdateInput`, `Prisma.ProyectoWhereUniqueInput` directamente.
