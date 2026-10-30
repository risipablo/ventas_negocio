import { useState } from 'react';
import Box from '@mui/material/Box';
import { useGastos } from '../hooks/useGastos';
import { GastoContainer } from './gastosContainer';
import { GastoForm } from './gastosForm';
import { EditGastoModal } from '../ui/editGastosModal';
import { FilterGastos } from '../ui/filterGastos';
import { useSearch } from '../../../hooks/useSearch';
import { SearchInput } from '../../../components/ui/searchInput';
import { ScrollTop } from '../../../components/layout/scrollTop';
import { Toaster } from 'react-hot-toast';
import type { IGasto } from '../types/gastos.types';
import '../../../styles/gastos.css';
import { GastosStats } from './gastosStats';
import { useStatsGastos } from '../hooks/useStatsGastos';

export const GastoMaster = () => {
  const { gastos, loading, addGasto, updateGasto, deleteGasto } = useGastos();
  
  
    const { lastSaleProduct, totalMonto } = useStatsGastos(gastos, gastos);
  
  const { query, setQuery, results } = useSearch<IGasto>(gastos, ['proveedor', 'numeroBoleta', 'estado','fecha','fechaPago','monto']);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<IGasto | null>(null);
  
  
  const [filteredGastos, setFilteredGastos] = useState<IGasto[]>([]);

  const handleAdd = async (data: Omit<IGasto, '_id'>) => {
    await addGasto(data);
  };

  
  const displayList = query.trim() 
    ? results 
    : (filteredGastos.length > 0 ? filteredGastos : gastos);

  return (
    <Box className="sale-container">
      <Box sx={{ width: '100%', maxWidth: 1200, mx: 'auto' }}>
        
        <GastoForm isOpen={isFormOpen} onToggle={() => setIsFormOpen(!isFormOpen)} onAdd={handleAdd} />

        <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
          <SearchInput onSearch={setQuery} 
            loading={loading}  placeholder="Buscar proveedor o boleta..." />
        </div>

        
        <FilterGastos 
          gastos={gastos}
          setFilteredGastos={setFilteredGastos}
        />

        <GastosStats
          lastSpend=  {lastSaleProduct}
          totalMonto={String(
            totalMonto.toLocaleString('es-AR', {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })
          )}
        />

        <GastoContainer
          list={displayList}
          loading={loading}
          onDelete={deleteGasto}
          onUpdate={updateGasto}
          onEdit={setEditingItem}
        />
      </Box>

      <EditGastoModal
        isOpen={!!editingItem}
        item={editingItem}
        onClose={() => setEditingItem(null)}
        onUpdate={updateGasto}
      />
      
      <Toaster />
      <ScrollTop />
    </Box>
  );
};