import { useCallback, useEffect, useState } from 'react';
import type {
  CreateSalePayload,
  Sale,
  UpdateSalePayload,
} from '../types/sale.types';
import axiosInstance from '../../../config/axiosConfig';
import toast from "react-hot-toast"

const TOAST_CONFIG = {
    position: 'top-center' as const,
    duration: 1500,
    style:{
    background: "rgba(28, 42, 68)",
    color: "#ffffff",
    }
}


const API = '/api/sales';



export const useSales = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [filterSales, setFilterSales] = useState<Sale[]>([])
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSales = useCallback(async () => {

    setLoading(true);
    setError(null);

    try {
      const { data } = await axiosInstance.get<Sale[]>(API);
      setFilterSales(data)
      setSales(data);
    } catch (err) {
      setError((err as Error).message);
       toast.error('Error al cargar ventas');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSales();
  }, [fetchSales]);

  const createSale = useCallback(async (payload: CreateSalePayload) => {
    setError(null);

    try {
      const { data } = await axiosInstance.post<Sale>(API, payload);
      setFilterSales((prev) => [data, ...prev]);
      setSales((prev) => [data, ...prev]);
      toast.success('Venta agregado exitosamente', TOAST_CONFIG)
      return data;
    } catch (err) {
      setError((err as Error).message);
      throw err;
    }
  }, []);

  const updateSale = useCallback(
    async (id: string, payload: UpdateSalePayload) => {
      setError(null);

      try {
        const { data } = await axiosInstance.put<Sale>(`${API}/${id}`, payload);
        setFilterSales((prev) => prev.map((s) => (s._id === id ? data : s)));
        setSales((prev) => prev.map((s) => (s._id === id ? data : s)));
        toast.success('Venta editada exitosamente', TOAST_CONFIG)
        return data;
      } catch (err) {
        setError((err as Error).message);
        throw err;
      }
    },
    []
  );

  const deleteSale = useCallback(async (id: string) => {
    setError(null);

    try {
      await axiosInstance.delete(`${API}/${id}`);
      setFilterSales((prev) => prev.filter((s) => s._id !== id));
      setSales((prev) => prev.filter((s) => s._id !== id));
      toast.success('Venta eliminada', TOAST_CONFIG)
    } catch (err) {
      setError((err as Error).message);
      throw err;
    }
  }, []);

  return {
    sales,
    loading,
    error,
    filterSales,
    setFilterSales,
    fetchSales,
    createSale,
    updateSale,
    deleteSale,
  };
};