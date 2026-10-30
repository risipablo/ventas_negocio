import { useState, type FormEvent } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import '../../../styles/formlist.css';
import type { IProveedor } from '../types/proveedores.type';

interface Props {
  isOpen: boolean;
  onToggle: () => void;
  onAdd: (item: Omit<IProveedor, '_id' | 'userId'>) => Promise<void>;
}

const PETS = ['Perro', 'Gato', 'Mixto'];
const AGES = [
  'Adulto', 'Mini Adulto', 'Cachorro', 'Mini Puppy', 'Derma Adulto',
  'Derma Mini Adulto', 'Urinary', 'Senior', 'Criadores', 'Lata',
  'Pouch', 'Weight Control', 'Medicado'
];

const initialFormState = {
  date: '',
  proveedores: '',
  marcas: '',
  mascotas: '',
  edades: '',
  kilos: '',
  precios: 0,
};

export const ProveedorForm = ({ isOpen, onToggle, onAdd }: Props) => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(initialFormState);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'precios' ? Number(value) : value
    }));
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
      <button
        type="button"
        className="pf-toggle"
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        {isOpen ? 'Ocultar formulario' : 'Agregar nuevo proveedor'}
      </button>

   
      <div className={`pf-collapse ${isOpen ? 'is-open' : ''}`}>
        <div className="pf-inner">
          <form onSubmit={handleSubmit} className="pf-form">
            <div className="pf-row">
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="proveedores"
                value={form.proveedores}
                onChange={handleChange}
                placeholder="Nombre del proveedor"
                aria-label="Nombre del proveedor"
                required
              />
              <input
                type="text"
                name="marcas"
                value={form.marcas}
                onChange={handleChange}
                placeholder="Marca"
                aria-label="Marca"
                required
              />
              <select
                name="mascotas"
                value={form.mascotas}
                onChange={handleChange}
                aria-label="Mascota"
                required
              >
                <option value="" disabled>Seleccionar mascota</option>
                {PETS.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>

            <div className="pf-row">
              <select
                name="edades"
                value={form.edades}
                onChange={handleChange}
                aria-label="Edad"
                required
              >
                <option value="" disabled>Seleccionar edad</option>
                {AGES.map((a) => <option key={a} value={a}>{a}</option>)}
              </select>
              <input
                type="text"
                name="kilos"
                value={form.kilos}
                onChange={handleChange}
                placeholder="Unidad (kg)"
                aria-label="Unidad en kilos"
                required
              />
              <input
                type="number"
                name="precios"
                value={form.precios || ''}
                onChange={handleChange}
                placeholder="Precio"
                aria-label="Precio"
                min="0"
                required
              />
            </div>

            <div className="pf-actions">
              <button type="submit" className="pf-btn-add" disabled={loading}>
                {loading ? 'Guardando...' : 'Agregar'}
              </button>
              <button
                type="button"
                className="pf-btn-clear"
                onClick={() => { setForm(initialFormState); onToggle(); }}
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