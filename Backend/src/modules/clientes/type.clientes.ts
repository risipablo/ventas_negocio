import { Document, Types } from "mongoose";

export interface IClienteItem {
  fecha: Date;
  producto: string;
  precio: number;
}

export interface ICliente extends Document {
  cliente: string;
  fecha: Date;
  producto: string;
  precio: number;
  items: IClienteItem[];
  userId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}