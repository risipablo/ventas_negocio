import { useEffect, useState, useMemo } from 'react';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import type { Sale, CreateSalePayload } from '../types/sale.types';
import { SaleForm } from './saleForm';
import { SaleMaster } from './saleMaster';
import { useSales } from '../hooks/useSales';
import { useStats } from '../hooks/useStats';
import { SalesStats } from './saleStats';
import { filterSaleBySearch } from '../utils/seachUtils';
import { Buscador } from './buscador';
import { FilterSales } from '../ui/filterSale';
import '../../../styles/sale.css';
import '../../../styles/form.css';
import { Toaster } from 'react-hot-toast';
import { ScrollTop } from '../../../components/layout/scrollTop';

export const SaleContainer = () => {
  const {
    sales,
    filterSales,
    setFilterSales,
    loading,
    error,
    createSale,
    updateSale,
    deleteSale,
  } = useSales();

  const { lastSaleProduct, totalMonto } = useStats(sales, filterSales);

  const [activeFilter, setActiveFilter] = useState('');

  useEffect(() => {
    if (filterSaleBySearch.length === 0 && sales.length > 0 && activeFilter) {
      setFilterSales(sales);
    }
  }, [filterSales.length, sales, activeFilter, setFilterSales]);

  const searchSales = (palabraClave: string) => {
    if (!palabraClave.trim()) {
      setFilterSales(sales);
      setActiveFilter('');
      return;
    }

    const resultados = filterSaleBySearch(sales, palabraClave);
    setFilterSales(resultados);
    setActiveFilter(palabraClave);
  };

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editing, setEditing] = useState<Sale | null>(null);

  const handleToggleCreate = () => {
    setEditing(null);
    setShowCreateForm((prev) => !prev);
  };

  const handleEdit = (sale: Sale) => {
    setEditing(sale);
    setShowCreateForm(false);
  };

  const handleCancel = () => {
    setEditing(null);
    setShowCreateForm(false);
  };

  const handleSubmit = async (payload: CreateSalePayload) => {
    if (editing) {
      await updateSale(editing._id, payload);
    } else {
      await createSale(payload);
    }
    setEditing(null);
    setShowCreateForm(false);
  };

  const handleDelete = async (id: string) => {
    await deleteSale(id);
  };

  

  const handleBulkDelete = async (ids: string[]) => {
    for (const id of ids) {
      await deleteSale(id);
    }
  };

  
  const displayedSales = useMemo(() => {
    if (filterSales.length <= 1) return filterSales;

    
    const sorted = [...filterSales].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    const lastSale = sorted[0]; // La más reciente

  
    const restSales = filterSales.filter((s) => s._id !== lastSale._id);
    return [lastSale, ...restSales];
  }, [filterSales]);

  return (
    <Box className="sale-container">
      <Paper
        elevation={showCreateForm ? 4 : 1}
        sx={{
          overflow: 'hidden',
          width: '100%',
          mx: 'auto',
        }}
      >
        <Button
          fullWidth
          onClick={handleToggleCreate}
          endIcon={showCreateForm ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          sx={{
            justifyContent: 'space-between',
            textTransform: 'none',
            fontSize: '1.05rem',
            fontWeight: 600,
            color: 'text.primary',
            px: 3.5,
            py: 2.5,
            borderRadius: 0,
            '&:hover': { backgroundColor: 'action.hover' },
          }}
        >
          Ingreso de venta
        </Button>

        <Collapse in={showCreateForm} timeout={320} unmountOnExit>
          <Box sx={{ p: { xs: 2, sm: 3 } }}>
            <SaleForm
              mode="inline"
              onSubmit={handleSubmit}
              onCancel={handleCancel}
            />
          </Box>
        </Collapse>
      </Paper>

      <Box sx={{ width: '100%', maxWidth: 1200, mx: 'auto' }}>
        <Buscador filtrarDatos={searchSales} />

        <FilterSales
          sales={sales}
          setFilterSales={setFilterSales}
          onFilterChange={() => {
            if (activeFilter) setActiveFilter('');
          }}
        />

        <SalesStats
          lastSpend={lastSaleProduct}
          totalMonto={String(
            totalMonto.toLocaleString('es-AR', {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })
          )}
        />

        <SaleMaster
          sales={sales}
          filterSales={displayedSales} 
          setFileterSales={setFilterSales}
          loading={loading}
          error={error}
          onCreate={handleToggleCreate}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onBulkDelete={handleBulkDelete} 
        />
      </Box>

      {editing && (
        <SaleForm
          mode="modal"
          initialSale={editing}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      )}
      <Toaster />
      <ScrollTop />
    </Box>
  );
};