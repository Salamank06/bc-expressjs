# Catálogo de Proyectos de Construcción con Reporte de Presupuesto — Constructora

Entrega para **bc-expressjs, semana 01**.

- Aprendiz: SANTIAGO SALAMANCA NARVÀEZ (ID 3228973A)
- Email: santicosalamanca@gmail.com
- Dominio asignado: **Constructora**
- Recurso: `Proyecto` (`name`, `type`, `phase`, `budget`, `contractor`, `progress`, `active`)

## Cómo correr

```bash
pnpm install
pnpm dev               # resumen + proyectos con avance bajo (umbral 40)
pnpm dev -- --umbral 25 # con umbral propio
pnpm build             # verifica TypeScript estricto
```

Genera `output/report.json` con el resumen del catálogo y la lista de proyectos con avance bajo.

## Estructura

```
starter/
├── README.md
├── package.json
├── tsconfig.json
├── .gitignore
├── data/
│   └── proyectos.json          # 9 proyectos de la constructora
├── src/
│   ├── index.ts                # CLI con parseUmbral + orquesta
│   ├── reader.ts               # lee data/proyectos.json
│   ├── processor.ts            # summarize + findLowProgress
│   ├── writer.ts               # escribe output/report.json
│   └── types.ts                # Proyecto, Summary, Report
└── output/
    └── report.json             # generado al ejecutar `pnpm dev`
```
