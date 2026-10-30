import { z } from 'zod';

export const saleItemSchema = z.object({
  product: z.string().regex(/^[a-f\d]{24}$/i).optional(),
  name: z.string().min(1, 'El nombre es obligatorio'),
  quantity: z.number().int().min(1, 'La cantidad mínima es 1'),
  unitPrice: z.number().min(0, 'El precio no puede ser negativo'),
});

export const saleSchema = z
  .object({
    date: z.coerce.date().optional(),
    items: z.array(saleItemSchema).min(1, 'Debe haber al menos un producto'),
    paymentMethod: z.enum([
      'efectivo',
      'debito',
      'credito',
      'mercado pago',
      'qr',
    ]),
    cardBrand: z
      .enum(['visa', 'master', 'naranja', 'cabal', 'otra', 'transferencia'])
      .optional(),
    couponNumber: z.string().trim().optional(),
    numberTarget: z.string().trim().optional(),
  })
  .superRefine((data, ctx) => {
    const isCard =
      data.paymentMethod === 'debito' || data.paymentMethod === 'credito';
    const isQr = data.paymentMethod === 'qr';

    if (isCard && !data.cardBrand) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['cardBrand'],
        message: 'La marca de tarjeta es obligatoria para débito/crédito',
      });
    }

    if (isCard && !data.numberTarget) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['numberTarget'],
        message: 'El número de tarjeta es obligatorio para débito/crédito',
      });
    }

    if ((isCard || isQr) && !data.couponNumber) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['couponNumber'],
        message: 'El número de cupón es obligatorio para tarjetas y QR',
      });
    }
  });

export const updateSaleSchema = z.object({
  date: z.coerce.date().optional(),
  items: z.array(saleItemSchema).min(1).optional(),
  paymentMethod: z
    .enum(['efectivo', 'debito', 'credito', 'mercado pago', 'qr'])
    .optional(),
  cardBrand: z
    .enum(['visa', 'master', 'naranja', 'cabal', 'otra', 'transferencia'])
    .optional(),
  couponNumber: z.string().trim().optional(),
  numberTarget: z.string().trim().optional(),
});