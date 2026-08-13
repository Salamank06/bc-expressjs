# Proyecto Semana 1 — Procesador de obras (Constructora)

Procesador de datos que lee un archivo con proyectos y contratistas, los cruza y produce un reporte con totales por fase y por contratista. Simula el ciclo I/O asíncrono de Node.js (read → process → write).

## Cómo correrlo

```bash
cd bootcamp/week-01-nodejs_fundamentals/3-proyecto/starter
npm install
npm run dev
```

## Archivos

- `src/index.ts` — entry point (orquesta read → process → write)
- `src/reader.ts` — lee `data/obras.json`
- `src/processor.ts` — cruza proyectos y contratistas, calcula totales
- `src/writer.ts` — escribe el reporte en `data/reporte.json`
- `src/types.ts` — tipos del dominio
- `data/obras.json` — dataset de seed
