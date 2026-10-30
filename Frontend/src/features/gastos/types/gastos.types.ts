export type EstadoGasto = 'pagado' | 'impago' | 'nota de credito';

export interface IGasto {
  _id?: string;
  proveedor: string;
  fecha: string;
  numeroBoleta: string;
  monto: number;
  estado: EstadoGasto;
  fechaPago?: string | null;
  createdAt?: string;
  updatedAt?: string;
}