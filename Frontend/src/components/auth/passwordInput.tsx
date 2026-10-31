import { Eye, EyeClosed, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import type { PasswordInputProps } from '../../features/auth/types/type.user';

type Strength = {
  score: number;
  label: 'Débil' | 'Media' | 'Fuerte';
  level: 'weak' | 'medium' | 'strong';
};

const getStrength = (password: string): Strength | null => {
  if (!password) return null;

  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score >= 5) return { score, label: 'Fuerte', level: 'strong' };
  if (score >= 3) return { score, label: 'Media', level: 'medium' };
  return { score, label: 'Débil', level: 'weak' };
};

// Props que ya tenías + las que usa el nuevo diseño (todas opcionales)
type Props = PasswordInputProps & {
  label?: string;
  autoComplete?: string;
  delay?: number; // retraso de la animación de entrada (segundos)
};

export const PasswordInput = ({
  onChange,
  value,
  placeholder,
  name = 'password',
  required = true,
  showStrength = false,
  label,
  autoComplete,
  delay = 0,
}: Props) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const strength = useMemo(
    () => (showStrength ? getStrength(value) : null),
    [value, showStrength]
  );

  const inputId = `pw-${name}`;

  return (
    <motion.div
      className="auth-field"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35 }}
    >
      {label && <label htmlFor={inputId}>{label}</label>}

      <div className="auth-input">
        <Lock size={18} className="auth-input__icon" aria-hidden="true" />

        <input
          id={inputId}
          type={showPassword ? 'text' : 'password'}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          autoComplete={autoComplete}
        />

        <button
          type="button"
          className="auth-input__toggle"
          onClick={() => setShowPassword((v) => !v)}
          aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          aria-pressed={showPassword}
        >
          {showPassword ? <Eye size={18} /> : <EyeClosed size={18} />}
        </button>
      </div>

      {strength && (
        <div className={`auth-strength auth-strength--${strength.level}`} aria-live="polite">
          <div className="auth-strength__bar" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <span className="auth-strength__label">{strength.label}</span>
        </div>
      )}

      {strength?.level === 'weak' && (
        <p className="auth-hint">Use 8 o más caracteres, con mayúsculas, números y símbolos.</p>
      )}
    </motion.div>
  );
};