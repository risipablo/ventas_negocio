import { Request, Response } from 'express';
import { Types } from 'mongoose';
import { SaleModel } from './sales.model';
import { CreateSaleBody, ISaleItem } from './sales.schema';

export const getSales = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?._id;

  if (!userId) {
    res.status(401).json({ error: 'No autorizado' });
    return;
  }

  try {
    const sales = await SaleModel.find({ createdBy: userId });
    res.json(sales);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

export const createSale = async (
  req: Request<{}, {}, CreateSaleBody>,
  res: Response
): Promise<void> => {
  const userId = req.user?._id;

  if (!userId) {
    res.status(401).json({ error: 'No autorizado' });
    return;
  }

  const { date, items, paymentMethod, cardBrand, couponNumber, numberTarget } = req.body;

  try {
    const itemsWithSubtotal: ISaleItem[] = items.map((item) => ({
      product: item.product ? new Types.ObjectId(item.product) : undefined,
      name: item.name,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      subtotal: item.quantity * item.unitPrice,
    }));

    const total = itemsWithSubtotal.reduce((acc, i) => acc + i.subtotal, 0);

    const sale = await SaleModel.create({
      date: date ? new Date(date) : new Date(),
      items: itemsWithSubtotal,
      paymentMethod,
      cardBrand,
      couponNumber,
      numberTarget,
      total,
      createdBy: userId,
    });

    res.status(201).json(sale);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

export const updateSale = async (
  req: Request<{ id: string }, {}, Partial<CreateSaleBody>>,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const userId = req.user?._id;

  if (!userId) {
    res.status(401).json({ error: 'No autorizado' });
    return;
  }

  if (!id) {
    res.status(400).json({ error: 'El ID es requerido' });
    return;
  }

  const { date, items, paymentMethod, cardBrand, couponNumber, numberTarget } = req.body;

  try {
    const sale = await SaleModel.findOne({ _id: id, createdBy: userId });

    if (!sale) {
      res.status(404).json({ error: 'Venta no encontrada' });
      return;
    }

    if (items && items.length > 0) {
      const itemsWithSubtotal: ISaleItem[] = items.map((item) => ({
        product: item.product ? new Types.ObjectId(item.product) : undefined,
        name: item.name,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        subtotal: item.quantity * item.unitPrice,
      }));

      sale.items = itemsWithSubtotal;
    }

    if (date !== undefined) sale.date = new Date(date);
    
    if (paymentMethod !== undefined) {
      sale.paymentMethod = paymentMethod;

      if (paymentMethod === 'efectivo' || paymentMethod === 'mercado pago') {
        sale.cardBrand = undefined;
        sale.couponNumber = undefined;
        sale.numberTarget = undefined;
      } else if (paymentMethod === 'qr') {
        sale.numberTarget = undefined; 
        if (cardBrand === undefined) sale.cardBrand = undefined;
      }
    }

    if (cardBrand !== undefined) sale.cardBrand = cardBrand;
    if (couponNumber !== undefined) sale.couponNumber = couponNumber;
    if (numberTarget !== undefined) sale.numberTarget = numberTarget;

    sale.total = sale.items.reduce((acc, i) => acc + i.subtotal, 0);

    await sale.save();
    res.json(sale);
  } catch (err) {
    const error = err as Error;

    if (error.name === 'ValidationError') {
      res.status(400).json({ error: error.message });
      return;
    }

    if (error.name === 'CastError') {
      res.status(400).json({ error: 'ID inválido' });
      return;
    }

    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const deleteSale = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const userId = req.user?._id;

  if (!userId) {
    res.status(401).json({ error: 'No autorizado' });
    return;
  }

  if (!id) {
    res.status(400).json({ error: 'El ID es requerido' });
    return;
  }

  try {
    const sale = await SaleModel.findOneAndDelete({
      _id: id,
      createdBy: userId,
    });

    if (!sale) {
      res.status(404).json({ error: 'Venta no encontrada' });
      return;
    }

    res.json(sale);
  } catch (err) {
    const error = err as Error;

    if (error.name === 'CastError') {
      res.status(400).json({ error: 'ID inválido' });
      return;
    }

    res.status(500).json({ error: 'Error interno del servidor' });
  }
};