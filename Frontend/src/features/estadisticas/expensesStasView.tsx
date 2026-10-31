import { useMemo, useState } from 'react';
import { CalendarDays, ChevronDown, X, DollarSign, Receipt, Calculator } from 'lucide-react';
import {
  Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import '../../styles/filtersales.css';
import '../../styles/stats.css';
import type { IGasto } from '../gastos/types/gastos.types';
import {
  money, compactMoney, cap, AXIS_TICK, GRID_STROKE, useIsMobile,
  MoneyTooltip, DonutBreakdown,
} from './ui/statsShared';

interface Props {
  gastos: IGasto[];
}

const MONTHS = [
  { value: 1, label: 'Enero' }, { value: 2, label: 'Febrero' },
  { value: 3, label: 'Marzo' }, { value: 4, label: 'Abril' },
  { value: 5, label: 'Mayo' }, { value: 6, label: 'Junio' },
  { value: 7, label: 'Julio' }, { value: 8, label: 'Agosto' },
  { value: 9, label: 'Septiembre' }, { value: 10, label: 'Octubre' },
  { value: 11, label: 'Noviembre' }, { value: 12, label: 'Diciembre' },
];

/** Color por estado del gasto (se reconoce por el nombre) */
const estadoColor = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes('impag') || n.includes('pendiente')) return '#e5342f';
  if (n.includes('pagado')) return '#17803f';
  if (n.includes('credito') || n.includes('crédito')) return '#f59e0b';
  return '#1d5fc9';
};

/** "2026-10-05T00:00:00Z" -> [2026, 10, 5] (sin pasar por Date, así no se corre un día por la zona horaria) */
const ymd = (iso: string) => iso.split('T')[0].split('-').map(Number) as [number, number, number];

export const ExpensesStatsView = ({ gastos }: Props) => {
  const isMobile = useIsMobile();

  const [proveedorFilter, setProveedorFilter] = useState('');
  const [monthFilter, setMonthFilter] = useState(new Date().getMonth() + 1);
  const [yearFilter, setYearFilter] = useState(new Date().getFullYear());

  const uniqueProveedores = useMemo(
    () => Array.from(new Set(gastos.map((g) => g.proveedor))),
    [gastos]
  );

  const uniqueYears = useMemo(() => {
    const years = new Set(gastos.map((g) => ymd(g.fecha)[0]));
    return Array.from(years).sort((a, b) => b - a);
  }, [gastos]);

  const filteredGastos = useMemo(() => {
    return gastos.filter((g) => {
      const [y, m] = ymd(g.fecha);
      if (proveedorFilter && g.proveedor !== proveedorFilter) return false;
      if (m !== monthFilter || y !== yearFilter) return false;
      return true;
    });
  }, [gastos, proveedorFilter, monthFilter, yearFilter]);

  const totalGastos = useMemo(
    () => filteredGastos.reduce((acc, g) => acc + g.monto, 0),
    [filteredGastos]
  );

  const gastosPorEstado = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredGastos.forEach((g) => {
      counts[g.estado] = (counts[g.estado] || 0) + g.monto;
    });
    return Object.entries(counts).map(([name, value]) => ({ name: cap(name), value }));
  }, [filteredGastos]);

  const gastosPorDia = useMemo(() => {
    const days: Record<string, number> = {};
    filteredGastos.forEach((g) => {
      const day = g.fecha.split('T')[0];
      days[day] = (days[day] || 0) + g.monto;
    });
    return Object.keys(days)
      .sort()
      .map((day) => {
        const [, m, d] = day.split('-');
        return { date: `${d}/${m}`, total: days[day] };
      });
  }, [filteredGastos]);

  const now = new Date();
  const isDefaultFilter =
    !proveedorFilter && monthFilter === now.getMonth() + 1 && yearFilter === now.getFullYear();

  const clearFilters = () => {
    setProveedorFilter('');
    setMonthFilter(now.getMonth() + 1);
    setYearFilter(now.getFullYear());
  };

  const yAxisWidth = isMobile ? 46 : 58;

  return (
    <div className="stats-view">
      {/* ---------- Filtros ---------- */}
      <div className="filter-sales">
        <div className="filter-sales__row">
          <div className="filter-field">
            <select
              value={proveedorFilter}
              onChange={(e) => setProveedorFilter(e.target.value)}
              aria-label="Proveedor"
            >
              <option value="">Todos los proveedores</option>
              {uniqueProveedores.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
            <ChevronDown size={16} className="filter-field__icon" />
          </div>

          <div className="filter-field">
            <select
              value={monthFilter}
              onChange={(e) => setMonthFilter(Number(e.target.value))}
              aria-label="Mes"
            >
              {MONTHS.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
            </select>
            <ChevronDown size={16} className="filter-field__icon" />
          </div>

          <div className="filter-field">
            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(Number(e.target.value))}
              aria-label="Año"
            >
              {uniqueYears.length > 0 ? (
                uniqueYears.map((y) => <option key={y} value={y}>{y}</option>)
              ) : (
                <option value={now.getFullYear()}>{now.getFullYear()}</option>
              )}
            </select>
            <ChevronDown size={16} className="filter-field__icon" />
          </div>

          <button type="button" className="filter-sales__current-month" onClick={clearFilters}>
            <CalendarDays size={18} /> <span>Mes actual</span>
          </button>

          <button
            type="button"
            className="filter-sales__reset"
            onClick={clearFilters}
            disabled={isDefaultFilter}
            aria-label="Limpiar filtros"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* ---------- Tarjetas ---------- */}
      <div className="stats-dashboard">
        <div className="stats-card stats-card--accent stats-card--blue">
          <div className="stats-card__header">
            <span className="stats-card__icon"><DollarSign size={18} /></span>
            <span>Total de gastos</span>
          </div>
          <strong className="stats-card__value">{money(totalGastos)}</strong>
        </div>

        <div className="stats-card stats-card--accent stats-card--red">
          <div className="stats-card__header">
            <span className="stats-card__icon stats-card__icon--red"><Receipt size={18} /></span>
            <span>Cantidad de boletas</span>
          </div>
          <strong className="stats-card__value">{filteredGastos.length}</strong>
        </div>

        <div className="stats-card stats-card--accent stats-card--amber">
          <div className="stats-card__header">
            <span className="stats-card__icon stats-card__icon--amber"><Calculator size={18} /></span>
            <span>Promedio por boleta</span>
          </div>
          <strong className="stats-card__value">
            {money(totalGastos / (filteredGastos.length || 1))}
          </strong>
        </div>
      </div>

      {/* ---------- Gráficos ---------- */}
      <div className="stats-grid-2">
        <section className="chart-box">
          <div className="chart-box__header">
            <h3>Gastos por estado</h3>
          </div>
          <DonutBreakdown
            data={gastosPorEstado}
            colorFor={(name) => estadoColor(name)}
            centerLabel="Total gastado"
          />
        </section>

        <section className="chart-box">
          <div className="chart-box__header">
            <h3>Gastos por día</h3>
          </div>
          {gastosPorDia.length === 0 ? (
            <p className="stats-empty">Sin datos para mostrar</p>
          ) : (
            <div className="chart-canvas">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={gastosPorDia} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
                  <CartesianGrid stroke={GRID_STROKE} strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" tickLine={false} axisLine={false} tick={AXIS_TICK} />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    width={yAxisWidth}
                    tick={AXIS_TICK}
                    tickFormatter={compactMoney}
                  />
                  <Tooltip content={<MoneyTooltip />} cursor={{ fill: 'rgba(29,95,201,0.06)' }} />
                  <Bar dataKey="total" name="Gastos" fill="#1d5fc9" radius={[6, 6, 0, 0]} maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};