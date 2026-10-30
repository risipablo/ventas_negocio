import { useState, type FormEvent } from 'react';
import { ChevronDown, ChevronUp, UserPlus } from 'lucide-react';
import type { ICliente } from '../hooks/useClientes';
import '../../../styles/formlist.css';

interface Props {
  isOpen: boolean;
  onToggle: () => void;
  onAdd: (item: Omit<ICliente, '_id'>) => Promise<void>;
}

const initialFormState = {
  cliente: '',
  fecha: new Date().toISOString().slice(0, 10),
  producto: '',
  precio: 0,
  items: [],
};

export const ClienteForm = ({ isOpen, onToggle, onAdd }: Props) => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(initialFormState);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: name === 'precio' ? Number(value) : value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onAdd(form);
      setForm(initialFormState);
      onToggle();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pf-wrapper">
      <button type="button" className="pf-toggle" onClick={onToggle} aria-expanded={isOpen}>
        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        {isOpen ? 'Ocultar Formulario' : 'Agregar Nuevo Cliente'}
      </button>

      <div className={`pf-collapse ${!isOpen ? 'is-open' : ''}`}>
        <div className="pf-inner">
          <form onSubmit={handleSubmit} className="pf-form">
            <div className="pf-row">
              <input type="text" name="cliente" value={form.cliente} onChange={handleChange} placeholder="Cliente" required />
              <input type="date" name="fecha" value={form.fecha} onChange={handleChange} required />
              <input type="text" name="producto" value={form.producto} onChange={handleChange} placeholder="Producto" required />
              <input type="number" name="precio" value={form.precio || ''} onChange={handleChange} placeholder="Precio" min="0" required />
            </div>
            <div className="pf-actions">
              <button type="submit" className="pf-btn-add" disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {loading ? 'Guardando...' : <><UserPlus size={18} /> Agregar Cliente</>}
              </button>
              <button type="button" className="pf-btn-clear" onClick={() => { setForm(initialFormState); onToggle(); }}>
                Limpiar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};