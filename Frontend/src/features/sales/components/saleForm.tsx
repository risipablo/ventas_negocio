import { useState, type FormEvent } from 'react';
import { X, Plus, Minus, Trash2 } from 'lucide-react';
import type {
  CreateSalePayload,
  PaymentMethod,
  CardBrand,
  Sale,
} from '../types/sale.types';
import {
  toInputDate,
  todayInputDate,
  inputDateToISO,
} from '../utils/dateUtils';
import '../../../styles/form.css';

interface SaleFormProps {
  initialSale?: Sale | null;
  onSubmit: (payload: CreateSalePayload) => Promise<void>;
  onCancel?: () => void;
  mode?: 'inline' | 'modal';
}

const PAYMENT_METHODS: PaymentMethod[] = [
  'efectivo',
  'debito',
  'credito',
  'mercado pago',
  'qr',
];

const CARD_BRANDS: CardBrand[] = ['visa', 'master', 'naranja', 'cabal', 'otra', 'transferencia'];

interface DraftItem {
  product?: string;
  name: string;
  quantity: number;
  unitPrice: number;
}

const money = (n: number) => `$${n.toLocaleString('es-AR')}`;

const emptyItem = (): DraftItem => ({
  name: '',
  quantity: 1,
  unitPrice: 0,
});

export const SaleForm = ({
  initialSale,
  onSubmit,
  onCancel,
  mode = 'inline',
}: SaleFormProps) => {
  const [date, setDate] = useState(toInputDate(initialSale?.date));

  const [items, setItems] = useState<DraftItem[]>(
    initialSale?.items.map((i) => ({
      product: i.product,
      name: i.name,
      quantity: i.quantity,
      unitPrice: i.unitPrice,
    })) ?? [emptyItem()]
  );

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    initialSale?.paymentMethod ?? 'efectivo'
  );
  const [cardBrand, setCardBrand] = useState<CardBrand | ''>(
    initialSale?.cardBrand ?? ''
  );
  const [couponNumber, setCouponNumber] = useState(
    initialSale?.couponNumber ?? ''
  );
  const [numberTarget, setNumberTarget] = useState(
    initialSale?.numberTarget ?? ''
  );

  const requiresCardDetails =
    paymentMethod === 'debito' ||
    paymentMethod === 'credito' ||
    paymentMethod === 'qr';

  // const isCard = paymentMethod === 'debito' || paymentMethod === 'credito';
  const isQr = paymentMethod === 'qr';

  const addItem = () => setItems((prev) => [...prev, emptyItem()]);

  const removeItem = (index: number) =>
    setItems((prev) => prev.filter((_, i) => i !== index));

  const updateItem = (index: number, patch: Partial<DraftItem>) =>
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, ...patch } : item))
    );

  const changeQty = (index: number, delta: number) =>
    updateItem(index, {
      quantity: Math.max(1, (items[index].quantity || 1) + delta),
    });

  const clearForm = () => {
    setDate(todayInputDate());
    setItems([emptyItem()]);
    setPaymentMethod('efectivo');
    setCardBrand('');
    setCouponNumber('');
    setNumberTarget('');
  };

  const total = items.reduce((acc, i) => acc + i.quantity * i.unitPrice, 0);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const payload: CreateSalePayload = {
      date: inputDateToISO(date),
      items: items.map((i) => ({
        ...(i.product && { product: i.product }),
        name: i.name,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
      })),
      paymentMethod,
      ...(requiresCardDetails && {
        cardBrand: cardBrand ? (cardBrand as CardBrand) : undefined,
        couponNumber: couponNumber || undefined,
        numberTarget: numberTarget || undefined,
      }),
    };

    try {
      await onSubmit(payload);
      if (mode === 'inline' && !initialSale) clearForm();
    } catch {}
  };

  const content = (
    <form onSubmit={handleSubmit} className="sale-form">
      <header className="sale-form__header">
        <div className="sale-form__head-right">
          <label className="date-field">
            <span>Fecha</span>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </label>
          {mode === 'modal' && onCancel && (
            <button
              type="button"
              className="btn btn--icon"
              onClick={onCancel}
              aria-label="Cerrar"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </header>

      <div className="sale-form__layout">
        <section className="sale-form__main">
          <div className="section-title">
            <h3>Productos</h3>
            <span className="count-badge">{items.length}</span>
          </div>

          <div className="item-list">
            {items.map((item, index) => (
              <div className="item-row" key={index}>
                <input
                  className="item-row__name"
                  value={item.name}
                  onChange={(e) => updateItem(index, { name: e.target.value })}
                  placeholder="Nombre del producto"
                  aria-label="Nombre del producto"
                  required
                />

                <div className="stepper" aria-label="Cantidad">
                  <button
                    type="button"
                    onClick={() => changeQty(index, -1)}
                    aria-label="Restar"
                  >
                    <Minus size={16} />
                  </button>
                  <input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) =>
                      updateItem(index, {
                        quantity: Number(e.target.value) || 1,
                      })
                    }
                    aria-label="Cantidad"
                  />
                  <button
                    type="button"
                    onClick={() => changeQty(index, 1)}
                    aria-label="Sumar"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <label className="money-input">
                  <span>$</span>
                  <input
                    type="number"
                    min={0}
                    value={item.unitPrice}
                    onChange={(e) =>
                      updateItem(index, {
                        unitPrice: Number(e.target.value) || 0,
                      })
                    }
                    aria-label="Precio unitario"
                  />
                </label>

                <strong className="item-row__subtotal">
                  {money(item.quantity * item.unitPrice)}
                </strong>

                <button
                  type="button"
                  className="item-row__remove"
                  onClick={() => removeItem(index)}
                  disabled={items.length === 1}
                  aria-label="Quitar producto"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          <button type="button" className="add-item" onClick={addItem}>
            <Plus size={16} /> Agregar otro producto
          </button>
        </section>

        <aside className="sale-form__side">
          <fieldset>
            <legend>Método de pago</legend>
            <div className="chip-group">
              {PAYMENT_METHODS.map((method) => (
                <label key={method} className="chip">
                  <input
                    type="radio"
                    name={`paymentMethod-${mode}`}
                    value={method}
                    checked={paymentMethod === method}
                    onChange={() => setPaymentMethod(method)}
                  />
                  <span>{method}</span>
                </label>
              ))}
            </div>
          </fieldset>

          {requiresCardDetails && (
            <div className="sale-form__card">
              <fieldset>
                <legend>Tarjeta / QR</legend>
                <div className="chip-group">
                  {CARD_BRANDS.map((brand) => (
                    <label key={brand} className="chip">
                      <input
                        type="radio"
                        name={`cardBrand-${mode}`}
                        value={brand}
                        checked={cardBrand === brand}
                        onChange={() => setCardBrand(brand)}
                        required={!isQr}
                      />
                      <span>{brand}</span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <label className="field">
                N° de cupón
                <input
                  value={couponNumber}
                  onChange={(e) => setCouponNumber(e.target.value)}
                  required
                />
              </label>

              {!isQr && (
                <label className="field">
                  N° de tarjeta
                  <input
                    value={numberTarget}
                    onChange={(e) => setNumberTarget(e.target.value)}
                    required
                  />
                </label>
              )}
            </div>
          )}

          <div className="total-box">
            <span>Total a cobrar</span>
            <strong>{money(total)}</strong>
          </div>

          <div className="sale-form__actions">
            <button type="submit" className="btn btn--success btn--lg">
              Guardar venta
            </button>
            <button
              type="button"
              className="btn btn--ghost btn--lg"
              onClick={clearForm}
            >
              Limpiar
            </button>
          </div>
        </aside>
      </div>
    </form>
  );

  if (mode === 'modal') {
    return (
      <div
        className="sale-modal sale-modal--open"
        role="dialog"
        aria-modal="true"
      >
        <div className="sale-modal__backdrop" onClick={onCancel} />
        <div className="sale-modal__content">{content}</div>
      </div>
    );
  }

  return content;
};