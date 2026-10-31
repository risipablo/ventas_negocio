import { Request, Response } from 'express';
import { ArchivoModel } from './archivo.model';
import path from 'path';
import fs from 'fs';

export const getArchivos = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?._id;
  if (!userId) { res.status(401).json({ error: 'No autorizado' }); return; }
  try {
    const archivos = await ArchivoModel.find({ userId }).sort({ createdAt: -1 });
    res.json(archivos);
  } catch (err) { res.status(500).json({ error: (err as Error).message }); }
};

export const uploadArchivo = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user?._id;
  if (!userId) { res.status(401).json({ error: 'No autorizado' }); return; }
  
  if (!req.file) {
    res.status(400).json({ error: 'No se subió ningún archivo' });
    return;
  }

  try {
    const nuevoArchivo = new ArchivoModel({
      nombreOriginal: req.file.originalname,
      nombreGuardado: req.file.filename,
      ruta: `/uploads/${req.file.filename}`,
      tipo: req.file.mimetype,
      tamaño: req.file.size,
      userId
    });
    await nuevoArchivo.save();
    res.status(201).json(nuevoArchivo);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

export const deleteArchivo = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const userId = req.user?._id;
  if (!userId) { res.status(401).json({ error: 'No autorizado' }); return; }
  
  try {
    const archivo = await ArchivoModel.findOneAndDelete({ _id: id, userId });
    if (!archivo) { res.status(404).json({ error: 'Archivo no encontrado' }); return; }
    
    // Eliminar el archivo físico del disco
    const filePath = path.join(__dirname, '../../../uploads', archivo.nombreGuardado);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    
    res.json({ message: 'Archivo eliminado' });
  } catch (err) { res.status(500).json({ error: (err as Error).message }); }
};