# API REST — Proyectos de Construcción (Constructora)

Entrega para **bc-expressjs, semana 02**.

- Aprendiz: SANTIAGO SALAMANCA NARVÀEZ (ID 3228973A)
- Email: santicosalamanca@gmail.com
- Dominio asignado: **Constructora**
- Recurso: `Proyecto` (obra de construcción)

## Cómo correr

```bash
pnpm install
pnpm dev       # servidor con watch en http://localhost:3000
pnpm build     # verifica TypeScript estricto
```

## Endpoints

| Método | Ruta | Descripción | Status |
|--------|------|-------------|--------|
| GET | `/health` | Health check | 200 |
| GET | `/api/v1/proyectos` | Lista todos los proyectos | 200 |
| GET | `/api/v1/proyectos/:id` | Obtiene un proyecto por id | 200 / 404 |
| POST | `/api/v1/proyectos` | Crea un proyecto | 201 / 400 |
| PUT | `/api/v1/proyectos/:id` | Actualiza un proyecto | 200 / 404 |
| DELETE | `/api/v1/proyectos/:id` | Elimina un proyecto | 204 / 404 |

## Middlewares incluidos

- `express.json()` — parseo del body
- Logger inline (método + URL + status + duración)
- 404 handler para rutas no encontradas
- Error handler global de 4 parámetros

## Estructura

```
starter/
├── .env.example
├── .gitignore
├── README.md
├── package.json
├── tsconfig.json
└── src/
    ├── app.ts
    ├── server.ts
    ├── types.ts
    ├── store.ts
    └── routes/
        └── proyectos.routes.ts
```

## Pruebas rápidas con curl

```bash
# Listar
curl http://localhost:3000/api/v1/proyectos

# Obtener uno
curl http://localhost:3000/api/v1/proyectos/1

# Crear
curl -X POST http://localhost:3000/api/v1/proyectos \
  -H "Content-Type: application/json" \
  -d '{"name":"Casa Campestre La Esperanza","type":"casa","phase":"cimentacion","budget":350000000,"contractor":"Obras Salamanca SAS","progress":10,"active":true}'

# Actualizar
curl -X PUT http://localhost:3000/api/v1/proyectos/1 \
  -H "Content-Type: application/json" \
  -d '{"progress":60,"phase":"acabados"}'

# Eliminar
curl -X DELETE http://localhost:3000/api/v1/proyectos/1
# -> 204 sin body
```
