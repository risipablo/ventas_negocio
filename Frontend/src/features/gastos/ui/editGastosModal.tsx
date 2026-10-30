import { useState, useEffect, type FormEvent } from 'react';
import { X } from 'lucide-react';
import type { IGasto, EstadoGasto } from '../types/gastos.types';
import '../../../styles/formList.css';

interface Props {
  isOpen: boolean;
  item: IGasto | null;
  onClose: () => void;
  onUpdate: (id: string, data: Partial<IGasto>) => Promise<void>;
}

const ESTADOS: EstadoGasto[] = ['pagado', 'impago', 'nota de credito'];

export const EditGastoModal = ({ isOpen, item, onClose, onUpdate }: Props) => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<Partial<IGasto>>({});

  useEffect(() => {
    if (item) {
      setForm({
        proveedor: item.proveedor,
        fecha: item.fecha.split('T')[0],
        numeroBoleta: item.numeroBoleta,
        monto: item.monto,
        estado: item.estado,
        fechaPago: item.fechaPago ? item.fechaPago.split('T')[0] : '',
      });
    }
  }, [item, isOpen]);

  if (!isOpen || !item) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: name === 'monto' ? Number(value) : value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let finalFechaPago = form.fechaPago;
      
      if (form.estado === 'pagado' && !finalFechaPago) {
        finalFechaPago = new Date().toISOString().split('T')[0];
      } else if (form.estado !== 'pagado') {
        finalFechaPago = null;
      }

      await onUpdate(item._id as string, { ...form, fechaPago: finalFechaPago });
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
      <div className="sale-modal__content" style={{ maxWidth: '700px' }}>
        <div className="sale-form" style={{ margin: 0 }}>
          <header className="sale-form__header">
            <h2>Editar Gasto</h2>
            <button type="button" className="btn btn--icon" onClick={onClose}><X size={18} /></button>
          </header>

          <form onSubmit={handleSubmit} className="pf-form" style={{ padding: 0 }}>
            <div className="pf-row">
              <input 
                type="text" 
                name="proveedor" 
                value={form.proveedor || ''} 
                onChange={handleChange} 
                placeholder="Proveedor" 
                required 
              />
              <input 
                type="date" 
                name="fecha" 
                value={form.fecha || ''} 
                onChange={handleChange} 
                required 
              />
              <input 
                type="text" 
                name="numeroBoleta" 
                value={form.numeroBoleta || ''} 
                onChange={handleChange} 
                placeholder="N° de Boleta" 
                required 
              />
            </div>

            <div className="pf-row">
              <input 
                type="number" 
                name="monto" 
                value={form.monto || ''} 
                onChange={handleChange} 
                placeholder="Monto" 
                min="0" 
                required 
              />
              <select name="estado" value={form.estado || ''} onChange={handleChange} required>
                {ESTADOS.map((e) => (
                  <option key={e} value={e}>
                    {e.charAt(0).toUpperCase() + e.slice(1)}
                  </option>
                ))}
              </select>
              
              
              <input
                type="date"
                name="fechaPago"
                value={form.fechaPago || ''}
                onChange={handleChange}
                disabled={form.estado !== 'pagado'}
                title="Fecha de pago"
                style={{ opacity: form.estado !== 'pagado' ? 0.5 : 1 }}
              />
            </div>

            <div className="pf-actions" style={{ marginTop: '16px' }}>
              <button type="submit" className="pf-btn-add" disabled={loading}>
                {loading ? 'Guardando...' : 'Guardar Cambios'}
              </button>
              <button type="button" className="pf-btn-clear" onClick={onClose}>
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};