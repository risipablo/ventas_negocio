import { Document, Types } from "mongoose";

export interface IList extends Document {
    marca: string;
    mascota: string;
    edad: string;
    kilo: string;
    condicion: string; 
    precio: string;
    categoria: string;
    userId: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}