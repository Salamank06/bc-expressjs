export type FaseObra = 'cimentacion' | 'estructura' | 'instalaciones' | 'acabados' | 'entrega';

export type TipoObra = 'casa' | 'edificio' | 'local' | 'bodega';

export interface Proyecto {
  id: number;
  nombre: string;
  tipo: TipoObra;
  contratista: string;
  presupuesto: number;
  fase: FaseObra;
  activo: boolean;
}
