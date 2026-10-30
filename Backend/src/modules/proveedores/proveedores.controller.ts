import { Request, Response } from "express";
import { ProveedorModel } from "./proveedores.model";



export const getProveedores = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?._id;
  if (!userId) { res.status(401).json({ error: 'No autorizado' }); return; }
  try {
    const proveedores = await ProveedorModel.find({ userId });
    res.json(proveedores);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

export const addProveedor = async (req: Request, res: Response): Promise<void> => {
  const {date, proveedores, marcas, mascotas, edades, kilos, precios } = req.body;
  const userId = req.user?._id;
  if (!userId) { res.status(401).json({ error: 'No autorizado' }); return; }
  try {
    const newProveedor = new ProveedorModel({ date, proveedores, marcas, mascotas, edades, kilos, precios, userId });
    await newProveedor.save();
    res.status(201).json(newProveedor);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

export const updateProveedor = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const userId = req.user?._id;
  if (!userId) { res.status(401).json({ error: 'No autorizado' }); return; }
  try {
    const updated = await ProveedorModel.findOneAndUpdate({ _id: id, userId }, req.body, { new: true });
    if (!updated) { res.status(404).json({ error: 'Proveedor no encontrado' }); return; }
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

export const deleteProveedor = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const userId = req.user?._id;
  if (!userId) { res.status(401).json({ error: 'No autorizado' }); return; }
  try {
    const deleted = await ProveedorModel.findOneAndDelete({ _id: id, userId });
    if (!deleted) { res.status(404).json({ error: 'Proveedor no encontrado' }); return; }
    res.json({ message: 'Proveedor eliminado' });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

export const bulkDeleteProveedores = async (req: Request, res: Response): Promise<void> => {
  const { ids } = req.body;
  const userId = req.user?._id;
  if (!userId) { res.status(401).json({ error: 'No autorizado' }); return; }
  try {
    await ProveedorModel.deleteMany({ _id: { $in: ids }, userId });
    res.json({ message: 'Proveedores eliminados' });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};