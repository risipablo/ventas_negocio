import { Pencil, Trash2, CheckSquare } from 'lucide-react';
import type { SaleMasterProps } from '../types/sale.types';
import { formatDate } from '../utils/dateUtils';
import { useState, useEffect, Fragment } from 'react';
import { ModalConfirm } from '../../../components/ui/modalConfirm';
import { LogoSpinner } from '../../../components/ui/spinner';
import { Paginate } from '../../../components/ui/paginate';
import '../../../styles/spinner.css';

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const money = (n: number) => `$${n.toLocaleString('es-AR')}`;
const ITEMS_PER_PAGE = 12;

interface ExtendedProps extends SaleMasterProps {
  onBulkDelete?: (ids: string[]) => Promise<void>;
}

export const SaleMaster = ({
  sales,
  filterSales,
  loading,
  error,
  onEdit,
  onDelete,
  onBulkDelete,
}: ExtendedProps) => {
  const [showModal, setShowModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | string[] | null>(null);
  const [minTimePassed, setMinTimePassed] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMinTimePassed(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [filterSales.length]);

  const totalPages = Math.ceil(filterSales.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentSales = filterSales.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const confirmModal = async () => {
    if (itemToDelete) {
      try {
        if (Array.isArray(itemToDelete)) {
          if (onBulkDelete) {
            await onBulkDelete(itemToDelete);
          } else {
            for (const id of itemToDelete) {
              if (onDelete) await onDelete(id);
            }
          }
          setSelectedItems([]);
          setIsSelecting(false);
        } else {
          if (onDelete) await onDelete(itemToDelete);
        }
      } catch (error) {
        console.error("Error al eliminar:", error);
      } finally {
        setShowModal(false);
        setItemToDelete(null);
      }
    }
  };

  const openDeleteModal = (idOrIds: string | string[]) => {
    setItemToDelete(idOrIds);
    setShowModal(true);
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedItems(currentSales.map((sale) => sale._id as string).filter(Boolean));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSelectMode = () => {
    setIsSelecting(!isSelecting);
    setSelectedItems([]);
  };

  if (loading || !minTimePassed) {
    return (
      <div className="sale-master">
        <div className="table-scroll table-scroll--loading">
          <LogoSpinner text="cargando ventas" />
        </div>
      </div>
    );
  }

  if (error) return <p className="error">Error: {error}</p>;

  if (sales.length === 0) {
    return (
      <div className="sale-master">
        <p>No hay ventas registradas.</p>
      </div>
    );
  }

  if (filterSales.length === 0) {
    return (
      <div className="sale-search">
        <p>No se encontraron ventas.</p>
      </div>
    );
  }

  return (
    <div className="sale-master">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
        {isSelecting ? (
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn btn--outline" onClick={toggleSelectMode}>
              Cancelar Selección
            </button>
            <button
              className="btn btn--danger"
              onClick={() => openDeleteModal(selectedItems)}
              disabled={selectedItems.length === 0}
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <Trash2 size={16} />
              Eliminar ({selectedItems.length})
            </button>
          </div>
        ) : (
          <button className="btn btn--outline" onClick={() => setIsSelecting(true)}>
            <CheckSquare size={16} style={{ marginRight: '8px' }} />
            Seleccionar Ventas
          </button>
        )}
      </div>

      <div
        className="table-scroll"
        role="region"
        aria-label="Listado de ventas"
        tabIndex={0}
      >
        <table className="sale-table">
          <thead>
            <tr>
              {isSelecting && (
                <th style={{ width: '40px', textAlign: 'center' }}>
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={currentSales.length > 0 && selectedItems.length === currentSales.length}
                  />
                </th>
              )}
              <th>Fecha</th>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Precio</th>
              <th>Método</th>
              <th>Tarjeta</th>
              <th>N° cupón</th>
              <th>N° tarjeta</th>
              <th>Total</th>
              <th>Acciones</th>
            </tr>
          </thead>

          {currentSales.map((sale) => {
            const rows = sale.items.length;
            const isSelected = selectedItems.includes(sale._id as string);

            return (
              <tbody key={sale._id}>
                {sale.items.map((item, index) => (
                  <tr key={`${sale._id}-${index}`} className={isSelected ? 'row--active' : ''}>
                    {index === 0 && isSelecting && (
                      <td rowSpan={rows} style={{ textAlign: 'center' }}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectItem(sale._id as string)}
                        />
                      </td>
                    )}

                    {index === 0 && (
                      <td rowSpan={rows} className="col-date">
                        {formatDate(sale.date)}
                      </td>
                    )}

                    <td className="col-product">{cap(item.name)}</td>
                    <td>{item.quantity}</td>
                    <td>{money(item.unitPrice)}</td>

                    {index === 0 && (
                      <>
                        <td rowSpan={rows}>
                          <span className="tag">{cap(sale.paymentMethod)}</span>
                        </td>
                        <td rowSpan={rows}>
                          {sale.cardBrand ? cap(sale.cardBrand) : '—'}
                        </td>
                        <td rowSpan={rows}>{sale.couponNumber ?? '—'}</td>
                        <td rowSpan={rows}>{sale.numberTarget ?? '—'}</td>
                        <td rowSpan={rows} className="cell--total">
                          {money(sale.total)}
                        </td>
                        <td rowSpan={rows}>
                          <div className="cell-actions">
                            <button
                              className="btn btn--icon"
                              onClick={() => onEdit(sale)}
                              aria-label="Editar"
                              title="Editar"
                            >
                              <Pencil size={16} />
                            </button>
                            <button
                              className="btn btn--icon btn--danger-icon"
                              aria-label="Eliminar"
                              title="Eliminar"
                              onClick={() => openDeleteModal(sale._id as string)}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </>
                    )}

                  </tr>
                ))}
              </tbody>
            );
          })}
        </table>
      </div>

      {totalPages > 1 && (
        <Paginate
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      {showModal && ModalConfirm && (
        <ModalConfirm
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onConfirm={confirmModal}
          title={Array.isArray(itemToDelete) ? 'Eliminar ventas' : 'Confirmar borrado'}
          message={
            Array.isArray(itemToDelete)
              ? `¿Estás seguro que deseas eliminar las ${itemToDelete.length} ventas seleccionadas?`
              : '¿Estás seguro que deseas eliminar esta venta?'
          }
          confirmText="Eliminar"
          cancelText="Cancelar"
        />
      )}
    </div>
  );
};