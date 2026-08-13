export type UnidadMedida = 'kg' | 'm3' | 'unidad' | 'm2' | 'ml';

export interface Material {
  id: number;
  nombre: string;
  unidad: UnidadMedida;
  precioUnidad: number;
  stock: number;
}

export interface MaterialConTotal extends Material {
  valorTotal: number;
}
