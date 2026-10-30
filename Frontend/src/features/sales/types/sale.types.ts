import React from 'react';

export type PaymentMethod =
  | 'efectivo'
  | 'debito'
  | 'credito'
  | 'mercado pago'
  | 'qr';

export type CardBrand = 'visa' | 'master' | 'naranja' | 'cabal' | 'otra' | 'transferencia';

export interface SaleItem {
  product?: string;
  name: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Sale {
  _id: string;
  date: string;
  items: SaleItem[];
  paymentMethod: PaymentMethod;
  cardBrand?: CardBrand;
  couponNumber?: string;
  numberTarget?: string;
  total: number;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSalePayload {
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

export type UpdateSalePayload = Partial<CreateSalePayload>;

export interface SaleMasterProps {
  sales: Sale[];
  filterSales: Sale[];
  setFileterSales: React.Dispatch<React.SetStateAction<Sale[]>>;
  loading: boolean;
  error: string | null;
  onEdit: (sale: Sale) => void;
  onDelete: (id: string) => void;
  onCreate: () => void;
}