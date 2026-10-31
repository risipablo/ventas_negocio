import { useEffect, useMemo, useState } from 'react';
import { X, ChevronDown, CalendarDays } from 'lucide-react';
import type { ICliente } from '../hooks/useClientes';
import '../../../styles/filtersales.css';

interface Props {
  clientes: ICliente[];
  setFilteredClientes: React.Dispatch<React.SetStateAction<ICliente[]>>;
}

const MONTHS = [
  { value: '01', label: 'Enero' }, { value: '02', label: 'Febrero' },
  { value: '03', label: 'Marzo' }, { value: '04', label: 'Abril' },
  { value: '05', label: 'Mayo' }, { value: '06', label: 'Junio' },
  { value: '07', label: 'Julio' }, { value: '08', label: 'Agosto' },
  { value: '09', label: 'Septiembre' }, { value: '10', label: 'Octubre' },
  { value: '11', label: 'Noviembre' }, { value: '12', label: 'Diciembre' },
];

export const FilterClientes = ({ clientes, setFilteredClientes }: Props) => {
  const [dateFilter, setDateFilter] = useState('');
  const [monthFilter, setMonthFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [clienteFilter, setClienteFilter] = useState('');

  const years = useMemo(() => {
    const set = new Set<string>();
    clientes.forEach((c) => {
      const dateStr = typeof c.fecha === 'object' ? c.fecha : c.fecha;
      const year = dateStr.split('T')[0].split('-')[0];
      if (year) set.add(year);
    });
    return Array.from(set).sort((a, b) => b.localeCompare(a));
  }, [clientes]);

  const uniqueClientes = useMemo(() => Array.from(new Set(clientes.map(c => c.cliente))), [clientes]);

  const filteredSales = useMemo(() => {
    return clientes.filter((c) => {
      const dateStr = typeof c.fecha === 'object' ? c.fecha : c.fecha;
      const [year, month, day] = dateStr.split('T')[0].split('-');

      if (dateFilter && day !== dateFilter) return false;
      if (monthFilter && month !== monthFilter) return false;
      if (yearFilter && year !== yearFilter) return false;
      if (clienteFilter && c.cliente !== clienteFilter) return false;

      return true;
    });
  }, [clientes, dateFilter, monthFilter, yearFilter, clienteFilter]);

  const clearFilters = () => {
    setDateFilter(''); setMonthFilter(''); setYearFilter(''); setClienteFilter('');
  };

  const showCurrentMonth = () => {
    const f = new Date();
    setMonthFilter(String(f.getMonth() + 1).padStart(2, '0'));
    setYearFilter(String(f.getFullYear()));
    setDateFilter(''); setClienteFilter('');
  };

  useEffect(() => { setFilteredClientes(filteredSales); }, [filteredSales, setFilteredClientes]);

  return (
    <div className="filter-sales">
      <div className="filter-sales__row">
        <div className="filter-field">
          <select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)}>
            <option value="">Seleccionar Día</option>
            {Array.from({ length: 31 }, (_, i) => <option key={i} value={String(i + 1).padStart(2, '0')}>{i + 1}</option>)}
          </select>
          <ChevronDown size={16} className="filter-field__icon" />
        </div>

        <div className="filter-field">
          <select value={monthFilter} onChange={(e) => setMonthFilter(e.target.value)}>
            <option value="">Seleccionar Mes</option>
            {MONTHS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
          </select>
          <ChevronDown size={16} className="filter-field__icon" />
        </div>

        <div className="filter-field">
          <select value={yearFilter} onChange={(e) => setYearFilter(e.target.value)}>
            <option value="">Seleccionar Año</option>
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
          <ChevronDown size={16} className="filter-field__icon" />
        </div>

        <div className="filter-field">
          <select value={clienteFilter} onChange={(e) => setClienteFilter(e.target.value)}>
            <option value="">Seleccionar Cliente</option>
            {uniqueClientes.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <ChevronDown size={16} className="filter-field__icon" />
        </div>

        <button type="button" className="filter-sales__current-month" onClick={showCurrentMonth}>
          <CalendarDays size={18} /> <span>Mes actual</span>
        </button>

        <button type="button" className="filter-sales__reset" onClick={clearFilters} disabled={!dateFilter && !monthFilter && !yearFilter && !clienteFilter}>
          <X size={18} />
        </button>
      </div>
    </div>
  );
};