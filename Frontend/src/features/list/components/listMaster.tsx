import Box from '@mui/material/Box';
import { ListContainer } from './listContainer';
import { useList } from '../hooks/useList';
import { Toaster } from 'react-hot-toast';
import { ScrollTop } from '../../../components/layout/scrollTop';
import type { IList } from '../types/type.list';
import { useSearch } from '../../../hooks/useSearch';
import { SearchInput } from '../../../components/ui/searchInput';
import { ListForm } from './listForm';
import { useState } from 'react';
import { FilterList } from '../ui/filterList';

export const ListMaster = () => {
  const { list, setList, loading, addList, deleteList, bulkDeleteList, updateList } =
    useList();

    const [filteredList, setFilteredList] = useState<IList[]>(list);
    const [isFormOpen, setIsFormOpen] = useState(true);

    const {query,setQuery,results} = useSearch<IList>(
       list, 
      ['marca', 'mascota', 'categoria', 'condicion','edad', 'kilo', 'precio'], 
    )

  const handleAdd = async (data: Omit<IList, '_id'>) => {
    await addList(
      data.marca,
      data.mascota,
      data.edad,
      data.kilo,
      data.condicion,
      data.precio,
      data.categoria
    );
  };

  const handleDelete = async (id?: string) => {
    if (id) await deleteList(id);
  };

  
  const displayList = query.trim() ? results : (filteredList.length > 0 ? filteredList : list);


  return (
    <Box className="sale-container">
      <Box sx={{ width: '100%', maxWidth: 1200, mx: 'auto' }}>


        <ListForm
          isOpen={isFormOpen}
          onToggle={() => setIsFormOpen(!isFormOpen)}
          initialData={null}
          onCancel={() => setIsFormOpen(false)}
          onAdd={handleAdd}
        />


        <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
          <SearchInput 
            onSearch={setQuery} 
            loading={loading} 
            placeholder="Buscar por marca, mascota o categoría..." 
          />
        </div>

        <FilterList
          products={list}
          setFilterProducts={setFilteredList}
        />

        <ListContainer
          list={displayList}
          setList={setList}
          setFilterProducts={setFilteredList}
          loading={loading}
          onAdd={handleAdd}
          onUpdate={updateList}
          onDelete={handleDelete}
          onBulkDelete={bulkDeleteList}
        />
      </Box>
      <Toaster />
      <ScrollTop />
    </Box>
  );
};

