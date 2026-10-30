import mongoose, { Schema, Document, Types } from "mongoose";

export interface ICarritoItem {
  productoId: string;
  nombre: string;
  cantidad: number;
  precio: number;
}

export interface ICarritoGuardado extends Document {
  titulo: string;
  items: ICarritoItem[];
  total: number;
  marcado: boolean;
  userId: Types.ObjectId;
  createdAt: Date;
}

const CarritoItemSchema = new Schema<ICarritoItem>({
  productoId: { type: String, required: true },
  nombre: { type: String, required: true },
  cantidad: { type: Number, required: true },
  precio: { type: Number, required: true },
}, { _id: false });

const CarritoGuardadoSchema = new Schema<ICarritoGuardado>({
  titulo: { type: String, required: true },
  items: { type: [CarritoItemSchema], required: true },
  total: { type: Number, required: true },
  marcado: { type: Boolean, default: false },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true }
}, { timestamps: true });

export const CarritoGuardadoModel = mongoose.model<ICarritoGuardado>('CarritoGuardado', CarritoGuardadoSchema, 'carritos_guardados');