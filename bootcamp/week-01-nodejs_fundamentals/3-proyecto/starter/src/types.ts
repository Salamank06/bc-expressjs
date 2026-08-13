export type TipoObra = 'casa' | 'edificio' | 'local' | 'bodega';
export type FaseObra = 'cimentacion' | 'estructura' | 'instalaciones' | 'acabados' | 'entrega';

export interface Proyecto {
  id: number;
  name: string;
  type: TipoObra;
  phase: FaseObra;
  budget: number;
  contractor: string;
  progress: number;
  active: boolean;
}

export interface Summary {
  total: number;
  active: number;
  inactive: number;
  totalBudget: number;
  lowestProgressProject: Proyecto | null;
}

export interface Report {
  summary: Summary;
  lowProgressAlerts: Proyecto[];
}
