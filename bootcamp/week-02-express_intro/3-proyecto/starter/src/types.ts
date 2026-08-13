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

export type CreateProyectoDto = Omit<Proyecto, 'id'>;

export type UpdateProyectoDto = Partial<CreateProyectoDto>;
