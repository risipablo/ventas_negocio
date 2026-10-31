import mongoose, { Schema, Document, Types } from "mongoose";

export interface IArchivo extends Document {
  nombreOriginal: string;
  nombreGuardado: string;
  ruta: string;
  tipo: string;
  tamaño: number;
  userId: Types.ObjectId;
  createdAt: Date;
}

const ArchivoSchema = new Schema<IArchivo>({
  nombreOriginal: { type: String, required: true },
  nombreGuardado: { type: String, required: true },
  ruta: { type: String, required: true },
  tipo: { type: String, required: true },
  tamaño: { type: Number, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true }
}, { timestamps: true });

export const ArchivoModel = mongoose.model<IArchivo>('Archivo', ArchivoSchema, 'archivos');