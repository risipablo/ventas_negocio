import { useEffect, useMemo, useState, type FormEvent } from 'react';
import toast from 'react-hot-toast';
import { Trash2, Plus, Minus, Save, ShoppingCart, X } from 'lucide-react';
import '../../../styles/carrito.css';
import { useCart } from '../../../context/useCarrito.tsx';
import { useCarritosGuardados } from '../../carrito/hooks/useCarritoGuardado';

const money = (n: number) => `$${n.toLocaleString('es-AR')}`;

const TOAST_CONFIG = {
  position: 'top-center' as const,
  duration: 1500,
  style: { background: '#0C447C', color: '#fff' },
};

export const CarritoView = () => {
  const { cart, updateQuantity, removeFromCart, clearCart, cartTotal } = useCart();
  const { saveCarrito } = useCarritosGuardados();

  const [showSave, setShowSave] = useState(false);
  const [titulo, setTitulo] = useState('');
  const [saving, setSaving] = useState(false);

  
  const groups = useMemo(() => {
    const map = new Map<string, typeof cart>();
    cart.forEach((item) => {
      const key = item.proveedores?.trim() || 'Sin proveedor';
      map.set(key, [...(map.get(key) ?? []), item]);
    });
    return Array.from(map, ([proveedor, items]) => ({
      proveedor,
      items,
      units: items.reduce((acc, i) => acc + i.quantity, 0),
      subtotal: items.reduce((acc, i) => acc + i.precios * i.quantity, 0),
    }));
  }, [cart]);

  const totalUnits = groups.reduce((acc, g) => acc + g.units, 0);

  
  useEffect(() => {
    if (!showSave) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setShowSave(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [showSave]);

  const handleGuardarCarrito = async (e: FormEvent) => {
    e.preventDefault();
    const nombre = titulo.trim();
    if (!nombre || cart.length === 0) return;

    const items = cart.map((item) => ({
      productoId: item._id!,
      nombre: `${item.marcas} - ${item.mascotas} - ${item.kilos}kg`,
      cantidad: item.quantity,
      precio: item.precios,
    }));

    setSaving(true);
    try {
      await saveCarrito(nombre, {
        titulo: nombre, items, total: cartTotal,
        marcado: undefined
      });
      toast.success('Lista guardada', TOAST_CONFIG);
      clearCart();
      setShowSave(false);
      setTitulo('');
    } catch {
      toast.error('No se pudo guardar la lista', {
        ...TOAST_CONFIG,
        style: { ...TOAST_CONFIG.style, background: '#b42318' },
      });
    } finally {
      setSaving(false);
    }
  };

  const handleVaciar = () => {
    if (confirm('¿Vaciar el carrito?')) clearCart();
  };

  return (
    <div className="cart-container">
      <header className="cart-header">
        <h2 className="cart-title">Gasto de compra</h2>
        {cart.length > 0 && (
          <span className="cart-count">
            {totalUnits} {totalUnits === 1 ? 'unidad' : 'unidades'}
          </span>
        )}
      </header>

      {cart.length === 0 ? (
        <div className="cart-empty">
          <ShoppingCart size={36} />
          <p>El carrito está vacío.</p>
        </div>
      ) : (
        <div className="cart-content">
          {groups.map((group) => (
            <section className="cart-group" key={group.proveedor}>
              <div className="cart-group__head">
                <h3>{group.proveedor}</h3>
                <span className="cart-group__subtotal">
                  Subtotal <strong>{money(group.subtotal)}</strong>
                </span>
              </div>

              <div className="cart-list">
                {group.items.map((item) => (
                  <article className="cart-item" key={item._id}>
                    <div className="cart-item__info">
                      <strong className="cart-item__brand">{item.marcas}</strong>
                      <div className="cart-item__tags">
                        <span className="cart-tag">{item.edades}</span>
                        <span className="cart-tag">{item.mascotas}</span>
                        <span className="cart-tag">{item.kilos} kg</span>
                      </div>
                    </div>

                    <div className="cart-item__price">
                      <span className="cart-label">Costo</span>
                      <span>{money(item.precios)}</span>
                    </div>

                    <div className="cart-item-controls" aria-label="Cantidad">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item._id!, -1)}
                        aria-label="Restar"
                      >
                        <Minus size={14} />
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item._id!, 1)}
                        aria-label="Sumar"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <div className="cart-item__total">
                      <span className="cart-label">Precio total</span>
                      <strong>{money(item.precios * item.quantity)}</strong>
                    </div>

                    <button
                      type="button"
                      className="btn-remove"
                      onClick={() => removeFromCart(item._id!)}
                      aria-label="Quitar del carrito"
                      title="Quitar"
                    >
                      <Trash2 size={18} />
                    </button>
                  </article>
                ))}
              </div>
            </section>
          ))}

          <div className="cart-footer">
            <div className="cart-footer__total">
              <span>Total estimado</span>
              <strong>{money(cartTotal)}</strong>
            </div>

            <div className="cart-footer__actions">
              <button type="button" className="cart-save" onClick={() => setShowSave(true)}>
                <Save size={18} /> Guardar lista
              </button>
              <button type="button" className="cart-clear" onClick={handleVaciar}>
                Vaciar
              </button>
            </div>
          </div>
        </div>
      )}

      {showSave && (
        <div className="cart-modal" role="dialog" aria-modal="true" aria-labelledby="cart-save-title">
          <div className="cart-modal__backdrop" onClick={() => setShowSave(false)} />
          <form className="cart-modal__panel" onSubmit={handleGuardarCarrito}>
            <div className="cart-modal__head">
              <h3 id="cart-save-title">Guardar lista de compras</h3>
              <button
                type="button"
                className="cart-modal__close"
                onClick={() => setShowSave(false)}
                aria-label="Cerrar"
              >
                <X size={18} />
              </button>
            </div>

            <p className="cart-modal__info">
              {totalUnits} {totalUnits === 1 ? 'unidad' : 'unidades'} · {money(cartTotal)}
            </p>

            <label className="cart-modal__field">
              Título de la lista
              <input
                type="text"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Ej: Pedido semanal"
                autoFocus
                required
              />
            </label>

            <div className="cart-modal__actions">
              <button type="submit" className="cart-save" disabled={saving || !titulo.trim()}>
                {saving ? 'Guardando...' : 'Guardar'}
              </button>
              <button type="button" className="cart-modal__cancel" onClick={() => setShowSave(false)}>
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};