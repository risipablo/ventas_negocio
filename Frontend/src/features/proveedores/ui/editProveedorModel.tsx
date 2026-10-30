import { useState, useEffect, type FormEvent } from 'react';
import type { IProveedor } from '../types/proveedores.type';
import {
  EditModalShell,
  EditField,
  EditModalActions,
} from '../../../components/ui/editModalShell';

interface Props {
  isOpen: boolean;
  item: IProveedor | null;
  onClose: () => void;
  onUpdate: (id: string, data: Partial<IProveedor>) => Promise<void>;
}

const PETS = ['Perro', 'Gato', 'Mixto'];
const AGES = [
  'Adulto', 'Mini Adulto', 'Cachorro', 'Mini Puppy', 'Derma Adulto',
  'Derma Mini Adulto', 'Urinary', 'Senior', 'Criadores', 'Lata',
  'Pouch', 'Weight Control', 'Medicado'
];

export const EditProveedorModal = ({ isOpen, item, onClose, onUpdate }: Props) => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<Partial<IProveedor>>({});

  useEffect(() => {
    if (item) {
      setForm({
        date: item.date,
        proveedores: item.proveedores,
        marcas: item.marcas,
        mascotas: item.mascotas,
        edades: item.edades,
        kilos: item.kilos,
        precios: item.precios,
      });
    }
  }, [item, isOpen]);

  if (!item) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'precios' ? Number(value) : value,
    }));
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
      title="Editar proveedor"
      subtitle={`${item.proveedores} · ${item.marcas}`}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="em-form">
        <div className="em-grid">

          <EditField label="Fecha">
            <input
              type="date"
              name="date"
              value={form.date || ''}
              onChange={handleChange}
              required
            />
          </EditField>
          <EditField label="Proveedor">
            <input
              type="text"
              name="proveedores"
              value={form.proveedores || ''}
              onChange={handleChange}
              placeholder="Nombre del proveedor"
              autoFocus
              required
            />
          </EditField>

          <EditField label="Marca">
            <input
              type="text"
              name="marcas"
              value={form.marcas || ''}
              onChange={handleChange}
              placeholder="Marca"
              required
            />
          </EditField>

          <EditField label="Mascota">
            <select name="mascotas" value={form.mascotas || ''} onChange={handleChange} required>
              <option value="" disabled>Seleccionar mascota</option>
              {PETS.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </EditField>

          <EditField label="Edad">
            <select name="edades" value={form.edades || ''} onChange={handleChange} required>
              <option value="" disabled>Seleccionar edad</option>
              {AGES.map((a) => <option key={a} value={a}>{a}</option>)}
            </select>
          </EditField>

          <EditField label="Unidad (kg)">
            <input
              type="text"
              name="kilos"
              value={form.kilos || ''}
              onChange={handleChange}
              placeholder="Ingresar unidad (kg)"
              required
            />
          </EditField>

          <EditField label="Precio">
            <input
              type="number"
              name="precios"
              value={form.precios || ''}
              onChange={handleChange}
              placeholder="Ingresar precio"
              min="0"
              required
            />
          </EditField>
        </div>

        <EditModalActions loading={loading} onClose={onClose} />
      </form>
    </EditModalShell>
  );
};