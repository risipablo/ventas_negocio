import { Document, Types } from "mongoose";

export interface INota extends Document {
  fecha: Date;
  titulo: string;
  descripcion: string;
  realizado: boolean;
  userId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}