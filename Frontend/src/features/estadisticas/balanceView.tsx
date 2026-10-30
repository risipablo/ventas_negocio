import { useMemo, useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { ChevronDown, TrendingUp, TrendingDown, Scale } from 'lucide-react';
import {
  BarChart, Bar, Cell, CartesianGrid, ResponsiveContainer, Tooltip, Legend,
  XAxis, YAxis, ReferenceLine,
} from 'recharts';
import '../../styles/filterSales.css';
import '../../styles/stats.css';
import type { Sale } from '../sales/types/sale.types';
import type { IGasto } from '../gastos/types/gastos.types';
import {
  money, compactMoney, AXIS_TICK, GRID_STROKE, useIsMobile, MoneyTooltip,
} from './ui/statsShared';

interface Props {
  sales: Sale[];
  gastos: IGasto[];
}

const MONTHS = [
  { value: '01', label: 'Enero' }, { value: '02', label: 'Febrero' },
  { value: '03', label: 'Marzo' }, { value: '04', label: 'Abril' },
  { value: '05', label: 'Mayo' }, { value: '06', label: 'Junio' },
  { value: '07', label: 'Julio' }, { value: '08', label: 'Agosto' },
  { value: '09', label: 'Septiembre' }, { value: '10', label: 'Octubre' },
  { value: '11', label: 'Noviembre' }, { value: '12', label: 'Diciembre' },
];

export const BalanceView = ({ sales, gastos }: Props) => {
  const isMobile = useIsMobile();

  const [monthFilter, setMonthFilter] = useState('');
  const [yearFilter, setYearFilter] = useState(new Date().getFullYear().toString());

  const balanceMensual = useMemo(() => {
    const months = Array.from({ length: 12 }, (_, i) => ({
      name: format(new Date(2024, i, 1), 'MMM', { locale: es }),
      monthNumber: String(i + 1).padStart(2, '0'),
      ventas: 0,
      gastos: 0,
      balance: 0,
    }));

    sales.forEach((sale) => {
      if (sale.date.startsWith(yearFilter)) {
        const m = parseInt(sale.date.split('-')[1], 10) - 1;
        if (m >= 0 && m < 12) months[m].ventas += sale.total;
      }
    });

    gastos.forEach((gasto) => {
      if (gasto.fecha.startsWith(yearFilter) && gasto.estado !== 'nota de credito') {
        const m = parseInt(gasto.fecha.split('-')[1], 10) - 1;
        if (m >= 0 && m < 12) months[m].gastos += gasto.monto;
      }
    });

    months.forEach((m) => { m.balance = m.ventas - m.gastos; });
    return months;
  }, [sales, gastos, yearFilter]);

  const filteredBalance = useMemo(() => {
    if (!monthFilter) return balanceMensual;
    return balanceMensual.filter((m) => m.monthNumber === monthFilter);
  }, [balanceMensual, monthFilter]);

  const totalVentas = filteredBalance.reduce((acc, m) => acc + m.ventas, 0);
  const totalGastos = filteredBalance.reduce((acc, m) => acc + m.gastos, 0);
  const balanceTotal = totalVentas - totalGastos;
  const positive = balanceTotal >= 0;

  const yAxisWidth = isMobile ? 46 : 58;

  return (
    <div className="stats-view">
      {/* ---------- Filtros ---------- */}
      <div className="filter-sales">
        <div className="filter-sales__row">
          <div className="filter-field">
            <select value={monthFilter} onChange={(e) => setMonthFilter(e.target.value)} aria-label="Mes">
              <option value="">Todos los meses</option>
              {MONTHS.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
            </select>
            <ChevronDown size={16} className="filter-field__icon" />
          </div>

          <div className="filter-field">
            <select value={yearFilter} onChange={(e) => setYearFilter(e.target.value)} aria-label="Año">
              {[2024, 2025, 2026].map((y) => (
                <option key={y} value={y.toString()}>{y}</option>
              ))}
            </select>
            <ChevronDown size={16} className="filter-field__icon" />
          </div>
        </div>
      </div>

      {/* ---------- Tarjetas ---------- */}
      <div className="stats-dashboard">
        <div className="stats-card stats-card--accent stats-card--green">
          <div className="stats-card__header">
            <span className="stats-card__icon stats-card__icon--green"><TrendingUp size={18} /></span>
            <span>Ingresos por ventas</span>
          </div>
          <strong className="stats-card__value stats-card__value--green">{money(totalVentas)}</strong>
        </div>

        <div className="stats-card stats-card--accent stats-card--red">
          <div className="stats-card__header">
            <span className="stats-card__icon stats-card__icon--red"><TrendingDown size={18} /></span>
            <span>Egresos por gastos</span>
          </div>
          <strong className="stats-card__value stats-card__value--red">{money(totalGastos)}</strong>
        </div>

        <div className={`stats-card stats-card--accent ${positive ? 'stats-card--blue' : 'stats-card--orange'}`}>
          <div className="stats-card__header">
            <span className={`stats-card__icon ${positive ? '' : 'stats-card__icon--orange'}`}>
              <Scale size={18} />
            </span>
            <span>Balance neto</span>
          </div>
          <strong className={`stats-card__value ${positive ? 'stats-card__value--blue' : 'stats-card__value--orange'}`}>
            {money(balanceTotal)}
          </strong>
        </div>
      </div>

      {/* ---------- Comparativa ---------- */}
      <section className="chart-box">
        <div className="chart-box__header">
          <h3>Ventas vs gastos ({yearFilter})</h3>
        </div>

        {/* En pantallas chicas el año completo se desplaza hacia los costados */}
        <div className="chart-scroll">
          <div className={`chart-canvas ${!monthFilter ? 'chart-canvas--wide' : ''}`}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={filteredBalance}
                margin={{ top: 16, right: 12, left: 0, bottom: 0 }}
                barGap={2}
              >
                <CartesianGrid stroke={GRID_STROKE} strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} tick={AXIS_TICK} />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  width={yAxisWidth}
                  tick={AXIS_TICK}
                  tickFormatter={compactMoney}
                />
                <Tooltip content={<MoneyTooltip />} cursor={{ fill: 'rgba(29,95,201,0.06)' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
                <ReferenceLine y={0} stroke="#c9d1e0" />
                <Bar dataKey="ventas" name="Ventas" fill="#17803f" radius={[4, 4, 0, 0]} maxBarSize={28} />
                <Bar dataKey="gastos" name="Gastos" fill="#e5342f" radius={[4, 4, 0, 0]} maxBarSize={28} />
                <Bar dataKey="balance" name="Balance" fill="#1d5fc9" radius={[4, 4, 0, 0]} maxBarSize={28}>
                  {filteredBalance.map((m, i) => (
                    <Cell key={i} fill={m.balance >= 0 ? '#1d5fc9' : '#e65100'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>
    </div>
  );
};