import { useState, useEffect, Fragment } from 'react';
import { ChevronDown, ChevronUp, Plus, Trash2, Pencil } from 'lucide-react';
import type { ICliente, IClienteItem } from '../hooks/useClientes';
import { ModalConfirm } from '../../../components/ui/modalConfirm';
import { Paginate } from '../../../components/ui/paginate';
import { LogoSpinner } from '../../../components/ui/spinner';
import { formatDate } from '../../sales/utils/dateUtils';
import '../../../styles/sale.css';
import '../../../styles/clientes.css';

const ITEMS_PER_PAGE = 10;
const money = (n: number) => `$${n.toLocaleString('es-AR')}`;
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

interface Props {
  list: ICliente[];
  loading: boolean;
  onDelete: (id: string) => void;
  onUpdate: (id: string, data: Partial<ICliente>) => void;
  onEdit: (c: ICliente) => void;
}

export const ClienteContainer = ({ list, loading, onDelete, onUpdate, onEdit }: Props) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [minTimePassed, setMinTimePassed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMinTimePassed(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const toggleExpand = (id: string) => setExpandedId(prev => prev === id ? null : id);

  const handleAddItem = (cliente: ICliente, e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newItem: IClienteItem = {
      fecha: new Date(formData.get('fecha') as string).toISOString(),
      producto: formData.get('producto') as string,
      precio: Number(formData.get('precio')),
    };
    onUpdate(cliente._id!, { items: [...cliente.items, newItem] });
    e.currentTarget.reset();
  };

  const handleDeleteItem = (cliente: ICliente, itemId: string) => {
    const filteredItems = cliente.items.filter(i => i._id !== itemId);
    onUpdate(cliente._id!, { items: filteredItems });
  };

  const confirmDelete = () => {
    if (itemToDelete) onDelete(itemToDelete);
    setShowModal(false);
    setItemToDelete(null);
  };

  const totalPages = Math.ceil(list.length / ITEMS_PER_PAGE);
  const currentList = list.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  const isLoading = loading || !minTimePassed;

  return (
    <div className="sale-master">
      {isLoading ? (
        <div style={{ padding: '4rem 0', textAlign: 'center' }}><LogoSpinner /></div>
      ) : list.length === 0 ? (
        <p>No hay clientes registrados.</p>
      ) : (
        <>
          <div className="table-scroll">
            <table className="sale-table">
              <thead>
                <tr>
                  <th style={{ width: '40px' }}></th>
                  <th>Cliente</th>
                  <th>Fecha</th>
                  <th>Producto</th>
                  <th>Precio Base</th>
                  <th>Ítems</th>
                  <th>Total</th> 
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {currentList.map((cliente) => {
                  const isOpen = expandedId === cliente._id;
                  // suma de totales
                  const totalGeneral = cliente.precio + cliente.items.reduce((acc, item) => acc + item.precio, 0);

                  return (
                    <Fragment key={cliente._id}>
                      <tr className={isOpen ? 'row--active' : ''}>
                        <td onClick={() => toggleExpand(cliente._id!)} style={{ cursor: 'pointer', textAlign: 'center' }}>
                          {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </td>
                        <td data-label="Cliente" style={{ fontWeight: 600 }}>{cap(cliente.cliente)}</td>
                        <td data-label="Fecha">{formatDate(cliente.fecha)}</td>
                        <td data-label="Producto">{cap(cliente.producto)}</td>
                        <td data-label="Precio">{money(cliente.precio)}</td>
                        <td data-label="Ítems" style={{ textAlign: 'center' }}>
                          <span className="badge-count">{cliente.items.length}</span>
                        </td>
                        <td data-label="Total" style={{ fontWeight: 700, color: '#17803f' }}>
                          {money(totalGeneral)}
                        </td>
                        <td data-label="Acciones">
                          <div className="cell-actions">
                            <button className="btn btn--icon" onClick={() => onEdit(cliente)}><Pencil size={16} /></button>
                            <button className="btn btn--icon btn--danger-icon" onClick={() => { setItemToDelete(cliente._id!); setShowModal(true); }}><Trash2 size={16} /></button>
                          </div>
                        </td>
                      </tr>

                      {isOpen && (
                        <tr>
                          <td colSpan={8} style={{ padding: 0 }}>
                            <div className="clientes-subitems">
                              <h4>Suscripciones / Ítems</h4>
                              <form onSubmit={(e) => handleAddItem(cliente, e)} className="pf-row" style={{ marginBottom: '16px' }}>
                                <input type="date" name="fecha" required defaultValue={new Date().toISOString().split('T')[0]} />
                                <input type="text" name="producto" placeholder="Producto" required />
                                <input type="number" name="precio" placeholder="Precio" min="0" required />
                                <button type="submit" className="pf-btn-add" style={{ padding: '0 20px', display: 'flex', gap: '6px' }}>
                                  <Plus size={16} /> Agregar
                                </button>
                              </form>

                              {cliente.items.length > 0 && (
                                <table className="subitems-table">
                                  <thead>
                                    <tr>
                                      <th>Fecha</th>
                                      <th>Producto</th>
                                      <th>Precio</th>
                                      <th>Acciones</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {cliente.items.map((item) => (
                                      <tr key={item._id}>
                                        <td>{formatDate(item.fecha)}</td>
                                        <td>{item.producto}</td>
                                        <td>{money(item.precio)}</td>
                                        <td>
                                          <button className="btn btn--icon btn--danger-icon" onClick={() => handleDeleteItem(cliente, item._id!)}>
                                            <Trash2 size={14} />
                                          </button>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && <Paginate currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />}
        </>
      )}

      {showModal && ModalConfirm && (
        <ModalConfirm
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onConfirm={confirmDelete}
          title="Eliminar cliente"
          message="¿Estás seguro que deseas eliminar este cliente y todos sus ítems?"
          confirmText="Eliminar"
          cancelText="Cancelar"
        />
      )}
    </div>
  );
};