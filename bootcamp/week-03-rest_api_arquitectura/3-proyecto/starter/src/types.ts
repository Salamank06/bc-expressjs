export type TipoObra = 'casa' | 'edificio' | 'local' | 'bodega';
export type FaseObra = 'cimentacion' | 'estructura' | 'instalaciones' | 'acabados' | 'entrega';

export interface Obra {
  id: number;
  name: string;
  type: TipoObra;
  phase: FaseObra;
  budget: number;
  contractor: string;
  progress: number;
  active: boolean;
  createdAt: string;
}

export type CreateObraDto = Omit<Obra, 'id' | 'createdAt'>;

export type UpdateObraDto = Partial<CreateObraDto>;

export interface SingleResponse<T> {
  data: T;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface ErrorResponse {
  error: string;
  message: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
}
