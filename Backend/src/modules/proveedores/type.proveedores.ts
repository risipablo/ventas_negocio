import { Document, Types } from "mongoose";

export interface IProveedor extends Document {
  date?: string;
  proveedores: string;
  marcas: string;
  mascotas: string;
  edades: string;
  kilos: string;
  precios: number;
  userId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}