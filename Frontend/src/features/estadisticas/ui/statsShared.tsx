import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

export const money = (n: number) => `$${Math.round(n).toLocaleString('es-AR')}`;


export const compactMoney = (n: number) => {
  const abs = Math.abs(n);
  const sign = n < 0 ? '-' : '';
  if (abs >= 1_000_000) return `${sign}$${(abs / 1_000_000).toFixed(1).replace('.', ',')}M`;
  if (abs >= 1_000) return `${sign}$${Math.round(abs / 1_000)}k`;
  return `${sign}$${abs}`;
};

export const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export const AXIS_TICK = { fontSize: 12, fill: '#5b6475' };
export const GRID_STROKE = '#e6eaf2';


export const useIsMobile = (breakpoint = 640) => {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.innerWidth <= breakpoint
  );

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const onChange = () => setIsMobile(mq.matches);
    onChange();
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [breakpoint]);

  return isMobile;
};


export const MoneyTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: any[];
  label?: string | number;
}) => {
  if (!active || !payload?.length) return null;

  const title = label ?? payload[0].name;
  const quantity = payload[0].payload?.quantity;

  return (
    <div className="chart-tip">
      {title !== undefined && <p className="chart-tip__title">{String(title)}</p>}
      {payload.map((entry, i) => (
        <p className="chart-tip__row" key={i}>
          <span
            className="chart-tip__dot"
            style={{ background: entry.color || entry.payload?.fill || entry.fill }}
          />
          {entry.name !== title && <span>{entry.name}</span>}
          <strong>{money(Number(entry.value ?? 0))}</strong>
        </p>
      ))}
      {quantity !== undefined && (
        <p className="chart-tip__extra">
          {quantity} {quantity === 1 ? 'unidad' : 'unidades'}
        </p>
      )}
    </div>
  );
};

interface Slice {
  name: string;
  value: number;
}

const RAD = Math.PI / 180;

/** Monto dentro de cada porción de la dona (solo si la porción es lo bastante grande) */
const renderSliceLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, value, percent }: any) => {
  if (percent < 0.12) return null;
  const r = innerRadius + (outerRadius - innerRadius) / 2;
  const x = cx + r * Math.cos(-midAngle * RAD);
  const y = cy + r * Math.sin(-midAngle * RAD);
  return (
    <text
      x={x}
      y={y}
      fill="#fff"
      textAnchor="middle"
      dominantBaseline="central"
      style={{ fontSize: 11, fontWeight: 600, pointerEvents: 'none' }}
    >
      {compactMoney(value)}
    </text>
  );
};

/** Gráfico de dona con el total en el centro y el detalle (monto + %) al lado */
export const DonutBreakdown = ({
  data,
  colorFor,
  centerLabel = 'Total',
}: {
  data: Slice[];
  colorFor: (name: string, index: number) => string;
  centerLabel?: string;
}) => {
  const rows = [...data].filter((d) => d.value > 0).sort((a, b) => b.value - a.value);
  const total = rows.reduce((acc, d) => acc + d.value, 0);

  if (rows.length === 0) {
    return <p className="stats-empty">Sin datos para mostrar</p>;
  }

  return (
    <div className="donut">
      <div className="donut__chart">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={rows}
              dataKey="value"
              nameKey="name"
              innerRadius="55%"
              outerRadius="94%"
              paddingAngle={rows.length > 1 ? 3 : 0}
              stroke="none"
              label={renderSliceLabel}
              labelLine={false}
            >
              {rows.map((d, i) => (
                <Cell key={d.name} fill={colorFor(d.name, i)} />
              ))}
            </Pie>
            <Tooltip content={<MoneyTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        <div className="donut__center">
          <span>{centerLabel}</span>
          <strong>{money(total)}</strong>
        </div>
      </div>

      <ul className="donut__legend">
        {rows.map((d, i) => {
          const pct = (d.value / total) * 100;
          return (
            <li key={d.name}>
              <span className="donut__dot" style={{ background: colorFor(d.name, i) }} />
              <span className="donut__name">{d.name}</span>
              <strong className="donut__amount">{money(d.value)}</strong>
              <span className="donut__pct">{pct.toFixed(pct < 10 ? 1 : 0)}%</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};