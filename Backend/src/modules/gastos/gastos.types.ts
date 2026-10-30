import { Document, Types } from "mongoose";

export type EstadoGasto = 'pagado' | 'impago' | 'nota de credito';

export interface IGasto extends Document {
  proveedor: string;
  fecha: Date;
  numeroBoleta: string;
  monto: number;
  estado: EstadoGasto;
  fechaPago?: Date | null;
  userId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}