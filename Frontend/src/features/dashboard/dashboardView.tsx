import { useMemo, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  HelpCircle, TrendingUp, TrendingDown, Target, AlertTriangle, 
  CheckCircle2, Trophy, Medal, StickyNote, ShoppingCart, FileText, ArrowRight, Wallet
} from 'lucide-react';

import '../../styles/dashboard.css';
import { useUser } from '../auth/hooks/useUser';
import { useSales } from '../sales/hooks/useSales';
import { useGastos } from '../gastos/hooks/useGastos';
import { useNotas } from '../notas/hooks/useNota';
import { useCarritosGuardados } from '../carrito/hooks/useCarritoGuardado';

export const DashboardView = () => {
  const { user } = useUser();
  const { sales } = useSales();
  const { gastos } = useGastos();
  const { notas } = useNotas();
  const { carritos } = useCarritosGuardados();

  // Lógica de fechas
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
  
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const daysPassed = now.getDate();

  const stats = useMemo(() => {
    let ventasMes = 0;
    let ventasMesAnterior = 0;
    let gastosMes = 0;
    let gastosMesAnterior = 0;
    
    const productosMap: Record<string, { qty: number; total: number }> = {};
    const proveedoresMap: Record<string, { qty: number; total: number }> = {};
    
    const gastosImpagos: any[] = [];
    let totalGastosCount = 0;
    let totalPagadosCount = 0;

    // Filtrar Ventas
    sales.forEach(sale => {
      const d = new Date(sale.date);
      if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
        ventasMes += sale.total;
        sale.items.forEach(i => {
          const key = i.name.toLowerCase();
          if (!productosMap[key]) productosMap[key] = { qty: 0, total: 0 };
          productosMap[key].qty += i.quantity;
          productosMap[key].total += (i.quantity * i.unitPrice);
        });
      } else if (d.getMonth() === prevMonth && d.getFullYear() === prevYear) {
        ventasMesAnterior += sale.total;
      }
    });

    // Filtrar Gastos
    gastos.forEach(gasto => {
      const d = new Date(gasto.fecha);
      if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
        gastosMes += gasto.monto;
        totalGastosCount++;
        
        if (gasto.estado === 'pagado') {
          totalPagadosCount++;
        } else if (gasto.estado === 'impago') {
          gastosImpagos.push(gasto);
        }

        const prov = gasto.proveedor.toLowerCase();
        if (!proveedoresMap[prov]) proveedoresMap[prov] = { qty: 0, total: 0 };
        proveedoresMap[prov].qty += 1;
        proveedoresMap[prov].total += gasto.monto;

      } else if (d.getMonth() === prevMonth && d.getFullYear() === prevYear) {
        gastosMesAnterior += gasto.monto;
      }
    });

    // Cálculos de comparación
    const diffVentas = ventasMes - ventasMesAnterior;
    const pctVentas = ventasMesAnterior === 0 ? 100 : (diffVentas / ventasMesAnterior) * 100;
    const diffGastos = gastosMes - gastosMesAnterior;

    // Top 3
    const topProductos = Object.entries(productosMap)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.qty - a.qty).slice(0, 3);

    const topProveedores = Object.entries(proveedoresMap)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.total - a.total).slice(0, 3);

    const impagosTotal = gastosImpagos.reduce((acc, g) => acc + g.monto, 0);

    return {
      ventasMes, diffVentas, pctVentas,
      gastosMes, diffGastos,
      topProductos, topProveedores,
      gastosImpagos, impagosTotal,
      totalGastosCount, totalPagadosCount
    };
  }, [sales, gastos, currentMonth, currentYear, prevMonth, prevYear]);

  const promedioDiario = stats.ventasMes / (daysPassed || 1);
  const formatMoney = (val: number) => `$${val.toLocaleString('es-AR')}`;

  // Filtrar notas: No completadas y ordenarlas por fecha descendente
  const notasPendientes = useMemo(() => {
    return notas
      .filter(n => !n.realizado)
      .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
  }, [notas]);

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1><HelpCircle size={28} color="#8c98a8" /> Hola, {user?.name || 'Usuario'}</h1>
        <p>Aquí están tus registros de lo que va del mes</p>
      </header>

      {/* Fila 1: Ventas, Promedio, Total Gastos */}
      <div className="dashboard-grid">
        <div className="dash-card">
          <div className="dash-card__header">
            <div className="dash-card__icon" style={{ background: '#e8f0fd', color: '#1d5fc9' }}><TrendingUp size={20} /></div>
            Ventas del mes
          </div>
          <h2 className="dash-card__value">{formatMoney(stats.ventasMes)}</h2>
          <div className={`dash-trend ${stats.diffVentas >= 0 ? 'dash-trend--up' : 'dash-trend--down'}`}>
            {stats.diffVentas >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            {formatMoney(Math.abs(stats.diffVentas))} ({stats.pctVentas.toFixed(1)}%) vs mes ant.
          </div>
          <p className="dash-card__sub">Mes anterior: {formatMoney(stats.ventasMes - stats.diffVentas)}</p>
        </div>

        <div className="dash-card">
          <div className="dash-card__header">
            <div className="dash-card__icon" style={{ background: '#f3e8ff', color: '#6b2fc0' }}><Target size={20} /></div>
            Promedio por día
          </div>
          <h2 className="dash-card__value">{formatMoney(promedioDiario)}</h2>
          <p className="dash-card__sub">Basado en {daysPassed} días transcurridos</p>
        </div>

        {/* NUEVO WIDGET: Total de Gastos y Boletas */}
        <div className="dash-card">
          <div className="dash-card__header">
            <div className="dash-card__icon" style={{ background: '#fdecea', color: '#b42318' }}><Wallet size={20} /></div>
            Total Gastos del Mes
          </div>
          <h2 className="dash-card__value">{formatMoney(stats.gastosMes)}</h2>
          <p className="dash-card__sub" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={16} color="#17803f" />
            <strong>{stats.totalPagadosCount} boletas pagadas</strong> de {stats.totalGastosCount} totales
          </p>
          {stats.diffGastos > 0 ? (
             <div className="dash-trend dash-trend--down" style={{ marginTop: '12px' }}>
               <TrendingUp size={16} /> {formatMoney(stats.diffGastos)} más que el mes anterior
             </div>
          ) : (
            <div className="dash-trend dash-trend--up" style={{ marginTop: '12px' }}>
               <TrendingDown size={16} /> {formatMoney(Math.abs(stats.diffGastos))} menos que el mes anterior
             </div>
          )}
        </div>
      </div>

      {/* Fila 2: Estado de pagos, Top productos, Top proveedores */}
      <div className="dashboard-grid">
        <div className="dash-card">
          <div className="dash-card__header" style={{ textTransform: 'none', fontSize: '1rem', color: '#1b2433' }}>
            <CheckCircle2 size={20} color="#1d5fc9" /> Estado de pagos
          </div>
          <div className="status-widget">
            <h2>{stats.totalPagadosCount}</h2>
            <span>/ {stats.totalGastosCount}</span>
          </div>
          {stats.gastosImpagos.length > 0 ? (
            <div className="badge-pending">
              {stats.gastosImpagos.length} pendiente{stats.gastosImpagos.length > 1 ? 's' : ''} · {formatMoney(stats.impagosTotal)}
            </div>
          ) : (
            <div className="badge-pending" style={{ background: '#e8f5e9', color: '#2e7d32' }}>Todo pagado</div>
          )}
          
          <div className="pending-list">
            <p style={{ margin: '0 0 8px 0', fontSize: '0.85rem', color: '#8c98a8' }}>Gastos pendientes</p>
            {stats.gastosImpagos.length === 0 ? (
              <p style={{ fontSize: '0.85rem', color: '#5b6475' }}>No hay gastos impagos.</p>
            ) : (
              stats.gastosImpagos.slice(0, 3).map((g, i) => (
                <div key={i} className="pending-item">
                  <span><AlertTriangle size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} /> {g.proveedor}</span>
                  <span>{formatMoney(g.monto)}</span>
                </div>
              ))
            )}
            {stats.gastosImpagos.length > 3 && (
              <p style={{ fontSize: '0.8rem', color: '#8c98a8', textAlign: 'center', marginTop: '8px' }}>+ {stats.gastosImpagos.length - 3} más...</p>
            )}
          </div>
        </div>

        <div className="dash-card">
          <div className="dash-card__header" style={{ textTransform: 'none', fontSize: '1rem', color: '#1b2433' }}>
            <Trophy size={20} color="#1d5fc9" /> Top 3 productos más vendidos
          </div>
          <ul className="top-list">
            {stats.topProductos.map((p, i) => (
              <li key={i}>
                <span className="top-list__rank">{i === 0 ? <Medal size={18} /> : i + 1}</span>
                <span className="top-list__name" style={{ textTransform: 'capitalize' }}>{p.name}</span>
                <span className="top-list__value">{p.qty} u. | {formatMoney(p.total)}</span>
              </li>
            ))}
            {stats.topProductos.length === 0 && <li>Sin ventas este mes</li>}
          </ul>
        </div>

        <div className="dash-card">
          <div className="dash-card__header" style={{ textTransform: 'none', fontSize: '1rem', color: '#1b2433' }}>
            <Trophy size={20} color="#1d5fc9" /> Top 3 proveedores (más gastos)
          </div>
          <ul className="top-list">
            {stats.topProveedores.map((p, i) => (
              <li key={i}>
                <span className="top-list__rank">{i === 0 ? <Medal size={18} /> : i + 1}</span>
                <span className="top-list__name" style={{ textTransform: 'capitalize' }}>{p.name}</span>
                <span className="top-list__value">{formatMoney(p.total)}</span>
              </li>
            ))}
            {stats.topProveedores.length === 0 && <li>Sin gastos este mes</li>}
          </ul>
        </div>
      </div>

      {/* Fila 3: Notas y Carritos Guardados */}
      <div className="dashboard-section">
        <div className="dash-card">
          <div className="section-header" style={{ justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <StickyNote size={20} color="#f59e0b" /> Notas Recientes
            </div>
            <NavLink to="/notas" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', color: '#1d5fc9', textDecoration: 'none', fontWeight: 600 }}>
              Ver todas <ArrowRight size={14} />
            </NavLink>
          </div>
          <div className="list-scroll">
            {notasPendientes.length === 0 ? <p style={{ color: '#5b6475' }}>No hay notas pendientes.</p> : 
              notasPendientes.slice(0, 5).map(nota => (
                <div className="mini-card" key={nota._id}>
                  <div className="mini-card__info">
                    <h4>{nota.titulo}</h4>
                    <p>{nota.descripcion}</p>
                  </div>
                  <span className="mini-card__value">{new Date(nota.fecha).toLocaleDateString('es-AR')}</span>
                </div>
              ))
            }
          </div>
        </div>

        <div className="dash-card">
          <div className="section-header" style={{ justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShoppingCart size={20} color="#6b2fc0" /> Listas de Compras
            </div>
            <NavLink to="/carritos-guardados" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', color: '#1d5fc9', textDecoration: 'none', fontWeight: 600 }}>
              Ver todas <ArrowRight size={14} />
            </NavLink>
          </div>
          <div className="list-scroll">
            {carritos.length === 0 ? <p style={{ color: '#5b6475' }}>No hay listas guardadas.</p> : 
              carritos.slice(0, 5).map(c => (
                <div className="mini-card" key={c._id}>
                  <div className="mini-card__info">
                    <h4>{c.titulo}</h4>
                    <p>{c.items.length} productos</p>
                  </div>
                  <span className="mini-card__value">{formatMoney(c.total)}</span>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  );
};