import { useState, useEffect, type FormEvent } from 'react';
import { X } from 'lucide-react';

import '../../../styles/formlist.css';
import type { ICarritoGuardado, ICarritoItem } from '../hooks/useCarritoGuardado';

interface Props {
  isOpen: boolean;
  carrito: ICarritoGuardado | null;
  onClose: () => void;
  onUpdate: (id: string, data: Partial<ICarritoGuardado>) => Promise<void>;
}

export const EditCarritoModal = ({ isOpen, carrito, onClose, onUpdate }: Props) => {
  const [loading, setLoading] = useState(false);
  const [titulo, setTitulo] = useState('');
  const [items, setItems] = useState<ICarritoItem[]>([]);

  useEffect(() => {
    if (carrito) {
      setTitulo(carrito.titulo);
      setItems(carrito.items);
    }
  }, [carrito, isOpen]);

  if (!isOpen || !carrito) return null;

  const handleQtyChange = (index: number, newQty: number) => {
    if (newQty < 1) return;
    setItems(prev => prev.map((item, i) => i === index ? { ...item, cantidad: newQty } : item));
  };

  const totalCalculado = items.reduce((acc, item) => acc + (item.cantidad * item.precio), 0);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onUpdate(carrito._id as string, { titulo, items, total: totalCalculado });
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
            <h2>Editar Lista Guardada</h2>
            <button type="button" className="btn btn--icon" onClick={onClose}>
              <X size={18} />
            </button>
          </header>

          <form onSubmit={handleSubmit} className="list-form" style={{ padding: 0 }}>
            <div className="list-form-row" style={{ marginBottom: '1rem' }}>
              <label style={{ width: '100%', fontWeight: 'bold' }}>
                Título de la Lista
                <input
                  type="text"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  required
                  style={{ width: '100%', marginTop: '6px' }}
                />
              </label>
            </div>

            <div style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid #eee', padding: '10px', borderRadius: '8px' }}>
              <table style={{ width: '100%', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #ddd', textAlign: 'left' }}>
                    <th style={{ padding: '8px' }}>Producto</th>
                    <th style={{ padding: '8px' }}>Cant.</th>
                    <th style={{ padding: '8px' }}>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #f9f9f9' }}>
                      <td style={{ padding: '8px' }}>{item.nombre}</td>
                      <td style={{ padding: '8px' }}>
                        <input
                          type="number"
                          min={1}
                          value={item.cantidad}
                          onChange={(e) => handleQtyChange(i, Number(e.target.value))}
                          style={{ width: '60px', padding: '4px' }}
                        />
                      </td>
                      <td style={{ padding: '8px', fontWeight: 'bold' }}>${item.cantidad * item.precio}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ textAlign: 'right', marginTop: '1rem', fontSize: '1.2rem', fontWeight: 'bold' }}>
              Total: ${totalCalculado}
            </div>

            <div className="sale-form__actions" style={{ marginTop: '16px' }}>
              <button type="submit" className="btn btn--success btn--lg" disabled={loading}>
                {loading ? 'Guardando...' : 'Guardar Cambios'}
              </button>
              <button type="button" className="btn btn--ghost btn--lg" onClick={onClose}>
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};