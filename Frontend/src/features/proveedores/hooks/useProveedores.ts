import { useCallback, useEffect, useState } from "react";

import toast from "react-hot-toast";
import axiosInstance from "../../../config/axiosConfig";
import type { IProveedor } from "../types/proveedores.type";


const TOAST_CONFIG = {
  position: 'top-center' as const,
  duration: 1500,
  style: {
    background: 'rgba(28, 42, 68)',
    color: '#ffffff',
  },
};

export const useProveedor = () => {
  const [proveedores, setProveedores] = useState<IProveedor[]>([]);
  const [loading, setLoading] = useState(true);

  const loadProveedores = useCallback(async () => {
    try {
      const { data } = await axiosInstance.get('/api/proveedors');
      setProveedores(data);
    } catch (error) {
      console.error(error);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { loadProveedores(); }, [loadProveedores]);

  const addProveedor = useCallback(async (data: Omit<IProveedor, '_id' | 'userId'>) => {
    try {
      const res = await axiosInstance.post('/api/proveedors', data);
      setProveedores((prev) => [...prev, res.data]);
      toast.success('Proveedor agregado', TOAST_CONFIG);
    } catch (error) {
      toast.error('Error al agregar', TOAST_CONFIG);
      throw error;
    }
  }, []);

  const deleteProveedor = useCallback(async (id: string) => {
    try {
      await axiosInstance.delete(`/api/proveedors/${id}`);
      setProveedores((prev) => prev.filter((p) => p._id !== id));
      toast.success('Proveedor eliminado', TOAST_CONFIG);
    } catch (error) { toast.error('Error al eliminar', TOAST_CONFIG); }
  }, []);

  const bulkDelete = useCallback(async (ids: string[]) => {
    try {
      await axiosInstance.post('/api/proveedors/bulk-delete', { ids });
      setProveedores((prev) => prev.filter((p) => !ids.includes(p._id!)));
      toast.success('Proveedores eliminados', TOAST_CONFIG);
    } catch (error) { toast.error('Error al eliminar múltiples', TOAST_CONFIG); }
  }, []);

  const updateProveedor = useCallback(async (id: string, data: Partial<IProveedor>) => {
    try {
      const res = await axiosInstance.put(`/api/proveedors/${id}`, data);
      setProveedores((prev) => prev.map((p) => p._id === id ? res.data : p));
      toast.success('Proveedor actualizado', TOAST_CONFIG);
    } catch (error) { toast.error('Error al actualizar', TOAST_CONFIG); }
  }, []);

  return { proveedores, loading, deleteProveedor, bulkDelete, updateProveedor,addProveedor };
};