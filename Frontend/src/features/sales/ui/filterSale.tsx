      import { useCallback, useEffect, useMemo, useState } from 'react';
      import { X, ChevronDown, CalendarDays, CalendarCheck2 } from 'lucide-react';
      import type { Sale, PaymentMethod } from '../types/sale.types';
      import '../../../styles/filterSales.css';
      import { Tooltip } from '@mui/material';

      interface Props {
        sales: Sale[];
        setFilterSales: React.Dispatch<React.SetStateAction<Sale[]>>;
        onFilterChange?: (filters: {
          dateFilter: string;
          monthFilter: string;
          yearFilter: string;
          paymentFilter: string;
        }) => void;
      }

      const PAYMENT_METHODS: { value: PaymentMethod; label: string }[] = [
        { value: 'efectivo', label: 'Efectivo' },
        { value: 'debito', label: 'Débito' },
        { value: 'credito', label: 'Crédito' },
        { value: 'mercado pago', label: 'Mercado Pago' },
        { value: 'qr', label: 'QR' },
      ];

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

      export const FilterSales = ({
        sales,
        setFilterSales,
        onFilterChange,
      }: Props) => {
        const [dateFilter, setDateFilter] = useState('');
        const [monthFilter, setMonthFilter] = useState('');
        const [yearFilter, setYearFilter] = useState('');
        const [paymentFilter, setPaymentFilter] = useState('');

        const normalDate = useCallback((dateInput: string | Date): string => {
          if (!dateInput) return '';
          if (dateInput instanceof Date) {
            if (Number.isNaN(dateInput.getTime())) return '';
            const year = dateInput.getFullYear();
            const month = String(dateInput.getMonth() + 1).padStart(2, '0');
            const day = String(dateInput.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
          }

          const dateStr = dateInput.trim();
          const yearFirst = dateStr.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);
          if (yearFirst) {
            return `${yearFirst[1]}-${yearFirst[2].padStart(2, '0')}-${yearFirst[3].padStart(2, '0')}`;
          }

          const dayFirst = dateStr.match(/^(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})/);
          if (dayFirst) {
            return `${dayFirst[3]}-${dayFirst[2].padStart(2, '0')}-${dayFirst[1].padStart(2, '0')}`;
          }

          return '';
        }, []);

        const years = useMemo(() => {
          const set = new Set<string>();
          sales.forEach((s) => set.add(normalDate(s.date).slice(0, 4)));
          return Array.from(set).sort((a, b) => b.localeCompare(a));
        }, [sales, normalDate]);

        const filteredSales = useMemo(() => {
          return sales.filter((sale) => {
            const normalized = normalDate(sale.date);
            const [year, month, day] = normalized.split('-');

            if (dateFilter && day !== dateFilter) return false;
            if (monthFilter && month !== monthFilter) return false;
            if (yearFilter && year !== yearFilter) return false;
            if (paymentFilter && sale.paymentMethod !== paymentFilter) return false;

            return true;
          });
        }, [sales, dateFilter, monthFilter, yearFilter, paymentFilter, normalDate]);

        const clearFilters = () => {
          setDateFilter('');
          setMonthFilter('');
          setYearFilter('');
          setPaymentFilter('');
        };

        const showCurrenDate = () => {
          const fecha = new Date();
          const dia = String(fecha.getDate()).padStart(2, '0');
          const mesNumero = String(fecha.getMonth() + 1).padStart(2, '0');
          const año = String(fecha.getFullYear());
          setDateFilter(dia);
          setMonthFilter(mesNumero);
          setYearFilter(año);
          setPaymentFilter('');
        };


        const showCurrentMonth = () => {
          const fecha = new Date();
          const mesNumero = String(fecha.getMonth() + 1).padStart(2, '0');
          const año = String(fecha.getFullYear());
          setMonthFilter(mesNumero);
          setYearFilter(año);
          setDateFilter('');
          setPaymentFilter('');
        };

        useEffect(() => {
          setFilterSales(filteredSales);
        }, [filteredSales, setFilterSales]);

        useEffect(() => {
          onFilterChange?.({
            dateFilter,
            monthFilter,
            yearFilter,
            paymentFilter,
          });
        }, [dateFilter, monthFilter, yearFilter, paymentFilter, onFilterChange]);

        const hasActiveFilters = Boolean(
          dateFilter || monthFilter || yearFilter || paymentFilter
        );

        return (
          <div className="filter-sales">

            <div className="svg-filter">
              <button
                type="button"
                className="filter-sales__current-date"
                onClick={showCurrenDate}
                title="Ver fecha de hoy"
              >
                  <Tooltip title='Ver fecha de hoy'>
                      <CalendarCheck2  size={18} />
                  </Tooltip>
                
        
              </button>

              <button
                type="button"
                className="filter-sales__current-month"
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
                    return (
                      <option key={day} value={day}>
                        {day}
                      </option>
                    );
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
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
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
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
                <ChevronDown size={16} className="filter-field__icon" />
              </div>

              <div className="filter-field">
                <select
                  value={paymentFilter}
                  onChange={(e) => setPaymentFilter(e.target.value)}
                  aria-label="Seleccionar Tipo de Pago"
                >
                  <option value="">Seleccionar Tipo de Pago</option>
                  {PAYMENT_METHODS.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
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