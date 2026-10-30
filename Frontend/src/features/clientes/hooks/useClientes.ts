import { useCallback, useEffect, useState } from "react";
import axiosInstance from "../../../config/axiosConfig";
import toast from "react-hot-toast";

export interface IClienteItem {
  _id?: string;
  fecha: string;
  producto: string;
  precio: number;
}

export interface ICliente {
  _id?: string;
  cliente: string;
  fecha: string;
  producto: string;
  precio: number;
  items: IClienteItem[];
}

const TOAST_CONFIG = { position: 'top-center' as const, duration: 3000, style: { background: "rgba(28, 42, 68)", color: "#ffffff" } };

export const useClientes = () => {
  const [clientes, setClientes] = useState<ICliente[]>([]);
  const [loading, setLoading] = useState(true);

  const loadClientes = useCallback(async () => {
    try {
      const { data } = await axiosInstance.get('/api/clientes');
      setClientes(data);
    } catch (error) {
      console.error('Error al cargar clientes:', error);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { loadClientes(); }, [loadClientes]);

  const addCliente = useCallback(async (cliente: Omit<ICliente, '_id'>) => {
    try {
      const { data } = await axiosInstance.post('/api/clientes', cliente);
      setClientes((prev) => [data, ...prev]);
      toast.success('Cliente registrado', TOAST_CONFIG);
      return data;
    } catch (error) {
      toast.error('Error al registrar cliente', TOAST_CONFIG);
      throw error;
    }
  }, []);

  const updateCliente = useCallback(async (id: string, data: Partial<ICliente>) => {
    try {
      const res = await axiosInstance.put(`/api/clientes/${id}`, data);
      setClientes((prev) => prev.map((c) => c._id === id ? res.data : c));
      toast.success('Cliente actualizado', TOAST_CONFIG);
      return res.data;
    } catch (error) {
      toast.error('Error al actualizar cliente', TOAST_CONFIG);
      throw error;
    }
  }, []);

  const deleteCliente = useCallback(async (id: string) => {
    try {
      await axiosInstance.delete(`/api/clientes/${id}`);
      setClientes((prev) => prev.filter((c) => c._id !== id));
      toast.success('Cliente eliminado', TOAST_CONFIG);
    } catch (error) {
      toast.error('Error al eliminar cliente', TOAST_CONFIG);
    }
  }, []);

  return { clientes, loading, addCliente, updateCliente, deleteCliente };
};