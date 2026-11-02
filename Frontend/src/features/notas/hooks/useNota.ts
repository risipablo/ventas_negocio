// import { useCallback, useEffect, useState } from "react";
// import axiosInstance from "../../../config/axiosConfig";
// import toast from "react-hot-toast";

// export interface INota {
//   _id?: string;
//   fecha: string;
//   titulo: string;
//   descripcion: string;
//   realizado?: boolean;
// }

// const TOAST_CONFIG = {
//   position: 'top-center' as const,
//   duration: 3000,
//   style: { background: "rgba(28, 42, 68)", color: "#ffffff" }
// };

// export const useNotas = () => {
//   const [notas, setNotas] = useState<INota[]>([]);
//   const [loading, setLoading] = useState(true);

//   const loadNotas = useCallback(async () => {
//     try {
//       const { data } = await axiosInstance.get('/api/notas');
//       setNotas(data);
//     } catch (error) {
//       console.error('Error al cargar notas:', error);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     loadNotas();
//   }, [loadNotas]);

//   const addNota = useCallback(async (nota: Omit<INota, '_id'>) => {
//     try {
//       const { data } = await axiosInstance.post('/api/notas', nota);
//       setNotas((prev) => [data, ...prev]);
//       toast.success('Nota agregada exitosamente', TOAST_CONFIG);
//       return data;
//     } catch (error) {
//       toast.error('Error al agregar nota', TOAST_CONFIG);
//       throw error;
//     }
//   }, []);

//   const updateNota = useCallback(async (id: string, data: Partial<INota>) => {
//     try {
//       const res = await axiosInstance.put(`/api/notas/${id}`, data);
//       setNotas((prev) => prev.map((n) => n._id === id ? res.data : n));
//       toast.success('Nota actualizada', TOAST_CONFIG);
//       return res.data;
//     } catch (error) {
//       toast.error('Error al actualizar nota', TOAST_CONFIG);
//       throw error;
//     }
//   }, []);

//   const deleteNota = useCallback(async (id: string) => {
//     try {
//       await axiosInstance.delete(`/api/notas/${id}`);
//       setNotas((prev) => prev.filter((n) => n._id !== id));
//       toast.success('Nota eliminada', TOAST_CONFIG);
//     } catch (error) {
//       toast.error('Error al eliminar nota', TOAST_CONFIG);
//     }
//   }, []);

//   return { notas, loading, addNota, updateNota, deleteNota };
// };