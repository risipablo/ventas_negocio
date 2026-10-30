import { useState, type FormEvent } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { IGasto, EstadoGasto } from '../types/gastos.types';

interface Props {
  isOpen: boolean;
  onToggle: () => void;
  onAdd: (item: Omit<IGasto, '_id'>) => Promise<void>;
}

const ESTADOS: EstadoGasto[] = ['pagado', 'impago', 'nota de credito'];

const initialFormState = {
  proveedor: '',
  fecha: new Date().toISOString().slice(0, 10),
  numeroBoleta: '',
  monto: 0,
  estado: 'impago' as EstadoGasto,
};

export const GastoForm = ({ isOpen, onToggle, onAdd }: Props) => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(initialFormState);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ 
      ...prev, 
      [name]: name === 'monto' ? Number(value) : value 
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const pagoDate = form.estado === 'pagado' ? new Date().toISOString() : null;
      await onAdd({ ...form, fechaPago: pagoDate });
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
      <button
        type="button"
        className="pf-toggle"
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        {isOpen ? 'Ocultar Formulario' : 'Registrar Nuevo Gasto'}
      </button>

      <div className={`pf-collapse ${isOpen ? 'is-open' : ''}`}>
        <div className="pf-inner">
          <form onSubmit={handleSubmit} className="pf-form">
            <div className="pf-row">
              <input
                type="text"
                name="proveedor"
                value={form.proveedor}
                onChange={handleChange}
                placeholder="Ingresar Proveedor"
                required
              />

              <input
                type="date"
                name="fecha"
                value={form.fecha}
                onChange={handleChange}
                required
              />

              <input
                type="text"
                name="numeroBoleta"
                value={form.numeroBoleta}
                onChange={handleChange}
                placeholder="Ingresar N° de Boleta"
                required
              />
            </div>

            <div className="pf-row">
              <input
                type="number"
                name="monto"
                value={form.monto || ''}
                onChange={handleChange}
                placeholder="Ingresar Monto"
                min="0"
                required
              />

              <select name="estado" value={form.estado} onChange={handleChange} required>
                {ESTADOS.map((e) => (
                  <option key={e} value={e}>
                    {e.charAt(0).toUpperCase() + e.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="pf-actions">
              <button type="submit" className="pf-btn-add" disabled={loading}>
                {loading ? 'Guardando...' : 'Agregar'}
              </button>
              <button
                type="button"
                className="pf-btn-clear"
                onClick={() => {
                  setForm(initialFormState);
                  onToggle();
                }}
              >
                Limpiar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};