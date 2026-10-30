import { Request, Response } from "express";
import { GastoModel } from "./gastos.model";

export const getGastos = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?._id;
  if (!userId) { res.status(401).json({ error: 'No autorizado' }); return; }
  try {
    const gastos = await GastoModel.find({ userId }).sort({ fecha: -1 });
    res.json(gastos);
  } catch (err) { res.status(500).json({ error: (err as Error).message }); }
};

export const addGasto = async (req: Request, res: Response): Promise<void> => {
  const { proveedor, fecha, numeroBoleta, monto, estado } = req.body;
  const userId = req.user?._id;
  if (!userId) { res.status(401).json({ error: 'No autorizado' }); return; }
  try {
    const nuevo = new GastoModel({ proveedor, fecha, numeroBoleta, monto, estado, userId });
    await nuevo.save();
    res.status(201).json(nuevo);
  } catch (err) { res.status(500).json({ error: (err as Error).message }); }
};

export const updateGasto = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { proveedor, fecha, numeroBoleta, monto, estado, fechaPago } = req.body;
  const userId = req.user?._id;
  
  if (!userId) { res.status(401).json({ error: 'No autorizado' }); return; }
  
  try {
    const updated = await GastoModel.findOneAndUpdate(
      { _id: id, userId },
      { proveedor, fecha, numeroBoleta, monto, estado, fechaPago },
      { new: true }
    );
    if (!updated) { res.status(404).json({ error: 'Gasto no encontrado' }); return; }
    res.json(updated);
  } catch (err) { res.status(500).json({ error: (err as Error).message }); }
};

export const deleteGasto = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const userId = req.user?._id;
  if (!userId) { res.status(401).json({ error: 'No autorizado' }); return; }
  try {
    const deleted = await GastoModel.findOneAndDelete({ _id: id, userId });
    if (!deleted) { res.status(404).json({ error: 'Gasto no encontrado' }); return; }
    res.json({ message: 'Gasto eliminado' });
  } catch (err) { res.status(500).json({ error: (err as Error).message }); }
};