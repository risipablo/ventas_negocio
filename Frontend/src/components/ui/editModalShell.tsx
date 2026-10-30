import { useEffect, type ReactNode } from 'react';
import { X } from 'lucide-react';
import "../../styles/editModal.css"

interface ShellProps {
  isOpen: boolean;
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: ReactNode;
}

/** Marco común de los modales de edición: fondo, encabezado, cierre con Escape y scroll bloqueado. */
export const EditModalShell = ({ isOpen, title, subtitle, onClose, children }: ShellProps) => {
  useEffect(() => {
    if (!isOpen) return;

    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="em-overlay" role="dialog" aria-modal="true" aria-labelledby="em-title">
      <div className="em-backdrop" onClick={onClose} />

      <div className="em-panel">
        <header className="em-header">
          <div>
            <h2 id="em-title">{title}</h2>
            {subtitle && <p>{subtitle}</p>}
          </div>
          <button type="button" className="em-close" onClick={onClose} aria-label="Cerrar">
            <X size={18} />
          </button>
        </header>

        {children}
      </div>
    </div>
  );
};

/** Campo con etiqueta visible */
export const EditField = ({ label, children }: { label: string; children: ReactNode }) => (
  <label className="em-field">
    <span>{label}</span>
    {children}
  </label>
);

/** Botones del pie del modal */
export const EditModalActions = ({
  loading,
  onClose,
}: {
  loading: boolean;
  onClose: () => void;
}) => (
  <div className="em-actions">
    <button type="submit" className="em-btn em-btn--save" disabled={loading}>
      {loading ? 'Guardando...' : 'Guardar cambios'}
    </button>
    <button type="button" className="em-btn em-btn--cancel" onClick={onClose}>
      Cancelar
    </button>
  </div>
);