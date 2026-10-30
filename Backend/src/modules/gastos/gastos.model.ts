import mongoose, { Model, Schema } from "mongoose";
import { IGasto } from "./gastos.types";


const GastoSchema = new Schema<IGasto>({
  proveedor: { type: String, required: true },
  fecha: { type: Date, required: true },
  numeroBoleta: { type: String, required: true },
  monto: { type: Number, required: true, min: 0 },
  estado: { 
    type: String, 
    enum: ['pagado', 'impago', 'nota de credito'], 
    required: true,
    default: 'impago'
  },
  fechaPago: { type: Date, default: null },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true }
}, { timestamps: true });

export const GastoModel: Model<IGasto> = mongoose.model<IGasto>('Gasto', GastoSchema, 'gastos');