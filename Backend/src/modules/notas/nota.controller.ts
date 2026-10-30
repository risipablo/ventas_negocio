import { Request, Response } from "express";
import { NotaModel } from "./nota.model";

export const getNotas = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?._id;
  if (!userId) { res.status(401).json({ error: 'No autorizado' }); return; }
  try {
    
    const notas = await NotaModel.find({ userId }).sort({ fecha: -1 }); // => ordenar por fechas
    res.json(notas);
  } catch (err) { res.status(500).json({ error: (err as Error).message }); }
};
export const addNota = async (req: Request, res: Response): Promise<void> => {
  const { fecha, titulo, descripcion } = req.body;
  const userId = req.user?._id;
  if (!userId) { res.status(401).json({ error: 'No autorizado' }); return; }
  try {
    const newNota = new NotaModel({ fecha, titulo, descripcion, userId });
    await newNota.save();
    res.status(201).json(newNota);
  } catch (err) { res.status(500).json({ error: (err as Error).message }); }
};

export const updateNota = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const userId = req.user?._id;
  if (!userId) { res.status(401).json({ error: 'No autorizado' }); return; }
  try {
    const updated = await NotaModel.findOneAndUpdate({ _id: id, userId }, req.body, { new: true });
    if (!updated) { res.status(404).json({ error: 'Nota no encontrada' }); return; }
    res.json(updated);
  } catch (err) { res.status(500).json({ error: (err as Error).message }); }
};

export const deleteNota = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const userId = req.user?._id;
  if (!userId) { res.status(401).json({ error: 'No autorizado' }); return; }
  try {
    const deleted = await NotaModel.findOneAndDelete({ _id: id, userId });
    if (!deleted) { res.status(404).json({ error: 'Nota no encontrada' }); return; }
    res.json({ message: 'Nota eliminada' });
  } catch (err) { res.status(500).json({ error: (err as Error).message }); }
};