import { useState, useEffect } from 'react';
import { Pencil, Trash2, CheckSquare } from 'lucide-react';
import type { IList, ListContainerProps } from '../types/type.list';
import { ModalConfirm } from '../../../components/ui/modalConfirm';
import { LogoSpinner } from '../../../components/ui/spinner';
import { Paginate } from '../../../components/ui/paginate';
import '../../../styles/sale.css';
import '../../../styles/listconditions.css';
import { EditListModal } from './editModalProduct';

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const money = (n: number) => `$${n.toLocaleString('es-AR')}`;
const ITEMS_PER_PAGE = 12;

interface ExtendedProps extends ListContainerProps {
  onAdd?: (item: Omit<IList, '_id'>) => Promise<void>;
  onUpdate?: (id: string, data: Partial<IList>) => Promise<void>;
  onBulkDelete?: (ids: string[]) => Promise<void>;
}


type CondVariant = 'none' | 'cash' | 'outdated' | 'discontinued';

const getCondVariant = (condicion?: string): CondVariant => {
  const c = condicion?.toLowerCase().trim() || '';
  if (c === 'no actualizado') return 'outdated';
  if (c === 'discontinuado') return 'discontinued';
  if (c === 'efectivo' || c === 'efectivo/débito') return 'cash';
  return 'none';
};

const condLabel = (condicion?: string) =>
  !condicion || condicion === '-' ? 'Ninguno' : condicion;

export const ListContainer = ({
  list,
  loading,
  onDelete,
  onUpdate,
  onBulkDelete,
}: ExtendedProps) => {
  const [editingItem, setEditingItem] = useState<IList | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | string[] | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [minTimePassed, setMinTimePassed] = useState(false);

  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => setMinTimePassed(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const maxPage = Math.ceil(list.length / ITEMS_PER_PAGE);
    if (currentPage > maxPage && maxPage > 0) {
      setCurrentPage(maxPage);
    }
  }, [list.length, currentPage]);

  const totalPages = Math.ceil(list.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentList = list.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleEdit = (e: React.MouseEvent, item: IList) => {
    e.stopPropagation();
    setEditingItem(item);
  };

  const handleRowClick = (item: IList) => {
    if (!isSelecting) {
      setIsSelecting(true);
    }
    handleSelectItem(item._id as string);
  };

  const toggleSelectMode = () => {
    setIsSelecting(!isSelecting);
    setSelectedItems([]);
  };

  const confirmDelete = async () => {
    if (itemToDelete) {
      if (Array.isArray(itemToDelete)) {
        if (onBulkDelete) await onBulkDelete(itemToDelete);
        else if (onDelete) for (const id of itemToDelete) onDelete(id);
        setSelectedItems([]);
        setIsSelecting(false);
      } else {
        if (onDelete) onDelete(itemToDelete);
      }
    }
    setShowModal(false);
    setItemToDelete(null);
  };

  const openDeleteModal = (e: React.MouseEvent, id?: string) => {
    e.stopPropagation();
    if (!id) return;
    setItemToDelete(id);
    setShowModal(true);
  };

  const openBulkDeleteModal = () => {
    if (selectedItems.length === 0) return;
    setItemToDelete(selectedItems);
    setShowModal(true);
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedItems(currentList.map((item) => item._id as string).filter(Boolean));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const isLoading = loading || !minTimePassed;

  return (
    <div className="sale-master">
      {isLoading ? (
        <div className="list-loading">
          <LogoSpinner />
        </div>
      ) : list.length === 0 ? (
        <p>No hay productos registrados.</p>
      ) : (
        <>
          <div className="list-toolbar">
            <div className="list-toolbar__actions">
              {isSelecting ? (
                <>
                  <button className="btn btn--outline" onClick={toggleSelectMode}>
                    Cancelar selección
                  </button>
                  <button
                    className="btn btn--danger list-toolbar__delete"
                    onClick={openBulkDeleteModal}
                    disabled={selectedItems.length === 0}
                  >
                    <Trash2 size={16} />
                    Eliminar ({selectedItems.length})
                  </button>
                </>
              ) : (
                <button className="btn btn--outline" onClick={() => setIsSelecting(true)}>
                  <CheckSquare size={16} className="list-toolbar__icon" />
                  Seleccionar productos
                </button>
              )}
            </div>

            
            <ul className="cond-legend" aria-label="Referencia de colores por condición">
              <li><span className="cond-dot cond-dot--cash" />Efectivo</li>
              <li><span className="cond-dot cond-dot--outdated" />No actualizado</li>
              <li><span className="cond-dot cond-dot--discontinued" />Discontinuado</li>
            </ul>
          </div>

          <div className="table-scroll" role="region" aria-label="Listado de productos" tabIndex={0}>
            <table className="sale-table">
              <thead>
                <tr>
                  {isSelecting && (
                    <th className="col-check">
                      <input
                        type="checkbox"
                        aria-label="Seleccionar todos"
                        onChange={handleSelectAll}
                        checked={
                          currentList.length > 0 && selectedItems.length === currentList.length
                        }
                      />
                    </th>
                  )}
                  <th>Marca</th>
                  <th>Mascota</th>
                  <th>Edad</th>
                  <th>Kg</th>
                  <th>Precio</th>
                  <th>Condición</th>
                  <th>Categoría</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {currentList.map((item) => {
                  const variant = getCondVariant(item.condicion);
                  const isSelected = selectedItems.includes(item._id as string);

                  return (
                    <tr
                      key={item._id}
                      className={[
                        `row--${variant}`,
                        isSelecting ? 'row-selectable' : '',
                        isSelected ? 'row--selected' : '',
                      ].join(' ').trim()}
                      onClick={() => handleRowClick(item)}
                    >
                      {isSelecting && (
                        <td
                          data-label="Seleccionar"
                          className="col-check"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <input
                            type="checkbox"
                            aria-label="Seleccionar producto"
                            checked={isSelected}
                            onChange={() => handleSelectItem(item._id as string)}
                          />
                        </td>
                      )}
                      <td data-label="Marca">{cap(item.marca)}</td>
                      <td data-label="Mascota">{item.mascota}</td>
                      <td data-label="Edad">{item.edad}</td>
                      <td data-label="Kg">{item.kilo}</td>
                      <td data-label="Precio" className="cell--total">{money(Number(item.precio))}</td>
                      <td data-label="Condición">
                        {variant === 'none' ? (
                          <span className="cond-text-none">{condLabel(item.condicion)}</span>
                        ) : (
                          <span className={`cond-pill cond-pill--${variant}`}>
                            {condLabel(item.condicion)}
                          </span>
                        )}
                      </td>
                      <td data-label="Categoría">
                        <span className="tag">{item.categoria}</span>
                      </td>
                      <td data-label="Acciones" onClick={(e) => e.stopPropagation()}>
                        <div className="cell-actions">
                          <button
                            className="btn btn--icon"
                            onClick={(e) => handleEdit(e, item)}
                            aria-label="Editar"
                            title="Editar"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            className="btn btn--icon btn--danger-icon"
                            onClick={(e) => openDeleteModal(e, item._id)}
                            aria-label="Eliminar"
                            title="Eliminar"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <Paginate
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      )}

      <EditListModal
        isOpen={!!editingItem}
        item={editingItem}
        onClose={() => setEditingItem(null)}
        onUpdate={onUpdate as any}
      />

      {showModal && ModalConfirm && (
        <ModalConfirm
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onConfirm={confirmDelete}
          title={Array.isArray(itemToDelete) ? 'Eliminar productos' : 'Confirmar borrado'}
          message={
            Array.isArray(itemToDelete)
              ? `¿Estás seguro que deseas eliminar los ${itemToDelete.length} productos seleccionados?`
              : '¿Estás seguro que deseas eliminar este producto?'
          }
          confirmText="Eliminar"
          cancelText="Cancelar"
        />
      )}
    </div>
  );
};