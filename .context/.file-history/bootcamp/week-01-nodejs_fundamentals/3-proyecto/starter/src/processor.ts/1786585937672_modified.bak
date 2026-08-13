import { Obra, Contratista, Reporte, FaseObra } from './types';

export function generarReporte(obras: Obra[], contratistas: Contratista[]): Reporte {
  const porFase: Record<FaseObra, number> = {
    cimentacion: 0,
    estructura: 0,
    instalaciones: 0,
    acabados: 0,
    entrega: 0,
  };

  let presupuestoTotal = 0;
  for (const o of obras) {
    presupuestoTotal += o.presupuesto;
    porFase[o.fase] += 1;
  }

  const porContratista = contratistas.map((c) => {
    const obrasAsignadas = obras.filter((o) => o.contratistaId === c.id);
    const presupuestoAsignado = obrasAsignadas.reduce((acc, o) => acc + o.presupuesto, 0);
    return {
      contratistaId: c.id,
      nombre: c.nombre,
      especialidad: c.especialidad,
      obrasAsignadas: obrasAsignadas.length,
      presupuestoAsignado,
    };
  });

  return {
    generadoEn: new Date().toISOString(),
    totalObras: obras.length,
    presupuestoTotal,
    porFase,
    porContratista,
  };
}
