import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';

import toast from 'react-hot-toast';
import type { IGasto } from '../features/gastos/types/gastos.types';
import axiosInstance from '../config/axiosConfig';




interface GastosContextType {
  gastos: IGasto[];
  filterGastos:IGasto[]
  setFilterGastos:React.Dispatch<React.SetStateAction<IGasto[]>>
  loading: boolean;
  pendingGastosCount: number;
  addGasto: (gasto: Omit<IGasto, '_id'>) => Promise<any>;
  updateGasto: (id: string, data: Partial<IGasto>) => Promise<any>;
  deleteGasto: (id: string) => Promise<void>;
}

const GastosContext = createContext<GastosContextType | undefined>(undefined);

export const GastosProvider = ({ children }: { children: ReactNode }) => {
  const [gastos, setGastos] = useState<IGasto[]>([]);
  const [filterGastos, setFilterGastos] = useState<IGasto[]>([])
  const [loading, setLoading] = useState(true);

  const loadGastos = useCallback(async () => {
    try {
      const { data } = await axiosInstance.get('/api/gastos');
      setGastos(data);
      setFilterGastos(data)
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadGastos(); }, [loadGastos]);

  const addGasto = async (gasto: Omit<IGasto, '_id'>) => {
    const { data } = await axiosInstance.post('/api/gastos', gasto);
    setGastos(prev => [data, ...prev]);
    setFilterGastos(prev => [data, ...prev]);
    toast.success('Gasto registrado');
    return data;
  };

  const updateGasto = async (id: string, updatedData: Partial<IGasto>) => {
    const { data } = await axiosInstance.put(`/api/gastos/${id}`, updatedData);
    
    setGastos(prev => prev.map(g => g._id === id ? data : g));
    setFilterGastos(prev => prev.map(g => g._id === id ? data : g));
    toast.success('Gasto actualizado');
    return data;
  };

  const deleteGasto = async (id: string) => {
    await axiosInstance.delete(`/api/gastos/${id}`);
    setGastos(prev => prev.filter(g => g._id !== id));
    setFilterGastos(prev => prev.filter(g => g._id !== id));
    toast.success('Gasto eliminado');
  };

  // Contador en tiempo real
  const pendingGastosCount = gastos.filter(g => g.estado === 'impago').length;

  return (
    <GastosContext.Provider value={{ gastos,filterGastos,
    setFilterGastos, loading, pendingGastosCount,addGasto, updateGasto, deleteGasto }}>
      {children}
    </GastosContext.Provider>
  );
};

export const useGastos = () => {
  const context = useContext(GastosContext);
  if (!context) throw new Error('useGastos debe usarse dentro de GastosProvider');
  return context;
};