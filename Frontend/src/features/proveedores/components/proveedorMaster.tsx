import { useState } from 'react';
import Box from '@mui/material/Box';
import { useSearch } from '../../../hooks/useSearch';
import { SearchInput } from '../../../components/ui/searchInput';
import { useProveedor } from '../hooks/useProveedores';
import type { IProveedor } from '../types/proveedores.type';
import { FilterProveedores } from '../ui/filterProveedor';
import { ProveedorForm } from '../ui/proveedorForm';
import { ProveedorContainer } from './proveedoreContainer';
import { ScrollTop } from '../../../components/layout/scrollTop';
import { Toaster } from 'react-hot-toast';


export const ProveedorMaster = () => {
  
  const { proveedores, loading, deleteProveedor, bulkDelete, addProveedor,updateProveedor } = useProveedor();
  
  const [filteredList, setFilteredList] = useState<IProveedor[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const { query, setQuery, results } = useSearch<IProveedor>(proveedores, ['proveedores', 'marcas','edades','kilos','precios','mascotas','date']);

  const displayList = query.trim() ? results : (filteredList.length > 0 ? filteredList : proveedores);

  const handleAdd = async (data: Omit<IProveedor, '_id' | 'userId'>) => {
    if (addProveedor) {
      await addProveedor(data);
    }
  };

  return (
    <Box className="sale-container">
      <Box sx={{ width: '100%', maxWidth: 1200, mx: 'auto' }}>
        
        
        <ProveedorForm
          isOpen={isFormOpen}
          onToggle={() => setIsFormOpen(!isFormOpen)}
          onAdd={handleAdd}
        />

        <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
          <SearchInput
            onSearch={setQuery} 
            loading={loading}  placeholder="Buscar proveedor o marca..." />
        </div>

        <FilterProveedores 
          proveedores={proveedores} 
          setFilterProveedores={setFilteredList} 
        />

        <ProveedorContainer
          list={displayList}
          loading={loading}
          onDelete={(id) => {
            if (id) void deleteProveedor(id);
          }}
          onBulkDelete={bulkDelete}
          onUpdate={updateProveedor}
        />
      </Box>
      <Toaster />
      <ScrollTop />
    </Box>
  );
};