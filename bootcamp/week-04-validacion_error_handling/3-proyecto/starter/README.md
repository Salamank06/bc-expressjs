# API REST — Validación, Errores y Logging (Constructora)

Entrega para **bc-expressjs, semana 04**.

- Aprendiz: SANTIAGO SALAMANCA NARVÀEZ (ID 3228973A)
- Email: santicosalamanca@gmail.com
- Dominio asignado: **Constructora**
- Recurso: `Obra` (obra de construcción) — renombrado desde `Item` genérico.

## Stack

- Express 5
- Zod 4 para validación de entrada (`safeParse`, `z.infer`, `.partial()`)
- Clase `AppError` con `statusCode` + `isOperational` para errores del dominio
- Middleware global `errorHandler` (4 parámetros) que distingue `ZodError`, `AppError` y errores genéricos
- Middleware `notFound` registrado antes del `errorHandler`
- Winston + Morgan para logging profesional (colorizado en dev, JSON + archivo `logs/error.log` en prod)

## Cómo correr

```bash
pnpm install
pnpm dev       # http://localhost:3000
pnpm build     # tsc strict, 0 errores esperados
```

## Estructura

```
starter/
├── .env.example
├── .gitignore
├── README.md
├── package.json
├── tsconfig.json
└── src/
    ├── app.ts                        # setup Express + orden de middlewares
    ├── server.ts                     # bootstrap con logger.info
    ├── types.ts                      # Obra, SingleResponse, PaginatedResponse, ErrorResponse
    ├── config/
    │   └── logger.ts                 # Winston + morganMiddleware
    ├── errors/
    │   └── AppError.ts               # clase AppError + isAppError helper
    ├── middlewares/
    │   ├── errorHandler.ts           # 4-param, distingue ZodError / AppError / Error
    │   └── notFound.ts               # lanza AppError(404)
    ├── schemas/
    │   └── obra.schema.ts            # createObraSchema + updateObraSchema.partial()
    ├── repositories/
    │   └── obras.repository.ts       # CRUD async en memoria
    ├── services/
    │   └── obras.service.ts          # lógica + AppError 404/409
    ├── controllers/
    │   └── obras.controller.ts       # thin: safeParse + next(err)
    └── routes/
        └── obras.routes.ts           # 5 endpoints CRUD
```

## Endpoints

| Método | Ruta | Status | Descripción |
|--------|------|--------|-------------|
| GET    | `/health` | 200 | Health check |
| GET    | `/api/v1/obras` | 200 | Lista paginada (`?page&limit`) |
| GET    | `/api/v1/obras/:id` | 200 / 400 / 404 | Obra por id |
| POST   | `/api/v1/obras` | 201 / 400 | Crea una obra validada con Zod |
| PUT    | `/api/v1/obras/:id` | 200 / 400 / 404 | Actualiza una obra (campos parciales) |
| DELETE | `/api/v1/obras/:id` | 204 / 400 / 404 | Elimina una obra |

## Campos del schema `createObraSchema`

| Campo | Tipo | Validación |
|---|---|---|
| `name` | string | requerido, min 3, max 120, trim |
| `type` | enum | requerido, `casa` \| `edificio` \| `local` \| `bodega` |
| `phase` | enum | requerido, `cimentacion` \| `estructura` \| `instalaciones` \| `acabados` \| `entrega` |
| `budget` | number | requerido, entero, > 0, max 100_000_000_000 |
| `contractor` | string | requerido, min 3, max 120, trim |
| `progress` | number | requerido, 0..100, default 0 |
| `active` | boolean | opcional, default `true` |

`updateObraSchema` es `createObraSchema.partial()` — todos los campos opcionales.

`idSchema` (`z.coerce.number().int().positive()`) valida el parámetro `:id` y devuelve 400 si no es numérico.

## Pruebas con curl

```bash
# Health
curl http://localhost:3000/health

# Lista paginada
curl "http://localhost:3000/api/v1/obras?page=1&limit=5"

# POST válido
curl -X POST http://localhost:3000/api/v1/obras \
  -H "Content-Type: application/json" \
  -d '{"name":"Casa Vereda Norte","type":"casa","phase":"cimentacion","budget":280000000,"contractor":"Obras Salamanca SAS","progress":15,"active":true}'

# POST inválido → 400 con issues
curl -X POST http://localhost:3000/api/v1/obras \
  -H "Content-Type: application/json" \
  -d '{"budget":-5}'

# GET con id no numérico → 400
curl -i http://localhost:3000/api/v1/obras/abc

# GET con id inexistente → 404
curl -i http://localhost:3000/api/v1/obras/9999

# Ruta inexistente → 404 JSON (no HTML)
curl -i http://localhost:3000/api/v1/no-existe

# PUT parcial
curl -X PUT http://localhost:3000/api/v1/obras/1 \
  -H "Content-Type: application/json" \
  -d '{"progress":80,"phase":"acabados"}'

# DELETE
curl -i -X DELETE http://localhost:3000/api/v1/obras/1
```
