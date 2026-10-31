import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, AlertCircle } from 'lucide-react';
import { AuthLayout } from '../../components/auth/authLayout';
import { PasswordInput } from '../../components/auth/passwordInput';
import { AuthButton } from '../../components/auth/authButton';
import type { AuthenticatedProps } from '../../features/auth/types/type.auth';
import type { LoginData } from '../../features/auth/types/type.user';
import { useAuth } from '../../features/auth/hooks/useAuth';

export const LoginPage = ({ setIsAuthenticated }: AuthenticatedProps) => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const [formData, setFormData] = useState<LoginData>({
    email: '',
    password: '',
  });

  const { login, loading, error } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    try {
      await login(formData);
      setIsAuthenticated(true);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      console.error('Error during login:', err);
    }
  };

  return (
    <AuthLayout title="Iniciar Sesión">
      <title>Inicia Sesión</title>

      <motion.form
        className="auth-form"
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="auth-field">
          <label htmlFor="email">Correo electrónico</label>
          <div className="auth-input">
            <Mail size={18} className="auth-input__icon" aria-hidden="true" />
            <input
              id="email"
              type="email"
              name="email"
              placeholder="Ingrese Correo electrónico"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              autoFocus
              required
            />
          </div>
        </div>

        <PasswordInput
          label="Contraseña"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Ingrese Contraseña"
          autoComplete="current-password"
          delay={0.15}
        />

        

        {error && (
          <motion.p
            role="alert"
            className="auth-message auth-message--error"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            <AlertCircle size={16} aria-hidden="true" />
            <span>{error}</span>
          </motion.p>
        )}

        <AuthButton loading={loading} text="Iniciar Sesión" />
      </motion.form>

      <motion.div
        className="auth-footer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="auth-divider">
          <span>o</span>
        </div>

        
      </motion.div>
    </AuthLayout>
  );
};