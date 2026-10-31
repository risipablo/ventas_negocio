import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import axiosInstance from "../../../config/axiosConfig";


export interface IArchivo {
  _id?: string;
  nombreOriginal: string;
  nombreGuardado: string;
  ruta: string;
  tipo: string;
  tamaño: number;
  createdAt?: string;
}

export const useArchivos = () => {
  const [archivos, setArchivos] = useState<IArchivo[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const loadArchivos = useCallback(async () => {
    try {
      const { data } = await axiosInstance.get('/api/archivos');
      setArchivos(data);
    } catch (error) {
      console.error(error);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { loadArchivos(); }, [loadArchivos]);

  const uploadArchivo = useCallback(async (file: File) => {
    setUploading(true);
    const formData = new FormData();
    formData.append('archivo', file);

    try {
      const { data } = await axiosInstance.post('/api/archivos', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setArchivos(prev => [data, ...prev]);
      toast.success('Archivo subido exitosamente');
      return data;
    } catch (error) {
      toast.error('Error al subir el archivo');
      throw error;
    } finally {
      setUploading(false);
    }
  }, []);

  const deleteArchivo = useCallback(async (id: string) => {
    try {
      await axiosInstance.delete(`/api/archivos/${id}`);
      setArchivos(prev => prev.filter(a => a._id !== id));
      toast.success('Archivo eliminado');
    } catch (error) {
      toast.error('Error al eliminar');
    }
  }, []);

  return { archivos, loading, uploading, uploadArchivo, deleteArchivo };
};