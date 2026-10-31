import { useState, useEffect, type FormEvent } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { IList } from '../types/type.list';
import '../../../styles/formlist.css';

interface Props {
  isOpen: boolean;
  onToggle: () => void;
  initialData?: IList | null;
  onCancel: () => void;
  onAdd?: (item: Omit<IList, '_id'>) => Promise<void>;
  onUpdate?: (id: string, data: Partial<IList>) => Promise<void>;
}

const PETS = ['Perro', 'Gato', 'Mixto'];
const AGES = [
  'Adulto', 'Mini Adulto', 'Cachorro', 'Mini Puppy', 'Derma Adulto',
  'Derma Mini Adulto', 'Urinary', 'Senior', 'Criadores', 'Lata',
  'Pouch', 'Weight Control', 'Medicado'
];
const CONDITIONS = ['-', 'Efectivo', 'No actualizado', 'Discontinuado'];
const CATEGORIES = ['Alimento', 'Accesorio', 'Indumentaria', 'Húmedo', 'Snack', 'Pipeta', 'Higiene', 'Hueso'];

const initialFormState = {
  marca: '',
  mascota: '',
  edad: '',
  kilo: '',
  condicion: '',
  precio: '',
  categoria: ''
};

export const ListForm = ({
  isOpen,
  onToggle,
  initialData,
  onCancel,
  onAdd,
  onUpdate,
}: Props) => {
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(initialFormState);

  useEffect(() => {
    if (initialData) {
      setForm({
        marca: initialData.marca,
        mascota: initialData.mascota,
        edad: initialData.edad,
        kilo: initialData.kilo,
        condicion: initialData.condicion,
        precio: initialData.precio,
        categoria: initialData.categoria,
      });
    } else {
      setForm(initialFormState);
    }
  }, [initialData, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (initialData && initialData._id && onUpdate) {
        await onUpdate(initialData._id, form);
      } else if (onAdd) {
        await onAdd(form);
      }
      setForm(initialFormState);
      onCancel();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setForm(initialFormState);
    onCancel();
  };

  return (
    <div className="pf-wrapper">
      {!initialData && (
        <button
          type="button"
          className="pf-toggle"
          onClick={onToggle}
          aria-expanded={isOpen}
        >
          {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          {isOpen ? 'Ocultar Formulario' : 'Agregar Nuevo Producto'}
        </button>
      )}

      <div className={`pf-collapse ${!isOpen ? 'is-open' : ''}`}>
        <div className="pf-inner">
          <form onSubmit={handleSubmit} className="pf-form">
            <div className="pf-row">
              <input
                type="text"
                name="marca"
                value={form.marca}
                onChange={handleChange}
                placeholder="Ingresar Marca"
                required
              />

              <select name="mascota" value={form.mascota} onChange={handleChange} required>
                <option value="" disabled>Seleccionar Mascota</option>
                {PETS.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>

              <select name="edad" value={form.edad} onChange={handleChange} required>
                <option value="" disabled>Seleccionar Edad</option>
                {AGES.map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>

            <div className="pf-row">
              <input
                type="text"
                name="kilo"
                value={form.kilo}
                onChange={handleChange}
                placeholder="Ingresar Unidad (Kg)"
                required
              />

              <select name="condicion" value={form.condicion || ''} onChange={handleChange} required>
                <option value="" disabled>Seleccionar Condición</option>
                {CONDITIONS.map((c) => (
                  <option key={c} value={c}>
                    {c === '-' ? 'Ninguno' : c}
                  </option>
                ))}
              </select>

              <input
                type="number"
                name="precio"
                value={form.precio}
                onChange={handleChange}
                placeholder="Ingresar Precio"
                min="0"
                required
              />

              <select name="categoria" value={form.categoria} onChange={handleChange} required>
                <option value="" disabled>Seleccionar Categoría</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="pf-actions">
              <button type="submit" className="pf-btn-add" disabled={loading}>
                {loading ? 'Guardando...' : initialData ? 'Actualizar' : 'Agregar'}
              </button>
              <button type="button" className="pf-btn-clear" onClick={handleCancel}>
                {initialData ? 'Cancelar' : 'Limpiar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};