import { useEffect, useMemo, useState } from 'react';
import { X, ChevronDown, CalendarDays } from 'lucide-react';
import type { IGasto } from '../types/gastos.types';
import '../../../styles/filtersales.css';
import { Tooltip } from '@mui/material';

interface Props {
  gastos: IGasto[];
  setFilteredGastos: React.Dispatch<React.SetStateAction<IGasto[]>>;
}

const MONTHS = [
  { value: '01', label: 'Enero' },
  { value: '02', label: 'Febrero' },
  { value: '03', label: 'Marzo' },
  { value: '04', label: 'Abril' },
  { value: '05', label: 'Mayo' },
  { value: '06', label: 'Junio' },
  { value: '07', label: 'Julio' },
  { value: '08', label: 'Agosto' },
  { value: '09', label: 'Septiembre' },
  { value: '10', label: 'Octubre' },
  { value: '11', label: 'Noviembre' },
  { value: '12', label: 'Diciembre' },
];

export const FilterGastos = ({ gastos, setFilteredGastos }: Props) => {
  const [dateFilter, setDateFilter] = useState('');
  const [monthFilter, setMonthFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [providerFilter, setProviderFilter] = useState('');
  const [conditionFilter, setConditionFilter] = useState('');

  
  const years = useMemo(() => {
    const set = new Set<string>();
    gastos.forEach((g) => {
      const dateStr = typeof g.fecha === 'object' ? g.fecha : g.fecha;
      const year = dateStr.split('T')[0].split('-')[0];
      if (year) set.add(year);
    });
    return Array.from(set).sort((a, b) => b.localeCompare(a));
  }, [gastos]);

  
  const uniqueProviders = useMemo(() => {
    return Array.from(new Set(gastos.map((g) => g.proveedor)));
  }, [gastos]);


  const filteredSales = useMemo(() => {
    return gastos.filter((gasto) => {
      const dateStr = typeof gasto.fecha === 'object' ? gasto.fecha : gasto.fecha;
      const [year, month, day] = dateStr.split('T')[0].split('-');

      if (dateFilter && day !== dateFilter) return false;
      if (monthFilter && month !== monthFilter) return false;
      if (yearFilter && year !== yearFilter) return false;
      if (providerFilter && gasto.proveedor !== providerFilter) return false;
      if (conditionFilter && gasto.estado !== conditionFilter) return false;

      return true;
    });
  }, [gastos, dateFilter, monthFilter, yearFilter, providerFilter, conditionFilter]);

  const clearFilters = () => {
    setDateFilter('');
    setMonthFilter('');
    setYearFilter('');
    setProviderFilter('');
    setConditionFilter('');
  };

  const showCurrentMonth = () => {
    const fecha = new Date();
    const mesNumero = String(fecha.getMonth() + 1).padStart(2, '0');
    const año = String(fecha.getFullYear());
    setMonthFilter(mesNumero);
    setYearFilter(año);
    setDateFilter('');
    setProviderFilter('');
    setConditionFilter('');
  };

  useEffect(() => {
    setFilteredGastos(filteredSales);
  }, [filteredSales, setFilteredGastos]);

  const hasActiveFilters = Boolean(
    dateFilter || monthFilter || yearFilter || providerFilter || conditionFilter
  );

  return (
    <div className="filter-sales">
      <div className="svg-filter">
          <button
            type="button"
            className="filter-sales__current-date"
            onClick={showCurrentMonth}
            title="Ver mes actual"
          >
              <Tooltip title='Ver Mes Actual'>
                  <CalendarDays size={18} />
              </Tooltip>
            
    
          </button>
        </div>
        
      <div className="filter-sales__row">

        <div className="filter-field">
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            aria-label="Seleccionar Día"
          >
            <option value="">Seleccionar Día</option>
            {Array.from({ length: 31 }, (_, i) => {
              const day = String(i + 1).padStart(2, '0');
              return <option key={day} value={day}>{day}</option>;
            })}
          </select>
          <ChevronDown size={16} className="filter-field__icon" />
        </div>

        
        <div className="filter-field">
          <select
            value={monthFilter}
            onChange={(e) => setMonthFilter(e.target.value)}
            aria-label="Seleccionar Mes"
          >
            <option value="">Seleccionar Mes</option>
            {MONTHS.map((m) => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
          <ChevronDown size={16} className="filter-field__icon" />
        </div>

        
        <div className="filter-field">
          <select
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            aria-label="Seleccionar Año"
          >
            <option value="">Seleccionar Año</option>
            {years.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
          <ChevronDown size={16} className="filter-field__icon" />
        </div>

        
        <div className="filter-field">
          <select
            value={providerFilter}
            onChange={(e) => setProviderFilter(e.target.value)}
            aria-label="Seleccionar Proveedor"
          >
            <option value="">Seleccionar Proveedor</option>
            {uniqueProviders.map((prov) => (
              <option key={prov} value={prov}>{prov}</option>
            ))}
          </select>
          <ChevronDown size={16} className="filter-field__icon" />
        </div>
        
        <div className="filter-field">
          <select
            value={conditionFilter}
            onChange={(e) => setConditionFilter(e.target.value)}
            aria-label="Seleccionar Estado"
          >
            <option value="">Seleccionar Estado</option>
            <option value="pagado">Pagado</option>
            <option value="impago">Impago</option>
            <option value="nota de credito">Nota de Crédito</option>
          </select>
          <ChevronDown size={16} className="filter-field__icon" />
        </div>
        
        <button
          type="button"
          className="filter-sales__reset"
          onClick={clearFilters}
          disabled={!hasActiveFilters}
          aria-label="Limpiar filtros"
          title="Limpiar filtros"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
};