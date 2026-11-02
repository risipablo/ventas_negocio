// import { useCallback, useEffect, useState } from "react";
// import axiosInstance from "../../../config/axiosConfig";
// import toast from "react-hot-toast";
// import type { IGasto } from "../types/gastos.types";

// const TOAST_CONFIG = { position: 'top-center' as const, duration: 3000, style: { background: "rgba(28, 42, 68)", color: "#ffffff" } };

// export const useGastos = () => {
//   const [gastos, setGastos] = useState<IGasto[]>([]);
//   const [loading, setLoading] = useState(true);

//   const loadGastos = useCallback(async () => {
//     try {
//       const { data } = await axiosInstance.get('/api/gastos');
//       setGastos(data);
//     } catch (error) {
//       console.error('Error al cargar gastos:', error);
//     } finally { setLoading(false); }
//   }, []);

//   useEffect(() => { loadGastos(); }, [loadGastos]);

//   const addGasto = useCallback(async (gasto: Omit<IGasto, '_id'>) => {
//     try {
//       const { data } = await axiosInstance.post('/api/gastos', gasto);
//       setGastos((prev) => [data, ...prev]);
//       toast.success('Gasto registrado', TOAST_CONFIG);
//       return data;
//     } catch (error) {
//       toast.error('Error al registrar gasto', TOAST_CONFIG);
//       throw error;
//     }
//   }, []);

//   const updateGasto = useCallback(async (id: string, data: Partial<IGasto>) => {
//     try {
//       const res = await axiosInstance.put(`/api/gastos/${id}`, data);
//       setGastos((prev) => prev.map((g) => g._id === id ? res.data : g));
//       toast.success('Gasto actualizado', TOAST_CONFIG);
//       return res.data;
//     } catch (error) {
//       toast.error('Error al actualizar gasto', TOAST_CONFIG);
//       throw error;
//     }
//   }, []);

//   const deleteGasto = useCallback(async (id: string) => {
//     try {
//       await axiosInstance.delete(`/api/gastos/${id}`);
//       setGastos((prev) => prev.filter((g) => g._id !== id));
//       toast.success('Gasto eliminado', TOAST_CONFIG);
//     } catch (error) {
//       toast.error('Error al eliminar gasto', TOAST_CONFIG);
//     }
//   }, []);

//   return { gastos, loading, addGasto, updateGasto, deleteGasto };
// };