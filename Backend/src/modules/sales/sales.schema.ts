import { Schema, Types } from 'mongoose';

export type PaymentMethod =
  | 'efectivo'
  | 'debito'
  | 'credito'
  | 'mercado pago'
  | 'qr';

export type CardBrand = 'visa' | 'master' | 'naranja' | 'cabal' | 'otra' | 'transferencia';

export interface ISaleItem {
  product?: Types.ObjectId;
  name: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export const SaleItemSchema = new Schema<ISaleItem>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: false,
    },
    name: {
      type: String,
      required: [true, 'El nombre del producto es obligatorio'],
      trim: true,
    },
    quantity: {
      type: Number,
      required: [true, 'La cantidad es obligatoria'],
      min: [1, 'La cantidad mínima es 1'],
    },
    unitPrice: {
      type: Number,
      required: [true, 'El precio unitario es obligatorio'],
      min: [0, 'El precio no puede ser negativo'],
    },
    subtotal: {
      type: Number,
      required: [true, 'El subtotal es obligatorio'],
      min: [0, 'El subtotal no puede ser negativo'],
    },
  },
  { _id: false }
);

export interface CreateSaleBody {
  date?: string;
  items: Array<{
    product?: string;
    name: string;
    quantity: number;
    unitPrice: number;
  }>;
  paymentMethod: PaymentMethod;
  cardBrand?: CardBrand;
  couponNumber?: string;
  numberTarget?: string;
}

export interface ISale {
  date: Date;
  items: ISaleItem[];
  paymentMethod: PaymentMethod;
  cardBrand?: CardBrand;
  couponNumber?: string;
  numberTarget?: string;
  total: number;
  createdBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export const SaleSchema = new Schema<ISale>(
  {
    date: {
      type: Date,
      required: [true, 'La fecha es obligatoria'],
      default: Date.now,
    },
    items: {
      type: [SaleItemSchema],
      required: true,
      validate: {
        validator: (v: ISaleItem[]) => Array.isArray(v) && v.length > 0,
        message: 'La venta debe tener al menos un producto',
      },
    },
    paymentMethod: {
      type: String,
      enum: ['efectivo', 'debito', 'credito', 'mercado pago', 'qr'],
      required: [true, 'El método de pago es obligatorio'],
    },
    cardBrand: {
      type: String,
      enum: ['visa', 'master', 'naranja', 'cabal', 'otra','transferencia'],
      required: function (this: ISale) {
        return (
          this.paymentMethod === 'debito' ||
          this.paymentMethod === 'credito'
        );
      },
    },
    couponNumber: {
      type: String,
      trim: true,
      required: function (this: ISale) {
        return (
          this.paymentMethod === 'debito' ||
          this.paymentMethod === 'credito' ||
          this.paymentMethod === 'qr'
        );
      },
    },
    numberTarget: {
      type: String,
      trim: true,
      required: function (this: ISale) {
        return (
          this.paymentMethod === 'debito' ||
          this.paymentMethod === 'credito'
        );
      },
    },
    total: {
      type: Number,
      required: [true, 'El total es obligatorio'],
      min: [0, 'El total no puede ser negativo'],
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

SaleSchema.index({ date: -1 });
SaleSchema.index({ paymentMethod: 1, date: -1 });
SaleSchema.index({ 'items.product': 1 });