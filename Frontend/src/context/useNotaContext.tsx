import { createContext, useContext, useState, useEffect, useCallback, createElement, type ReactNode } from 'react';
import toast from 'react-hot-toast';
import axiosInstance from '../config/axiosConfig';


 export interface INota {
  _id?: string;
  fecha: string;
  titulo: string;
  descripcion: string;
  realizado?: boolean;
}

interface NotasContextType {
  notas: INota[];
  loading: boolean;
  pendingNotesCount: number;
  addNota: (nota: Omit<INota, '_id'>) => Promise<any>;
  updateNota: (id: string, data: Partial<INota>) => Promise<any>;
  deleteNota: (id: string) => Promise<void>;
}

const NotasContext = createContext<NotasContextType | undefined>(undefined);

export const NotasProvider = ({ children }: { children: ReactNode }) => {
  const [notas, setNotas] = useState<INota[]>([]);
  const [loading, setLoading] = useState(true);

  const loadNotas = useCallback(async () => {
    try {
      const { data } = await axiosInstance.get('/api/notas');
      setNotas(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadNotas(); }, [loadNotas]);

  const addNota = async (nota: Omit<INota, '_id'>) => {
    const { data } = await axiosInstance.post('/api/notas', nota);
    setNotas(prev => [data, ...prev]);
    toast.success('Nota agregada');
    return data;
  };

  const updateNota = async (id: string, updatedData: Partial<INota>) => {
    const { data } = await axiosInstance.put(`/api/notas/${id}`, updatedData);
    setNotas(prev => prev.map(n => n._id === id ? data : n));
    toast.success('Nota actualizada');
    return data;
  };

  const deleteNota = async (id: string) => {
    await axiosInstance.delete(`/api/notas/${id}`);
    setNotas(prev => prev.filter(n => n._id !== id));
    toast.success('Nota eliminada');
  };

  
  const pendingNotesCount = notas.filter(n => !n.realizado).length;

  useEffect(() => {
    localStorage.setItem('notasPendientes', String(pendingNotesCount));
  }, [pendingNotesCount]);

  return (
    <NotasContext.Provider value={{ notas, loading, pendingNotesCount, addNota, updateNota, deleteNota }}>
      {children}
    </NotasContext.Provider>
  );
};

export const useNotas = () => {
  const context = useContext(NotasContext);
  if (!context) throw new Error('useNotas debe usarse dentro de NotasProvider');
  return context;
};