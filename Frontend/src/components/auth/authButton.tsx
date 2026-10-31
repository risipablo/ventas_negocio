import { motion } from 'framer-motion';
import type { AuthButtonProps } from '../../features/auth/types/type.user';

export const AuthButton = ({
  loading,
  text,
  type = 'submit',
}: AuthButtonProps) => {
  return (
    <motion.button
      type={type}
      className="auth-btn"
      disabled={loading}
      aria-busy={loading}
      whileHover={loading ? undefined : { scale: 1.02 }}
      whileTap={loading ? undefined : { scale: 0.98 }}
    >
      {loading ? (
        <span className="button-loading">
          Cargando
          <span className="loading-dots" aria-hidden="true">
            <span></span>
            <span></span>
            <span></span>
          </span>
        </span>
      ) : (
        text
      )}
    </motion.button>
  );
};