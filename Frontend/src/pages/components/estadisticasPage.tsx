import { useState } from 'react';
import { BarChart2, TrendingUp, Wallet, Scale } from 'lucide-react';
import { useSales } from '../../features/sales/hooks/useSales';
import { ExpensesStatsView } from '../../features/estadisticas/expensesStasView';
import { SalesStatsView } from '../../features/estadisticas/salesStatsView';
import { BalanceView } from '../../features/estadisticas/balanceView';
import '../../styles/stats.css';
import { useGastos } from '../../context/gastosContext';

type TabType = 'ventas' | 'gastos' | 'balance';

const TABS = [
  { id: 'ventas', label: 'Ventas', icon: TrendingUp },
  { id: 'gastos', label: 'Gastos', icon: Wallet },
  { id: 'balance', label: 'Balance', icon: Scale },
] as const;

export const EstadisticasPage = () => {
  const [activeTab, setActiveTab] = useState<TabType>('ventas');

  // Datos para los gráficos
  const { sales } = useSales();
  const { gastos } = useGastos();

  return (
    <div className="stats-page">
      <title>Estadísticas</title>

      <header className="stats-page__header">
        <span className="stats-page__icon"><BarChart2 size={24} /></span>
        <h2>Estadísticas del negocio</h2>
      </header>

      <div className="stats-tabs" role="tablist" aria-label="Secciones de estadísticas">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={activeTab === id}
            className={`stats-tab ${activeTab === id ? 'is-active' : ''}`}
            onClick={() => setActiveTab(id)}
          >
            <Icon size={18} />
            {label}
          </button>
        ))}
      </div>

      <div role="tabpanel">
        {activeTab === 'ventas' && <SalesStatsView sales={sales} />}
        {activeTab === 'gastos' && <ExpensesStatsView gastos={gastos} />}
        {activeTab === 'balance' && <BalanceView sales={sales} gastos={gastos} />}
      </div>
    </div>
  );
};