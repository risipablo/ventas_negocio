import { useState, useEffect, type FormEvent } from 'react';
import type { IList } from '../types/type.list';
import { EditField, EditModalActions, EditModalShell } from '../../../components/ui/editModalShell';


interface Props {
  isOpen: boolean;
  item: IList | null;
  onClose: () => void;
  onUpdate: (id: string, data: Partial<IList>) => Promise<void>;
}

const PETS = ['Perro', 'Gato', 'Mixto'];
const AGES = [
  'Adulto', 'Mini Adulto', 'Cachorro', 'Mini Puppy', 'Derma Adulto',
  'Derma Mini Adulto', 'Urinary', 'Senior', 'Criadores', 'Lata',
  'Pouch', 'Weight Control', 'Medicado'
];
const CONDITIONS = ['-', 'Efectivo', 'No actualizado', 'Discontinuado'];
const CATEGORIES = ['Alimento', 'Accesorio', 'Indumentaria', 'Húmedo', 'Snack', 'Pipeta', 'Higiene', 'Hueso'];

export const EditListModal = ({ isOpen, item, onClose, onUpdate }: Props) => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<Partial<IList>>({});

  useEffect(() => {
    if (item) {
      setForm({
        marca: item.marca,
        mascota: item.mascota,
        edad: item.edad,
        kilo: item.kilo,
        condicion: item.condicion,
        precio: item.precio,
        categoria: item.categoria,
      });
    }
  }, [item, isOpen]);

  if (!item) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
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
    <EditModalShell
      isOpen={isOpen}
      title="Editar producto"
      subtitle={`${item.marca} · ${item.mascota} · ${item.edad}`}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="em-form">
        <div className="em-grid">
          <EditField label="Marca">
            <input
              type="text"
              name="marca"
              value={form.marca || ''}
              onChange={handleChange}
              placeholder="Ingresar marca"
              autoFocus
              required
            />
          </EditField>

          <EditField label="Mascota">
            <select name="mascota" value={form.mascota || ''} onChange={handleChange} required>
              <option value="" disabled>Seleccionar mascota</option>
              {PETS.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </EditField>

          <EditField label="Edad">
            <select name="edad" value={form.edad || ''} onChange={handleChange} required>
              <option value="" disabled>Seleccionar edad</option>
              {AGES.map((a) => <option key={a} value={a}>{a}</option>)}
            </select>
          </EditField>

          <EditField label="Unidad (kg)">
            <input
              type="text"
              name="kilo"
              value={form.kilo || ''}
              onChange={handleChange}
              placeholder="Ingresar unidad (kg)"
              required
            />
          </EditField>

          <EditField label="Condición">
            <select name="condicion" value={form.condicion || ''} onChange={handleChange} required>
              <option value="" disabled>Seleccionar condición</option>
              {CONDITIONS.map((c) => (
                <option key={c} value={c}>{c === '-' ? 'Ninguno' : c}</option>
              ))}
            </select>
          </EditField>

          <EditField label="Precio">
            <input
              type="number"
              name="precio"
              value={form.precio || ''}
              onChange={handleChange}
              placeholder="Ingresar precio"
              min="0"
              required
            />
          </EditField>

          <EditField label="Categoría">
            <select name="categoria" value={form.categoria || ''} onChange={handleChange} required>
              <option value="" disabled>Seleccionar categoría</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </EditField>
        </div>

        <EditModalActions loading={loading} onClose={onClose} />
      </form>
    </EditModalShell>
  );
};