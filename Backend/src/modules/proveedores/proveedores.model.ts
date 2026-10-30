import mongoose, { Model, Schema } from "mongoose";
import { IProveedor } from "./type.proveedores";


const ProveedorSchema = new Schema<IProveedor>({
  date: { type: String, required: false },
  proveedores: { type: String, required: true },
  marcas: { type: String, required: true },
  mascotas: { type: String, required: true },
  edades: { type: String, required: true },
  kilos: { type: String, required: true },
  precios: { type: Number, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true }
}, { timestamps: true });

export const ProveedorModel: Model<IProveedor> = mongoose.model<IProveedor>('Proveedor', ProveedorSchema, 'proveedors');