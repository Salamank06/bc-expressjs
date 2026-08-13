export type FaseObra = 'cimentacion' | 'estructura' | 'instalaciones' | 'acabados' | 'entrega';

export interface Obra {
  id: number;
  nombre: string;
  fase: FaseObra;
  presupuesto: number;
  contratistaId: number;
}

export interface Contratista {
  id: number;
  nombre: string;
  especialidad: 'albañileria' | 'electricidad' | 'plomeria' | 'pintura' | 'carpinteria' | 'soldadura';
}

export interface Reporte {
  generadoEn: string;
  totalObras: number;
  presupuestoTotal: number;
  porFase: Record<FaseObra, number>;
  porContratista: Array<{
    contratistaId: number;
    nombre: string;
    especialidad: string;
    obrasAsignadas: number;
    presupuestoAsignado: number;
  }>;
}
