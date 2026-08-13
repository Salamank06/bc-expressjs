export type TipoObra = 'casa' | 'edificio' | 'local' | 'bodega';
export type FaseObra = 'cimentacion' | 'estructura' | 'instalaciones' | 'acabados' | 'entrega';

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
  stack?: string;
}

export interface ValidationErrorResponse {
  error: string;
  message: string;
  issues: Array<{ field: string; message: string }>;
}
