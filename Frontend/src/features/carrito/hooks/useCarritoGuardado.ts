import { useCallback, useEffect, useState } from "react";
import axiosInstance from "../../../config/axiosConfig";
import toast from "react-hot-toast";

export interface ICarritoItem {
  productoId: string;
  nombre: string;
  cantidad: number;
  precio: number;
  marcado?: boolean;
}

export interface ICarritoGuardado {
  marcado: any;
  _id?: string;
  titulo: string;
  items: ICarritoItem[];
  total: number;
  createdAt?: string;
}

export const useCarritosGuardados = () => {
  const [carritos, setCarritos] = useState<ICarritoGuardado[]>([]);
  const [loading, setLoading] = useState(true);

  const loadCarritos = useCallback(async () => {
    try {
      const { data } = await axiosInstance.get('/api/carritos');
      setCarritos(data);
    } catch (error) {
      console.error(error);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { loadCarritos(); }, [loadCarritos]);

  const saveCarrito = useCallback(async (titulo: string, carritoData: Omit<ICarritoGuardado, '_id'>) => {
    try {
      const { data } = await axiosInstance.post('/api/carritos', { ...carritoData, titulo });
      setCarritos((prev) => [data, ...prev]);
      toast.success('Carrito guardado exitosamente');
      return data;
    } catch (error) {
      toast.error('Error al guardar el carrito');
      throw error;
    }
  }, []);

  const deleteCarrito = useCallback(async (id: string) => {
    try {
      await axiosInstance.delete(`/api/carritos/${id}`);
      setCarritos((prev) => prev.filter((c) => c._id !== id));
      toast.success('Carrito eliminado');
    } catch (error) {
      toast.error('Error al eliminar el carrito');
    }
  }, []);

   const updateCarrito = useCallback(async (id: string, data: Partial<ICarritoGuardado>) => {
    try {
      const res = await axiosInstance.put(`/api/carritos/${id}`, data);
      setCarritos((prev) => prev.map((c) => c._id === id ? res.data : c));
      toast.success('Lista actualizada exitosamente');
      return res.data;
    } catch (error) {
      toast.error('Error al actualizar la lista');
      throw error;
    }
  }, []);

  return { carritos, loading, saveCarrito, deleteCarrito,updateCarrito };
};