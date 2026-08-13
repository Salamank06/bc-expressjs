# Ejercicio 01 — Hello Node.js + TypeScript (Constructora)

Script Node.js que lee un archivo JSON con datos de **proyectos de construcción** y muestra un resumen por consola.

## Dominio

Constructora: lista de proyectos con nombre, tipo (casa/edificio/local/bodega), contratista responsable, presupuesto y fase actual.

## Cómo correrlo

```bash
cd bootcamp/week-01-nodejs_fundamentals/2-practicas/ejercicio-01-hello-node/starter
npm install
npm run dev
```

## Archivos clave

- `src/index.ts` — entry point
- `src/reader.ts` — lee `data/proyectos.json`
- `src/processor.ts` — calcula totales y resumen
- `src/types.ts` — tipos TypeScript del dominio
- `data/proyectos.json` — dataset de seed
