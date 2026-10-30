import { useCallback, useEffect, useState } from 'react';
import type { IList } from '../types/type.list';
import axiosInstance from '../../../config/axiosConfig';
import toast from 'react-hot-toast';

const TOAST_CONFIG = {
  position: 'top-center' as const,
  duration: 1500,
  style: {
    background: 'rgba(28, 42, 68)',
    color: '#ffffff',
  },
};

export const useList = () => {
  const [list, setList] = useState<IList[]>([]);
  const [loading, setLoading] = useState(true);

  const loadList = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/api/list');
      const data = Array.isArray(response.data) ? response.data : [];
      setList(data);
    } catch (error) {
      console.error('Error al cargar productos:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadList();
  }, [loadList]);

  const addList = useCallback(
    async (
      marca: string,
      mascota: string,
      edad: string,
      kilo: string,
      condicion: string,
      precio: string,
      categoria: string
    ) => {
      try {
        const response = await axiosInstance.post<IList>('/api/list', {
          marca,
          mascota,
          edad,
          kilo,
          condicion,
          precio,
          categoria,
        });
        setList((prev) => [...prev, response.data]);
        toast.success('Producto agregado exitosamente', TOAST_CONFIG);
      } catch (error) {
        console.error('Error al agregar producto:', error);
        toast.error('Error al agregar producto', TOAST_CONFIG);
        throw error;
      }
    },
    []
  );

  const deleteList = useCallback(async (id: string) => {
    try {
      await axiosInstance.delete(`/api/list/${id}`);
      setList((prev) => prev.filter((item) => item._id !== id));
      toast.success('Producto eliminado exitosamente', TOAST_CONFIG);
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      toast.error('Error al eliminar producto', TOAST_CONFIG);
    }
  }, []);

  const bulkDeleteList = useCallback(async (ids: string[]) => {
    try {
      await Promise.all(ids.map((id) => axiosInstance.delete(`/api/list/${id}`)));
      setList((prev) => prev.filter((item) => !ids.includes(item._id as string)));
      toast.success('Productos eliminados exitosamente', TOAST_CONFIG);
    } catch (error) {
      console.error('Error al eliminar productos:', error);
      toast.error('Error al eliminar productos', TOAST_CONFIG);
    }
  }, []);

  const updateList = useCallback(async (id: string, updatedData: Partial<IList>) => {
    try {
      const response = await axiosInstance.put(`/api/list/${id}`, updatedData);
      setList((prev) =>
        prev.map((item) => (item._id === id ? { ...item, ...response.data } : item))
      );
      toast.success('Producto actualizado exitosamente', TOAST_CONFIG);
    } catch (error) {
      console.error('Error al actualizar producto:', error);
      toast.error('Error al actualizar producto', TOAST_CONFIG);
      throw error;
    }
  }, []);

  return {
    list,
    setList,
    loading,
    addList,
    deleteList,
    bulkDeleteList,
    updateList,
  };
};