import { Request, Response } from "express";
import { CarritoGuardadoModel } from "./carrito.model";


export const getCarritos = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?._id;
  if (!userId) { res.status(401).json({ error: 'No autorizado' }); return; }
  try {
    const carritos = await CarritoGuardadoModel.find({ userId }).sort({ createdAt: -1 });
    res.json(carritos);
  } catch (err) { res.status(500).json({ error: (err as Error).message }); }
};

export const addCarrito = async (req: Request, res: Response): Promise<void> => {
  const { titulo, items, total } = req.body;
  const userId = req.user?._id;
  if (!userId) { res.status(401).json({ error: 'No autorizado' }); return; }
  try {
    const nuevo = new CarritoGuardadoModel({ titulo, items, total, userId });
    await nuevo.save();
    res.status(201).json(nuevo);
  } catch (err) { res.status(500).json({ error: (err as Error).message }); }
};

export const deleteCarrito = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const userId = req.user?._id;
  if (!userId) { res.status(401).json({ error: 'No autorizado' }); return; }
  try {
    const deleted = await CarritoGuardadoModel.findOneAndDelete({ _id: id, userId });
    if (!deleted) { res.status(404).json({ error: 'Carrito no encontrado' }); return; }
    res.json({ message: 'Carrito eliminado' });
  } catch (err) { res.status(500).json({ error: (err as Error).message }); }
};


export const updateCarrito = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { titulo, items, total, marcado } = req.body; 
  const userId = req.user?._id;

  if (!userId) {
    res.status(401).json({ error: 'No autorizado' });
    return;
  }

  try {
    const updated = await CarritoGuardadoModel.findOneAndUpdate(
      { _id: id, userId },
      { titulo, items, total, marcado }, 
      { new: true }
    );

    if (!updated) {
      res.status(404).json({ error: 'Lista no encontrada' });
      return;
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};