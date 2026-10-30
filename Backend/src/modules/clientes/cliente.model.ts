import mongoose, { Model, Schema } from "mongoose";
import { ICliente, IClienteItem } from "./type.clientes";


const ClienteItemSchema = new Schema<IClienteItem>({
  fecha: { type: Date, required: true },
  producto: { type: String, required: true },
  precio: { type: Number, required: true, min: 0 },
}, { _id: true });

const ClienteSchema = new Schema<ICliente>({
  cliente: { type: String, required: true },
  fecha: { type: Date, required: true, default: Date.now },
  producto: { type: String, required: true },
  precio: { type: Number, required: true, min: 0 },
  items: { type: [ClienteItemSchema], default: [] },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true }
}, { timestamps: true });

export const ClienteModel: Model<ICliente> = mongoose.model<ICliente>('Cliente', ClienteSchema, 'clientes');