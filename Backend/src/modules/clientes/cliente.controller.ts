import { Request, Response } from "express";
import { ClienteModel } from "./cliente.model";

export const getClientes = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?._id;
  if (!userId) { res.status(401).json({ error: 'No autorizado' }); return; }
  try {
    const clientes = await ClienteModel.find({ userId }).sort({ fecha: -1 });
    res.json(clientes);
  } catch (err) { res.status(500).json({ error: (err as Error).message }); }
};

export const addCliente = async (req: Request, res: Response): Promise<void> => {
  const { cliente, fecha, producto, precio } = req.body;
  const userId = req.user?._id;
  if (!userId) { res.status(401).json({ error: 'No autorizado' }); return; }
  try {
    const nuevo = new ClienteModel({ cliente, fecha, producto, precio, userId });
    await nuevo.save();
    res.status(201).json(nuevo);
  } catch (err) { res.status(500).json({ error: (err as Error).message }); }
};

export const updateCliente = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const userId = req.user?._id;
  if (!userId) { res.status(401).json({ error: 'No autorizado' }); return; }
  try {
    const updated = await ClienteModel.findOneAndUpdate(
      { _id: id, userId },
      req.body,
      { new: true }
    );
    if (!updated) { res.status(404).json({ error: 'Cliente no encontrado' }); return; }
    res.json(updated);
  } catch (err) { res.status(500).json({ error: (err as Error).message }); }
};

export const deleteCliente = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const userId = req.user?._id;
  if (!userId) { res.status(401).json({ error: 'No autorizado' }); return; }
  try {
    const deleted = await ClienteModel.findOneAndDelete({ _id: id, userId });
    if (!deleted) { res.status(404).json({ error: 'Cliente no encontrado' }); return; }
    res.json({ message: 'Cliente eliminado' });
  } catch (err) { res.status(500).json({ error: (err as Error).message }); }
};