import { useState, useEffect, type FormEvent } from 'react';
import { X } from 'lucide-react';
import type { ICliente } from '../hooks/useClientes';
import '../../../styles/formlist.css';

interface Props {
  isOpen: boolean;
  item: ICliente | null;
  onClose: () => void;
  onUpdate: (id: string, data: Partial<ICliente>) => Promise<void>;
}

export const EditClienteModal = ({ isOpen, item, onClose, onUpdate }: Props) => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<Partial<ICliente>>({});

  useEffect(() => {
    if (item) {
      setForm({
        cliente: item.cliente,
        fecha: item.fecha.split('T')[0],
        producto: item.producto,
        precio: item.precio,
      });
    }
  }, [item, isOpen]);

  if (!isOpen || !item) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: name === 'precio' ? Number(value) : value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onUpdate(item._id as string, form);
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sale-modal sale-modal--open" role="dialog" aria-modal="true">
      <div className="sale-modal__backdrop" onClick={onClose} />
      <div className="sale-modal__content" style={{ maxWidth: '600px' }}>
        <div className="sale-form" style={{ margin: 0 }}>
          <header className="sale-form__header">
            <h2>Editar Cliente</h2>
            <button type="button" className="btn btn--icon" onClick={onClose}><X size={18} /></button>
          </header>

          <form onSubmit={handleSubmit} className="pf-form" style={{ padding: 0 }}>
            <div className="pf-row">
              <input type="text" name="cliente" value={form.cliente || ''} onChange={handleChange} placeholder="Cliente" required />
              <input type="date" name="fecha" value={form.fecha || ''} onChange={handleChange} required />
              <input type="text" name="producto" value={form.producto || ''} onChange={handleChange} placeholder="Producto" required />
              <input type="number" name="precio" value={form.precio || ''} onChange={handleChange} placeholder="Precio" min="0" required />
            </div>
            <div className="pf-actions" style={{ marginTop: '16px' }}>
              <button type="submit" className="pf-btn-add" disabled={loading}>
                {loading ? 'Guardando...' : 'Guardar Cambios'}
              </button>
              <button type="button" className="pf-btn-clear" onClick={onClose}>Cancelar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};