import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import axiosInstance from '../config/axiosConfig';
import toast from 'react-hot-toast';

export interface ICarritoItem {
  productoId: string;
  nombre: string;
  cantidad: number;
  precio: number;
}

export interface ICarritoGuardado {
  _id?: string;
  titulo: string;
  items: ICarritoItem[];
  total: number;
  marcado?: boolean;
  createdAt?: string;
}

interface CarritosGuardadosContextType {
  carritos: ICarritoGuardado[];
  pendingListsCount: number; 
  loading: boolean;
  saveCarrito: (titulo: string, data: Omit<ICarritoGuardado, '_id'>) => Promise<ICarritoGuardado>;
  updateCarrito: (id: string, data: Partial<ICarritoGuardado>) => Promise<ICarritoGuardado>;
  deleteCarrito: (id: string) => Promise<void>;
}

const CarritosGuardadosContext = createContext<CarritosGuardadosContextType | undefined>(undefined);

export const CarritosGuardadosProvider = ({ children }: { children: ReactNode }) => {
  const [carritos, setCarritos] = useState<ICarritoGuardado[]>([]);
  const [loading, setLoading] = useState(true);

  const loadCarritos = useCallback(async () => {
    try {
      const { data } = await axiosInstance.get('/api/carritos');
      setCarritos(data);
    } catch (error) {
      console.error('Error al cargar carritos guardados:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCarritos();
  }, [loadCarritos]);

  const saveCarrito = async (titulo: string, carritoData: Omit<ICarritoGuardado, '_id'>) => {
    try {
      const { data } = await axiosInstance.post('/api/carritos', { ...carritoData, titulo });
      setCarritos((prev) => [data, ...prev]);
      toast.success('Lista guardada exitosamente');
      return data;
    } catch (error) {
      toast.error('Error al guardar la lista');
      throw error;
    }
  };

  const updateCarrito = async (id: string, updatedData: Partial<ICarritoGuardado>) => {
    try {
      const { data } = await axiosInstance.put(`/api/carritos/${id}`, updatedData);
      setCarritos((prev) => prev.map((c) => (c._id === id ? data : c)));
      toast.success('Lista actualizada');
      return data;
    } catch (error) {
      toast.error('Error al actualizar la lista');
      throw error;
    }
  };

  const deleteCarrito = async (id: string) => {
    try {
      await axiosInstance.delete(`/api/carritos/${id}`);
      setCarritos((prev) => prev.filter((c) => c._id !== id));
      toast.success('Lista eliminada');
    } catch (error) {
      toast.error('Error al eliminar la lista');
    }
  };


  const pendingListsCount = carritos.filter(c => !c.marcado).length;

  return (
    <CarritosGuardadosContext.Provider 
      value={{ carritos, pendingListsCount, loading, saveCarrito, updateCarrito, deleteCarrito }}
    >
      {children}
    </CarritosGuardadosContext.Provider>
  );
};

export const useCarritosGuardados = () => {
  const context = useContext(CarritosGuardadosContext);
  if (!context) throw new Error('useCarritosGuardados debe usarse dentro de CarritosGuardadosProvider');
  return context;
};