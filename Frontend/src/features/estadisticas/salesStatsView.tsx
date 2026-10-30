import { useMemo, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Cell, LabelList,
} from 'recharts';
import {
  Search, CalendarDays, X, ChevronDown, BarChart2, TrendingUp, DollarSign,
  ListOrdered, ArrowUpRight, ArrowDownRight,
} from 'lucide-react';
import '../../styles/filterSales.css';
import '../../styles/stats.css';
import type { PaymentMethod, Sale } from '../sales/types/sale.types';
import { useSalesStats } from './hooks/useSaleStats';
import {
  money, compactMoney, cap, AXIS_TICK, GRID_STROKE, useIsMobile,
  MoneyTooltip, DonutBreakdown,
} from './ui/statsShared';

interface Props {
  sales: Sale[];
}

const PAY_COLORS: Record<string, string> = {
  efectivo: '#17803f',
  debito: '#1d5fc9',
  credito: '#6b2fc0',
  'mercado pago': '#f59e0b',
  qr: '#0c447c',
};
const normalize = (s: string) =>
  s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
const payColor = (name: string, i: number) =>
  PAY_COLORS[normalize(name)] ?? ['#e5342f', '#0891b2', '#64748b'][i % 3];

const MONTHS = [
  { value: '01', label: 'Enero' }, { value: '02', label: 'Febrero' },
  { value: '03', label: 'Marzo' }, { value: '04', label: 'Abril' },
  { value: '05', label: 'Mayo' }, { value: '06', label: 'Junio' },
  { value: '07', label: 'Julio' }, { value: '08', label: 'Agosto' },
  { value: '09', label: 'Septiembre' }, { value: '10', label: 'Octubre' },
  { value: '11', label: 'Noviembre' }, { value: '12', label: 'Diciembre' },
];

const PAYMENT_METHODS: { value: PaymentMethod; label: string }[] = [
  { value: 'efectivo', label: 'Efectivo' },
  { value: 'debito', label: 'Débito' },
  { value: 'credito', label: 'Crédito' },
  { value: 'mercado pago', label: 'Mercado Pago' },
  { value: 'qr', label: 'QR' },
];

const PAYMENT_LABEL: Record<string, string> = Object.fromEntries(
  PAYMENT_METHODS.map((p) => [p.value, p.label])
);

const PRODUCT_LIMIT = 8;

export const SalesStatsView = ({ sales }: Props) => {
  const isMobile = useIsMobile();

  const [query, setQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [monthFilter, setMonthFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');
  const [showAllProducts, setShowAllProducts] = useState(false);

  const filteredSales = useMemo(() => {
    return sales.filter((sale) => {
      const saleDate = sale.date.split('T')[0];
      const [year, month, day] = saleDate.split('-');

      if (query && !sale.items.some((i) => i.name.toLowerCase().includes(query.toLowerCase()))) return false;
      if (dateFilter && day !== dateFilter) return false;
      if (monthFilter && month !== monthFilter) return false;
      if (yearFilter && year !== yearFilter) return false;
      if (paymentFilter && sale.paymentMethod !== paymentFilter) return false;

      return true;
    });
  }, [sales, query, dateFilter, monthFilter, yearFilter, paymentFilter]);

  const { salesByMonth, currentMonthVsPrevious } = useSalesStats(filteredSales);

  // Totales para las tarjetas superiores
  const dashboardStats = useMemo(() => {
    let totalMes = 0;
    let totalProductos = 0;
    const productsMap: Record<string, { quantity: number; total: number }> = {};

    filteredSales.forEach((sale) => {
      totalMes += sale.total;

      sale.items.forEach((item) => {
        totalProductos += item.quantity;
        const name = item.name.toLowerCase();
        if (!productsMap[name]) productsMap[name] = { quantity: 0, total: 0 };
        productsMap[name].quantity += item.quantity;
        productsMap[name].total += item.quantity * item.unitPrice;
      });
    });

    const topProductsDashboard = Object.entries(productsMap)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    return { totalMes, totalProductos, topProductsDashboard };
  }, [filteredSales]);

  // Total vendido por método de pago (calculado sobre las ventas filtradas)
  const paymentData = useMemo(() => {
    const map: Record<string, number> = {};
    filteredSales.forEach((sale) => {
      map[sale.paymentMethod] = (map[sale.paymentMethod] || 0) + sale.total;
    });
    return Object.entries(map)
      .map(([method, value]) => ({ name: PAYMENT_LABEL[method] ?? cap(method), value }))
      .sort((a, b) => b.value - a.value);
  }, [filteredSales]);

  const maxQty = Math.max(1, ...dashboardStats.topProductsDashboard.map((p) => p.quantity));

  // Todos los productos, ordenados por monto
  const allProducts = useMemo(() => {
    const productsMap: Record<string, { quantity: number; total: number }> = {};
    filteredSales.forEach((sale) => {
      sale.items.forEach((item) => {
        const name = item.name.toLowerCase();
        if (!productsMap[name]) productsMap[name] = { quantity: 0, total: 0 };
        productsMap[name].quantity += item.quantity;
        productsMap[name].total += item.quantity * item.unitPrice;
      });
    });
    return Object.entries(productsMap)
      .map(([name, data]) => ({ name: cap(name), ...data }))
      .sort((a, b) => b.total - a.total);
  }, [filteredSales]);

  const visibleProducts = showAllProducts ? allProducts : allProducts.slice(0, PRODUCT_LIMIT);
  const productChartHeight = Math.max(220, visibleProducts.length * (isMobile ? 42 : 38) + 24);

  // Comparación con el mes anterior:
  //  - si hay un mes filtrado: ese mes vs el mes anterior a él
  //  - si no: el mes actual vs el anterior (como calcula el hook)
  // Respeta el buscador y el método de pago, pero compara meses completos.
  const filteredMonthLabel = useMemo(() => {
    if (!monthFilter) return null;
    const year = yearFilter ? Number(yearFilter) : new Date().getFullYear();
    const month = Number(monthFilter);
    const prev = month === 1 ? { year: year - 1, month: 12 } : { year, month: month - 1 };
    const short = (m: number) => MONTHS[m - 1].label.slice(0, 3);
    return {
      current: { year, month, name: `${short(month)} ${year}` },
      previous: { ...prev, name: `${short(prev.month)} ${prev.year}` },
    };
  }, [monthFilter, yearFilter]);

  const comparison = useMemo(() => {
    if (!filteredMonthLabel) return currentMonthVsPrevious ?? [];

    const base = sales.filter((sale) => {
      if (query && !sale.items.some((i) => i.name.toLowerCase().includes(query.toLowerCase()))) return false;
      if (paymentFilter && sale.paymentMethod !== paymentFilter) return false;
      return true;
    });

    const totalOf = (year: number, month: number) =>
      base.reduce((acc, sale) => {
        const [y, m] = sale.date.split('T')[0].split('-').map(Number);
        return y === year && m === month ? acc + sale.total : acc;
      }, 0);

    const { current, previous } = filteredMonthLabel;
    return [
      { name: previous.name, total: totalOf(previous.year, previous.month) },
      { name: current.name, total: totalOf(current.year, current.month) },
    ];
  }, [filteredMonthLabel, currentMonthVsPrevious, sales, query, paymentFilter]);

  const [prevMonth, currMonth] = comparison;
  const delta =
    prevMonth && currMonth && prevMonth.total > 0
      ? ((currMonth.total - prevMonth.total) / prevMonth.total) * 100
      : null;

  const hasFilters = !!(query || dateFilter || monthFilter || yearFilter || paymentFilter);

  const clearFilters = () => {
    setQuery('');
    setDateFilter('');
    setMonthFilter('');
    setYearFilter('');
    setPaymentFilter('');
  };

  const showCurrentMonth = () => {
    const fecha = new Date();
    setMonthFilter(String(fecha.getMonth() + 1).padStart(2, '0'));
    setDateFilter('');
    setYearFilter('');
    setPaymentFilter('');
    setQuery('');
  };

  const yAxisWidth = isMobile ? 46 : 58;

  return (
    <div className="stats-view">
      {/* ---------- Filtros ---------- */}
      <div className="filter-sales">
        <div className="filter-sales__row">
          <div className="filter-field filter-field--search">
            <input
              type="text"
              placeholder="Buscar producto..."
              aria-label="Buscar producto"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Search size={16} className="filter-field__icon" />
          </div>

          <div className="filter-field">
            <select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} aria-label="Día">
              <option value="">Día</option>
              {Array.from({ length: 31 }, (_, i) => (
                <option key={i} value={String(i + 1).padStart(2, '0')}>{i + 1}</option>
              ))}
            </select>
            <ChevronDown size={16} className="filter-field__icon" />
          </div>

          <div className="filter-field">
            <select value={monthFilter} onChange={(e) => setMonthFilter(e.target.value)} aria-label="Mes">
              <option value="">Mes</option>
              {MONTHS.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
            </select>
            <ChevronDown size={16} className="filter-field__icon" />
          </div>

          <div className="filter-field">
            <select value={yearFilter} onChange={(e) => setYearFilter(e.target.value)} aria-label="Año">
              <option value="">Año</option>
              {[2024, 2025, 2026, 2027, 2028].map((y) => (
                <option key={y} value={y.toString()}>{y}</option>
              ))}
            </select>
            <ChevronDown size={16} className="filter-field__icon" />
          </div>

          <div className="filter-field">
            <select value={paymentFilter} onChange={(e) => setPaymentFilter(e.target.value)} aria-label="Método de pago">
              <option value="">Método de pago</option>
              {PAYMENT_METHODS.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
            </select>
            <ChevronDown size={16} className="filter-field__icon" />
          </div>

          <button type="button" className="filter-sales__current-month" onClick={showCurrentMonth}>
            <CalendarDays size={18} /> <span>Mes actual</span>
          </button>

          <button
            type="button"
            className="filter-sales__reset"
            onClick={clearFilters}
            disabled={!hasFilters}
            aria-label="Limpiar filtros"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* ---------- Tarjetas superiores ---------- */}
      <div className="stats-dashboard">
        <div className="stats-card stats-card--main">
          <div className="stats-card__header">
            <span className="stats-card__icon"><DollarSign size={18} /></span>
            <span>Total del período</span>
          </div>
          <strong className="stats-card__value">{money(dashboardStats.totalMes)}</strong>
          <p>{dashboardStats.totalProductos} productos vendidos en total</p>
        </div>

        <div className="stats-card">
          <div className="stats-card__header">
            <span className="stats-card__icon stats-card__icon--green"><TrendingUp size={18} /></span>
            <span>Top 5 productos</span>
          </div>
          {dashboardStats.topProductsDashboard.length === 0 ? (
            <p className="stats-empty">Sin datos</p>
          ) : (
            <ol className="rank-list">
              {dashboardStats.topProductsDashboard.map((p, i) => (
                <li className="rank-item" key={p.name}>
                  <span className="rank-item__pos">{i + 1}</span>
                  <span className="rank-item__name">{p.name}</span>
                  <span className="rank-item__val">
                    {p.quantity} u. · {money(p.total)}
                  </span>
                  <span className="rank-item__bar" aria-hidden="true">
                    <i style={{ width: `${(p.quantity / maxQty) * 100}%` }} />
                  </span>
                </li>
              ))}
            </ol>
          )}
        </div>

        <div className="stats-card">
          <div className="stats-card__header">
            <span className="stats-card__icon stats-card__icon--amber"><ListOrdered size={18} /></span>
            <span>Métodos de pago</span>
          </div>
          {paymentData.length === 0 ? (
            <p className="stats-empty">Sin datos</p>
          ) : (
            <ul className="method-list">
              {paymentData.map((m, i) => (
                <li key={m.name}>
                  <span className="method-list__dot" style={{ background: payColor(m.name, i) }} />
                  <span className="method-list__name">{m.name}</span>
                  <strong>{money(m.value)}</strong>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* ---------- Evolución de ventas ---------- */}
      <section className="chart-box">
        <div className="chart-box__header">
          <h3>Evolución de ventas</h3>
          <div className="chart-switch" role="group" aria-label="Tipo de gráfico">
            <button
              type="button"
              className={chartType === 'line' ? 'active' : ''}
              onClick={() => setChartType('line')}
            >
              <TrendingUp size={16} /> Línea
            </button>
            <button
              type="button"
              className={chartType === 'bar' ? 'active' : ''}
              onClick={() => setChartType('bar')}
            >
              <BarChart2 size={16} /> Barras
            </button>
          </div>
        </div>

        <div className="chart-canvas">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'line' ? (
              <LineChart data={salesByMonth} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid stroke={GRID_STROKE} strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} tick={AXIS_TICK} />
                <YAxis tickLine={false} axisLine={false} width={yAxisWidth} tick={AXIS_TICK} tickFormatter={compactMoney} />
                <Tooltip content={<MoneyTooltip />} />
                <Line
                  type="monotone"
                  dataKey="total"
                  name="Ventas"
                  stroke="#1d5fc9"
                  strokeWidth={3}
                  dot={{ r: 4, strokeWidth: 2, fill: '#fff' }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            ) : (
              <BarChart data={salesByMonth} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid stroke={GRID_STROKE} strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} tick={AXIS_TICK} />
                <YAxis tickLine={false} axisLine={false} width={yAxisWidth} tick={AXIS_TICK} tickFormatter={compactMoney} />
                <Tooltip content={<MoneyTooltip />} cursor={{ fill: 'rgba(29,95,201,0.06)' }} />
                <Bar dataKey="total" name="Ventas" fill="#1d5fc9" radius={[6, 6, 0, 0]} maxBarSize={48} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </section>

      <div className="stats-grid-2">
        {/* ---------- Métodos de pago con totales ---------- */}
        <section className="chart-box">
          <div className="chart-box__header">
            <h3>Distribución de métodos de pago</h3>
          </div>
          <DonutBreakdown
            data={paymentData}
            colorFor={payColor}
            centerLabel="Total vendido"
          />
        </section>

        {/* ---------- Mes anterior vs actual ---------- */}
        <section className="chart-box">
          <div className="chart-box__header">
            <div>
              <h3>{filteredMonthLabel ? 'Mes filtrado vs mes anterior' : 'Mes anterior vs actual'}</h3>
              {filteredMonthLabel && (
                <p className="chart-sub">
                  {filteredMonthLabel.current.name} vs {filteredMonthLabel.previous.name}
                </p>
              )}
            </div>
            {delta !== null && (
              <span className={`stats-delta ${delta >= 0 ? 'stats-delta--up' : 'stats-delta--down'}`}>
                {delta >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {Math.abs(delta).toFixed(1).replace('.', ',')}%
              </span>
            )}
          </div>

          <div className="chart-canvas">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparison} margin={{ top: 24, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid stroke={GRID_STROKE} strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} tick={AXIS_TICK} />
                <YAxis tickLine={false} axisLine={false} width={yAxisWidth} tick={AXIS_TICK} tickFormatter={compactMoney} />
                <Tooltip content={<MoneyTooltip />} cursor={{ fill: 'rgba(29,95,201,0.06)' }} />
                <Bar dataKey="total" name="Total" radius={[8, 8, 0, 0]} maxBarSize={72}>
                  {comparison.map((_: unknown, i: number) => (
                    <Cell key={i} fill={i === 0 ? '#6b2fc0' : '#1d5fc9'} />
                  ))}
                  <LabelList
                    dataKey="total"
                    position="top"
                    formatter={(v: any) => compactMoney(Number(v ?? 0))}
                    style={{ fontSize: 12, fontWeight: 600, fill: '#1b2433' }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      {/* ---------- Total por producto ---------- */}
      <section className="chart-box">
        <div className="chart-box__header">
          <div>
            <h3>Total por producto</h3>
            <p className="chart-sub">
              {showAllProducts || allProducts.length <= PRODUCT_LIMIT
                ? `${allProducts.length} productos`
                : `Top ${PRODUCT_LIMIT} de ${allProducts.length} productos`}
            </p>
          </div>

          {allProducts.length > PRODUCT_LIMIT && (
            <button
              type="button"
              className="chart-toggle"
              onClick={() => setShowAllProducts((v) => !v)}
            >
              {showAllProducts ? 'Ver menos' : `Ver todos (${allProducts.length})`}
            </button>
          )}
        </div>

        {allProducts.length === 0 ? (
          <p className="stats-empty">Sin datos para mostrar</p>
        ) : (
          <div className="chart-canvas chart-canvas--auto" style={{ height: productChartHeight }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={visibleProducts}
                layout="vertical"
                margin={{ top: 4, right: isMobile ? 52 : 68, left: 0, bottom: 4 }}
              >
                <CartesianGrid stroke={GRID_STROKE} strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" hide />
                <YAxis
                  dataKey="name"
                  type="category"
                  width={isMobile ? 92 : 150}
                  tickLine={false}
                  axisLine={false}
                  tick={AXIS_TICK}
                  interval={0}
                  tickFormatter={(v: string) => {
                    const max = isMobile ? 12 : 20;
                    return v.length > max ? `${v.slice(0, max - 1)}…` : v;
                  }}
                />
                <Tooltip content={<MoneyTooltip />} cursor={{ fill: 'rgba(23,128,63,0.06)' }} />
                <Bar dataKey="total" name="Total" radius={[0, 8, 8, 0]} barSize={18}>
                  {visibleProducts.map((_, i) => (
                    <Cell key={i} fill="#17803f" fillOpacity={Math.max(0.5, 1 - i * 0.06)} />
                  ))}
                  <LabelList
                    dataKey="total"
                    position="right"
                    formatter={(v: any) => compactMoney(Number(v ?? 0))}
                    style={{ fontSize: 12, fontWeight: 600, fill: '#1b2433' }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </section>
    </div>
  );
};