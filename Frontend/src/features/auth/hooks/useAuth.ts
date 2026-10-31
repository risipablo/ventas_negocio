import { useState } from 'react';
import type { UseAuthReturn } from '../types/type.auth';
import { useUser } from './useUser';
import { useNavigate } from 'react-router-dom';
import type { LoginData, RegisterData } from '../types/type.user';
import authService from '../../../service/authService';

export const useAuth = (): UseAuthReturn => {
  const { fetchUserData, setUser } = useUser();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const navigate = useNavigate();

  const register = async (userData: RegisterData): Promise<void> => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const data = await authService.register(userData);
      setSuccess(data.message || 'Registro exitoso. Bienvenido');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError((err as Error).message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials: LoginData): Promise<void> => {
    setLoading(true);
    setError('');

    try {
      const data = await authService.login(credentials);

      if (data.token) localStorage.setItem('token', data.token);

      setSuccess(data.message || 'Login exitoso');
      await fetchUserData();

      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } catch (err) {
      setError((err as Error).message);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  const logout = async (): Promise<void> => {
    setLoading(true);
    try {
      await authService.logout(); // Llamada al backend para limpiar la cookie
    } catch (err) {
      console.error('Error en logout:', err);
    } finally {

      localStorage.removeItem('token');
      setUser(null); 
      navigate('/login', { replace: true });
      setLoading(false);
    }
  };

  return {
    register,
    login,
    logout,
    loading,
    setLoading,
    error,
    setError,
    setSuccess,
    succes: success,
  };
};