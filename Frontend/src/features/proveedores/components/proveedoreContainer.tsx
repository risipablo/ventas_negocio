import { useState, useEffect } from 'react';
import { Pencil, Trash2, CheckSquare, ShoppingCart } from 'lucide-react';
import { ModalConfirm } from '../../../components/ui/modalConfirm';
import { Paginate } from '../../../components/ui/paginate';


import '../../../styles/sale.css';
import type { IProveedor } from '../types/proveedores.type';
import { useCart } from '../../../context/useCarrito';
import { EditProveedorModal } from '../ui/editProveedorModel';

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const money = (n: number) => `$${n.toLocaleString('es-AR')}`;
const ITEMS_PER_PAGE = 10;

interface Props {
  list: IProveedor[];
  loading: boolean;
  onDelete?: (id?: string) => void;
  onBulkDelete?: (ids: string[]) => void;
  onUpdate?: (id: string, data: Partial<IProveedor>) => void;
}

export const ProveedorContainer = ({ list, loading, onDelete, onBulkDelete, onUpdate }: Props) => {
  const { addToCart } = useCart();
  
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [itemToDelete, setItemToDelete] = useState<string | string[] | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  
  const [editingItem, setEditingItem] = useState<IProveedor | null>(null);

  const totalPages = Math.ceil(list.length / ITEMS_PER_PAGE);
  const currentList = list.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleRowClick = (id: string) => {
    if (!isSelecting) setIsSelecting(true);
    setSelectedItems((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);
  };

  const confirmDelete = () => {
    if (Array.isArray(itemToDelete) && onBulkDelete) onBulkDelete(itemToDelete);
    else if (typeof itemToDelete === 'string' && onDelete) onDelete(itemToDelete);
    
    setShowModal(false); 
    setIsSelecting(false); 
    setSelectedItems([]); 
    setItemToDelete(null);
  };

  const openDeleteModal = (e: React.MouseEvent, id?: string) => {
    e.stopPropagation();
    if (!id) return;
    setItemToDelete(id);
    setShowModal(true);
  };

  return (
    <div className="sale-master">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
        {isSelecting ? (
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn btn--outline" onClick={() => { setIsSelecting(false); setSelectedItems([]); }}>
              Cancelar
            </button>
            <button 
              className="btn btn--danger" 
              onClick={() => { setItemToDelete(selectedItems); setShowModal(true); }} 
              disabled={selectedItems.length === 0}
            >
              <Trash2 size={16} /> Eliminar ({selectedItems.length})
            </button>
          </div>
        ) : (
          <button className="btn btn--outline" onClick={() => setIsSelecting(true)}>
            <CheckSquare size={16} /> Seleccionar
          </button>
        )}
      </div>

      <div className="table-scroll">
        <table className="sale-table">
          <thead>
            <tr>
              {isSelecting && <th style={{ width: '40px' }}></th>}
              <th>Fecha</th>
              <th>Proveedor</th>
              <th>Marca</th>
              <th>Mascota</th>
              <th>Edad</th>
              <th>Kg</th>
              <th>Precio</th>
              <th style={{ textAlign: 'center' }}>Agregar</th>
              <th style={{ textAlign: 'center' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentList.map((item) => (
              <tr 
                key={item._id} 
                onClick={() => handleRowClick(item._id!)} 
                style={{ cursor: isSelecting ? 'pointer' : 'default' }}
              >
                {isSelecting && (
                  <td onClick={(e) => e.stopPropagation()}>
                    <input 
                      type="checkbox" 
                      checked={selectedItems.includes(item._id!)} 
                      onChange={() => handleRowClick(item._id!)} 
                    />
                  </td>
                )}
                <td data-label="Fecha">{item.date}</td>
                <td data-label="Proveedor"><strong>{cap(item.proveedores)}</strong></td>
                <td data-label="Marca">{cap(item.marcas)}</td>
                <td data-label="Mascota">{cap(item.mascotas)}</td>
                <td data-label="Edad">{item.edades}</td>
                <td data-label="Kg">{item.kilos}</td>
                <td data-label="Precio" className='cell--total'>{money(Number(item.precios))}</td>
                
                {/* NUEVA COLUMNA DEL CARRITO */}
                <td data-label="Agregar" onClick={(e) => e.stopPropagation()} style={{ textAlign: 'center' }}>
                  <button 
                    className="btn btn--icon" 
                    onClick={() => addToCart(item)} 
                    title="Agregar al carrito"
                    style={{ color: '#6b2fc0', background: '#f3e8ff' }}
                  >
                    <ShoppingCart size={16} />
                  </button>
                </td>

                {/* COLUMNA DE ACCIONES ACTUALIZADA */}
                <td data-label="Acciones" onClick={(e) => e.stopPropagation()}>
                  <div className="cell-actions" style={{ justifyContent: 'center' }}>
                    <button 
                      className="btn btn--icon" 
                      onClick={(e) => { e.stopPropagation(); setEditingItem(item); }} 
                      title="Editar"
                    >
                      <Pencil size={16} />
                    </button>
                    <button 
                      className="btn btn--icon btn--danger-icon" 
                      onClick={(e) => openDeleteModal(e, item._id!)}
                      title="Eliminar"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {totalPages > 1 && <Paginate currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />}
      
    
      <EditProveedorModal
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