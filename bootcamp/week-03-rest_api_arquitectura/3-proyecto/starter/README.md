# API REST en 4 capas — Obras de Construcción (Constructora)

Entrega para **bc-expressjs, semana 03**.

- Aprendiz: SANTIAGO SALAMANCA NARVÀEZ (ID 3228973A)
- Email: santicosalamanca@gmail.com
- Dominio asignado: **Constructora**
- Recurso: `Obra` (obra de construcción) — equivalente al `item` genérico del starter, renombrado y adaptado.

## Cómo correr

```bash
pnpm install
pnpm dev       # arranca en http://localhost:3000
pnpm build     # verifica TypeScript estricto
```

## Arquitectura (4 capas)

```
src/
├── app.ts                       # Configuración Express
├── server.ts                    # Entry point
├── types.ts                     # Obra, CreateObraDto, UpdateObraDto, contratos
├── routes/
│   └── obras.routes.ts          # Mapeo URL → controller
├── controllers/
│   └── obras.controller.ts      # Thin: extraer → llamar service → responder
├── services/
│   └── obras.service.ts         # Lógica de negocio + paginación
└── repositories/
    └── obras.repository.ts      # Único acceso al store (async + copia defensiva)
```

## Endpoints

| Método | Ruta | Status | Descripción |
|--------|------|--------|-------------|
| GET    | `/health` | 200 | Health check |
| GET    | `/api/v1/obras` | 200 | Lista paginada (`?page&limit`) |
| GET    | `/api/v1/obras/:id` | 200 / 404 | Obra por id |
| POST   | `/api/v1/obras` | 201 / 400 | Crea una obra |
| PUT    | `/api/v1/obras/:id` | 200 / 404 | Actualiza una obra |
| DELETE | `/api/v1/obras/:id` | 204 / 404 | Elimina una obra |

## Contratos de respuesta

```jsonc
// Listado paginado
{ "data": [...], "total": 6, "page": 1, "limit": 10 }

// Recurso individual
{ "data": { "id": 1, ... } }

// Error
{ "error": "Not Found", "message": "Obra 999 no existe" }
```

## Pruebas con curl

```bash
# Listar paginado
curl "http://localhost:3000/api/v1/obras?page=1&limit=5"

# Obtener una
curl http://localhost:3000/api/v1/obras/1

# Crear
curl -X POST http://localhost:3000/api/v1/obras \
  -H "Content-Type: application/json" \
  -d '{"name":"Casa Vereda Norte","type":"casa","phase":"cimentacion","budget":280000000,"contractor":"Obras Salamanca SAS","progress":15,"active":true}'

# Actualizar
curl -X PUT http://localhost:3000/api/v1/obras/1 \
  -H "Content-Type: application/json" \
  -d '{"progress":80,"phase":"acabados"}'

# Eliminar
curl -X DELETE http://localhost:3000/api/v1/obras/1
```
