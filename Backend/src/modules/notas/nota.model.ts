import mongoose, { Model, Schema } from "mongoose";
import { INota } from "./nota.type";


const NotaSchema = new Schema<INota>({
  fecha: { type: Date, required: true, default: Date.now },
  titulo: { type: String, required: true },
  descripcion: { type: String, required: true },
  realizado: { type: Boolean, default: false },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true }
}, { timestamps: true });

export const NotaModel: Model<INota> = mongoose.model<INota>('Nota', NotaSchema, 'notas');