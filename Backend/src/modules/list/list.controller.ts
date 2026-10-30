import { Request, Response } from "express";
import { ListModel } from "./list.model";

export const getList = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?._id;
    if (!userId) {
        res.status(401).json({ error: 'No autorizado' });
        return;
    }
    try {
        const list = await ListModel.find({ userId });
        res.json(list);
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
};

export const AddList = async (req: Request, res: Response): Promise<void> => {
    const { marca, mascota, edad, kilo, condicion, precio, categoria } = req.body;
    const userId = req.user?._id;
    if (!userId) {
        res.status(401).json({ error: 'No autorizado' });
        return;
    }
    try {
        const newList = new ListModel({
            marca, mascota, edad, kilo, condicion, precio, categoria, userId
        });
        await newList.save();
        res.status(201).json(newList);
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
};

export const deleteList = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const userId = req.user?._id;
    if (!userId) {
        res.status(401).json({ error: 'No autorizado' });
        return;
    }
    try {
        const deletedList = await ListModel.findOneAndDelete({ _id: id, userId });
        if (!deletedList) {
            res.status(404).json({ error: 'Elemento no encontrado' });
            return;
        }
        res.json({ message: 'Elemento eliminado correctamente' });
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
};


export const bulkDeleteList = async (req: Request, res: Response): Promise<void> => {
    const { ids } = req.body;
    const userId = req.user?._id;

    if (!userId) {
        res.status(401).json({ error: 'No autorizado' });
        return;
    }
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
        res.status(400).json({ error: 'No se enviaron IDs válidos' });
        return;
    }

    try {
        const result = await ListModel.deleteMany({ 
            _id: { $in: ids }, 
            userId 
        });
        
        if (result.deletedCount === 0) {
            res.status(404).json({ error: 'Ningún elemento fue encontrado o no tienes permiso' });
            return;
        }
        
        res.json({ message: `${result.deletedCount} elementos eliminados correctamente` });
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
};

export const updateList = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const userId = req.user?._id;
    if (!userId) {
        res.status(401).json({ error: 'No autorizado' });
        return;
    }
    try {
        const updatedList = await ListModel.findOneAndUpdate(
            { _id: id, userId },
            req.body,
            { new: true }
        );
        if (!updatedList) {
            res.status(404).json({ error: 'Elemento no encontrado' });
            return;
        }
        res.json(updatedList); // Retornamos el objeto actualizado
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
};