import { useState } from 'react';
import axiosInstance from '../../../config/axiosConfig';
import toast from 'react-hot-toast';

export const useChangePassword = () => {
  const [loading, setLoading] = useState(false);

  const changePassword = async (currentPassword: string, newPassword: string) => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.put('/api/auth/change-password', {
        currentPassword,
        newPassword,
      });
      toast.success(data.message || 'Contraseña actualizada');
      return true;
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Error al cambiar la contraseña');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { changePassword, loading };
};