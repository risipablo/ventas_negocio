import { useState } from 'react';
import toast from 'react-hot-toast';
import { Receipt, Percent, Divide, Weight, Copy, RotateCcw, type LucideIcon } from 'lucide-react';
import '../../styles/convertidor.css';



const TOAST_CONFIG = {
  position: 'top-center' as const,
  duration: 1500,
  style: { background: '#0C447C', color: '#fff' },
};


const parseMoney = (s: string): number | null => {
  const t = s.trim().replace(/[\s$]/g, '');
  if (!t) return null;
  let normalized = t;
  if (t.includes(',')) normalized = t.replace(/\./g, '').replace(',', '.');
  else if (/^[1-9]\d{0,2}(\.\d{3})+$/.test(t)) normalized = t.replace(/\./g, '');
  const n = Number(normalized);
  return Number.isFinite(n) ? n : null;
};


const parseDecimal = (s: string): number | null => {
  const t = s.trim().replace(/\s/g, '').replace(',', '.');
  if (!t) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
};

const fmt = (n: number) =>
  `${n < 0 ? '-' : ''}$${Math.abs(n).toLocaleString('es-AR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const KG_PRESETS = [7.5, 10, 15, 20];
const PCT_PRESETS = [10, 20, 30, 40, 50];
const IVA_PRESETS = [10.5, 21, 27];
const asText = (n: number) => String(n).replace('.', ',');

type Mode = 'add' | 'remove';



const Field = ({
  label, prefix, suffix, value, onChange, placeholder,
}: {
  label: string;
  prefix?: string;
  suffix?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) => (
  <label className="conv-field">
    <span className="conv-field__label">{label}</span>
    <span className="conv-input">
      {prefix && <i>{prefix}</i>}
      <input
        type="text"
        inputMode="decimal"
        autoComplete="off"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      {suffix && <i>{suffix}</i>}
    </span>
  </label>
);

const Segmented = ({
  value, onChange, options,
}: {
  value: Mode;
  onChange: (v: Mode) => void;
  options: { value: Mode; label: string }[];
}) => (
  <div className="conv-segmented" role="group">
    {options.map((o) => (
      <button
        key={o.value}
        type="button"
        aria-pressed={value === o.value}
        className={value === o.value ? 'is-active' : ''}
        onClick={() => onChange(o.value)}
      >
        {o.label}
      </button>
    ))}
  </div>
);

const Chips = ({
  options, isActive, onSelect, format,
}: {
  options: number[];
  isActive: (n: number) => boolean;
  onSelect: (n: number) => void;
  format: (n: number) => string;
}) => (
  <div className="conv-chips">
    {options.map((n) => (
      <button
        key={n}
        type="button"
        aria-pressed={isActive(n)}
        className={`conv-chip ${isActive(n) ? 'is-active' : ''}`}
        onClick={() => onSelect(n)}
      >
        {format(n)}
      </button>
    ))}
  </div>
);

const Result = ({ label, value }: { label: string; value: number | null }) => {
  const copy = async () => {
    if (value === null) return;
    try {
      await navigator.clipboard.writeText(value.toFixed(2));
      toast.success('Resultado copiado', TOAST_CONFIG);
    } catch {
      toast.error('No se pudo copiar', {
        ...TOAST_CONFIG,
        style: { ...TOAST_CONFIG.style, background: '#b42318' },
      });
    }
  };

  return (
    <div className="conv-result" aria-live="polite">
      <div>
        <span>{label}</span>
        <strong>{value === null ? '—' : fmt(value)}</strong>
      </div>
      <button
        type="button"
        className="conv-copy"
        onClick={copy}
        disabled={value === null}
        aria-label="Copiar resultado"
        title="Copiar resultado"
      >
        <Copy size={18} />
      </button>
    </div>
  );
};

const Breakdown = ({ rows }: { rows: [string, number | null][] }) => (
  <dl className="conv-breakdown">
    {rows.map(([k, v]) => (
      <div key={k}>
        <dt>{k}</dt>
        <dd>{v === null ? '—' : fmt(v)}</dd>
      </div>
    ))}
  </dl>
);

const Card = ({
  icon: Icon, title, hint, onReset, children,
}: {
  icon: LucideIcon;
  title: string;
  hint: string;
  onReset: () => void;
  children: React.ReactNode;
}) => (
  <section className="conv-card">
    <header className="conv-card__header">
      <span className="conv-card__icon"><Icon size={20} /></span>
      <div>
        <h3>{title}</h3>
        <p>{hint}</p>
      </div>
      <button
        type="button"
        className="conv-reset"
        onClick={onReset}
        aria-label={`Limpiar ${title}`}
        title="Limpiar"
      >
        <RotateCcw size={16} />
      </button>
    </header>
    <div className="conv-card__body">{children}</div>
  </section>
);



export function Convertidor() {
  // IVA
  const [ivaValue, setIvaValue] = useState('');
  const [ivaRate, setIvaRate] = useState('21');
  const [ivaMode, setIvaMode] = useState<Mode>('add');

  // Porcentaje
  const [pctValue, setPctValue] = useState('');
  const [pct, setPct] = useState('30');
  const [pctMode, setPctMode] = useState<Mode>('add');

  // Kilos
  const [divValue, setDivValue] = useState('');
  const [divKg, setDivKg] = useState('');
  const [mulValue, setMulValue] = useState('');
  const [mulKg, setMulKg] = useState('');

    //   iva funciones
  const ivaN = parseMoney(ivaValue);
  const ivaFactor = 1 + (parseDecimal(ivaRate) ?? 0) / 100;
  const iva =
    ivaN === null
      ? null
      : ivaMode === 'add'
        ? { neto: ivaN, total: ivaN * ivaFactor }
        : { neto: ivaN / ivaFactor, total: ivaN };
  const ivaResult = iva ? (ivaMode === 'add' ? iva.total : iva.neto) : null;

    //   porcentajes
  const pctN = parseMoney(pctValue);
  const pctFactor = 1 + (parseDecimal(pct) ?? 0) / 100;
  const pctResult =
    pctN === null ? null : pctMode === 'add' ? pctN * pctFactor : pctN / pctFactor;

  
  const divN = parseMoney(divValue);
  const divK = parseDecimal(divKg);
  const divResult = divN !== null && divK !== null && divK > 0 ? divN / divK : null;

  
  const mulN = parseMoney(mulValue);
  const mulK = parseDecimal(mulKg);
  const mulResult = mulN !== null && mulK !== null && mulK > 0 ? mulN * mulK : null;

  const resetIva = () => { setIvaValue(''); setIvaRate('21'); setIvaMode('add'); };
  const resetPct = () => { setPctValue(''); setPct('30'); setPctMode('add'); };
  const resetDiv = () => { setDivValue(''); setDivKg(''); };
  const resetMul = () => { setMulValue(''); setMulKg(''); };
  const resetAll = () => { resetIva(); resetPct(); resetDiv(); resetMul(); };

  return (
    <div className="conv-page">
      <header className="conv-header">
        <div>
          <h2>Convertidor</h2>
          <p>Calculá IVA, porcentajes y precios por kilo. El resultado se actualiza mientras escribís.</p>
        </div>
        <button type="button" className="conv-clear-all" onClick={resetAll}>
          <RotateCcw size={16} /> Limpiar todo
        </button>
      </header>

      <div className="conv-grid">
        
        <Card
          icon={Receipt}
          title="Conversión IVA"
          hint="Sumá o quitá el IVA a un precio"
          onReset={resetIva}
        >
          <Segmented
            value={ivaMode}
            onChange={setIvaMode}
            options={[
              { value: 'add', label: 'Agregar IVA' },
              { value: 'remove', label: 'Quitar IVA' },
            ]}
          />
          <Field label="Precio" prefix="$" value={ivaValue} onChange={setIvaValue} placeholder="0,00" />
          <Field label="Alícuota" suffix="%" value={ivaRate} onChange={setIvaRate} placeholder="21" />
          <Chips
            options={IVA_PRESETS}
            isActive={(n) => parseDecimal(ivaRate) === n}
            onSelect={(n) => setIvaRate(asText(n))}
            format={(n) => `${asText(n)}%`}
          />
          <Result label={ivaMode === 'add' ? 'Precio con IVA' : 'Precio sin IVA'} value={ivaResult} />
          <Breakdown
            rows={[
              ['Neto', iva ? iva.neto : null],
              ['IVA', iva ? iva.total - iva.neto : null],
              ['Total', iva ? iva.total : null],
            ]}
          />
        </Card>

        
        <Card
          icon={Percent}
          title="Conversión con porcentaje"
          hint="Aplicá o quitá un margen"
          onReset={resetPct}
        >
          <Segmented
            value={pctMode}
            onChange={setPctMode}
            options={[
              { value: 'add', label: 'Aplicar %' },
              { value: 'remove', label: 'Quitar %' },
            ]}
          />
          <Field label="Valor" prefix="$" value={pctValue} onChange={setPctValue} placeholder="0,00" />
          <Field label="Porcentaje" suffix="%" value={pct} onChange={setPct} placeholder="30" />
          <Chips
            options={PCT_PRESETS}
            isActive={(n) => parseDecimal(pct) === n}
            onSelect={(n) => setPct(String(n))}
            format={(n) => `${n}%`}
          />
          <Result
            label={pctMode === 'add' ? 'Valor con porcentaje' : 'Valor sin porcentaje'}
            value={pctResult}
          />
          <Breakdown
            rows={[
              ['Valor original', pctN],
              ['Diferencia', pctN !== null && pctResult !== null ? pctResult - pctN : null],
            ]}
          />
        </Card>

        
        <Card
          icon={Divide}
          title="División por kg"
          hint="Precio de la bolsa ÷ kilos = precio por kg"
          onReset={resetDiv}
        >
          <div className="conv-row">
            <Field label="Precio de la bolsa" prefix="$" value={divValue} onChange={setDivValue} placeholder="0,00" />
            <Field label="Kilos" suffix="kg" value={divKg} onChange={setDivKg} placeholder="Ej: 15" />
          </div>
          <Chips
            options={KG_PRESETS}
            isActive={(n) => divK === n}
            onSelect={(n) => setDivKg(asText(n))}
            format={(n) => `${asText(n)} kg`}
          />
          <Result label="Precio por kg" value={divResult} />
        </Card>

        
        <Card
          icon={Weight}
          title="Multiplicación por kg"
          hint="Precio por kg × kilos = precio de la bolsa"
          onReset={resetMul}
        >
          <div className="conv-row">
            <Field label="Precio por kg" prefix="$" value={mulValue} onChange={setMulValue} placeholder="0,00" />
            <Field label="Kilos" suffix="kg" value={mulKg} onChange={setMulKg} placeholder="Ej: 20" />
          </div>
          <Chips
            options={[20, 15, 10, 7.5]}
            isActive={(n) => mulK === n}
            onSelect={(n) => setMulKg(asText(n))}
            format={(n) => `${asText(n)} kg`}
          />
          <Result label="Precio de la bolsa" value={mulResult} />
        </Card>
      </div>
    </div>
  );
}