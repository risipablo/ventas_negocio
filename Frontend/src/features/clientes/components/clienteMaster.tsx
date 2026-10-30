import { useState } from 'react';
import Box from '@mui/material/Box';
import { useClientes } from '../hooks/useClientes';
import { ClienteContainer } from './clienteContainer';
import { useSearch } from '../../../hooks/useSearch';
import { SearchInput } from '../../../components/ui/searchInput';
import { ScrollTop } from '../../../components/layout/scrollTop';
import { Toaster } from 'react-hot-toast';
import type { ICliente } from '../hooks/useClientes';
import '../../../styles/gastos.css';
import { ClienteForm } from './clientesForm';
import { FilterClientes } from './filterClientes';
import { EditClienteModal } from '../ui/editModelClientes';

export const ClienteMaster = () => {
  const { clientes, loading, addCliente, updateCliente, deleteCliente } = useClientes();
  const { query, setQuery, results } = useSearch<ICliente>(clientes, ['cliente', 'producto']);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ICliente | null>(null);
  const [filteredClientes, setFilteredClientes] = useState<ICliente[]>([]);

  const handleAdd = async (data: Omit<ICliente, '_id'>) => { await addCliente(data); };

  const displayList = query.trim() ? results : (filteredClientes.length > 0 ? filteredClientes : clientes);

  return (
    <Box className="sale-container">
      <Box sx={{ width: '100%', maxWidth: 1200, mx: 'auto' }}>
        
        <ClienteForm isOpen={isFormOpen} onToggle={() => setIsFormOpen(!isFormOpen)} onAdd={handleAdd} />

        <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
          <SearchInput onSearch={setQuery} placeholder="Buscar cliente o producto..." loading={loading} />
        </div>

        <FilterClientes clientes={clientes} setFilteredClientes={setFilteredClientes} />

        <ClienteContainer
          list={displayList}
          loading={loading}
          onDelete={deleteCliente}
          onUpdate={updateCliente}
          onEdit={setEditingItem}
        />
      </Box>

      <EditClienteModal
        isOpen={!!editingItem}
        item={editingItem}
        onClose={() => setEditingItem(null)}
        onUpdate={updateCliente}
      />
      
      <Toaster />
      <ScrollTop />
    </Box>
  );
};