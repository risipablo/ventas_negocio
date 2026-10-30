import mongoose, { Model, Schema } from "mongoose";
import { IList } from "./list.type";

const ListSchema = new Schema<IList>({
    marca: {
        type: String,
        required: true
    },
    mascota: {
        type: String,
        required: true
    },
    edad: {
        type: String,
        required: true
    },
    kilo: {
        type: String,
        required: true
    },
    condicion: {
        type: String,
        required: false 
    },
    precio: {
        type: String,
        required: true
    },
    categoria: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    }
}, {
    timestamps: true
});

export const ListModel: Model<IList> = mongoose.model<IList>('List', ListSchema, 'list');