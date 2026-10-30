import { useState } from 'react';
import { Trash2, ChevronDown, Pencil, ClipboardList, CheckCircle, Circle } from 'lucide-react';
import { useSearch } from '../../../hooks/useSearch';
import { SearchInput } from '../../../components/ui/searchInput';
import { LogoSpinner } from '../../../components/ui/spinner';
import { ModalConfirm } from '../../../components/ui/modalConfirm';
import '../../../styles/carritoGuardado.css';
import { useCarritosGuardados, type ICarritoGuardado } from '../hooks/useCarritoGuardado';
import { EditCarritoModal } from './editCarrito';

const money = (n: number) => `$${n.toLocaleString('es-AR')}`;

export const CarritosGuardadosView = () => {
  const { carritos, loading, deleteCarrito, updateCarrito } = useCarritosGuardados();
  const { query, setQuery, results } = useSearch<ICarritoGuardado>(carritos, ['titulo']);

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<ICarritoGuardado | null>(null);
  
  const [showModal, setShowModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const openDeleteModal = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setItemToDelete(id);
    setShowModal(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      deleteCarrito(itemToDelete);
    }
    setShowModal(false);
    setItemToDelete(null);
  };

  const handleToggleMarcado = async (e: React.MouseEvent, carrito: ICarritoGuardado) => {
    e.stopPropagation();
    await updateCarrito(carrito._id!, { ...carrito, marcado: !carrito.marcado });
  };

  const displayList = query ? results : carritos;

  return (
    <div className="carritos-guardados-container">
      <header className="carritos-header">
        <h1 className="carritos-title">Listas de compras guardadas</h1>
        {!loading && (
          <span className="carritos-count">
            {displayList.length} {displayList.length === 1 ? 'lista' : 'listas'}
          </span>
        )}
      </header>

      <div className="carritos-toolbar">
        <div className="carritos-search">
          <SearchInput onSearch={setQuery} 
            loading={loading}  placeholder="Buscar lista por título..." />
        </div>
      </div>

      {loading ? (
        <LogoSpinner text="cargando datos" />
      ) : displayList.length === 0 ? (
        <div className="carritos-empty">
          <ClipboardList size={36} />
          <p>
            {query
              ? 'No hay listas que coincidan con la búsqueda.'
              : 'Todavía no guardaste ninguna lista.'}
          </p>
        </div>
      ) : (
        <div className="carritos-list">
          {displayList.map((carrito) => {
            const id = carrito._id!;
            const isOpen = expandedId === id;
            const isMarcado = carrito.marcado;

            return (
              <article key={id} className={`carrito-card ${isOpen ? 'is-open' : ''} ${isMarcado ? 'is-marcado' : ''}`}>
                <div className="carrito-header" onClick={() => toggleExpand(id)}>
                  <div className="carrito-info">
                    <h3 style={{ textDecoration: isMarcado ? 'line-through' : 'none', color: isMarcado ? '#888' : 'inherit' }}>
                      {carrito.titulo}
                    </h3>
                    <div className="carrito-meta">
                      <span>
                        {carrito.createdAt
                          ? new Date(carrito.createdAt).toLocaleDateString('es-AR')
                          : '—'}
                      </span>
                      <span className="carrito-tag">
                        {carrito.items.length}{' '}
                        {carrito.items.length === 1 ? 'producto' : 'productos'}
                      </span>
                    </div>
                  </div>

                  <div className="carrito-total-box">
                    <span className="carrito-total-label">Total</span>
                    <span className="carrito-total">{money(carrito.total)}</span>
                  </div>

                  <div className="carrito-actions" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      className="btn-icon"
                      onClick={(e) => handleToggleMarcado(e, carrito)}
                      title={isMarcado ? "Desmarcar lista" : "Marcar lista"}
                      aria-label={isMarcado ? "Desmarcar lista" : "Marcar lista"}
                      style={{ color: isMarcado ? '#17803f' : 'inherit' }}
                    >
                      {isMarcado ? <CheckCircle size={18} /> : <Circle size={18} />}
                    </button>
                    
                    <button
                      type="button"
                      className="btn-icon"
                      onClick={() => setEditingItem(carrito)}
                      title="Editar lista"
                      aria-label="Editar lista"
                    >
                      <Pencil size={18} />
                    </button>

                    <button
                      type="button"
                      className="btn-icon btn-danger"
                      onClick={(e) => openDeleteModal(e, id)}
                      title="Eliminar lista"
                      aria-label="Eliminar lista"
                    >
                      <Trash2 size={18} />
                    </button>

                    <button
                      type="button"
                      className={`btn-icon btn-chevron ${isOpen ? 'is-open' : ''}`}
                      onClick={() => toggleExpand(id)}
                      aria-expanded={isOpen}
                      aria-controls={`detalles-${id}`}
                      title={isOpen ? 'Ocultar detalle' : 'Ver detalle'}
                      aria-label={isOpen ? 'Ocultar detalle' : 'Ver detalle'}
                    >
                      <ChevronDown size={20} />
                    </button>
                  </div>
                </div>

                <div
                  id={`detalles-${id}`}
                  className={`carrito-detalles ${isOpen ? 'is-open' : ''}`}
                >
                  <div className="carrito-detalles__inner">
                    <table className="detalles-table">
                      <thead>
                        <tr>
                          <th>Producto</th>
                          <th>Cant.</th>
                          <th>Precio unit.</th>
                          <th>Subtotal</th>
                        </tr>
                      </thead>
                      <tbody>
                        {carrito.items.map((item, i) => (
                          <tr key={i}>
                            <td data-label="Producto">{item.nombre}</td>
                            <td data-label="Cant.">{item.cantidad}</td>
                            <td data-label="Precio unit.">{money(item.precio)}</td>
                            <td data-label="Subtotal">
                              <strong>{money(item.cantidad * item.precio)}</strong>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <EditCarritoModal
        isOpen={!!editingItem}
        carrito={editingItem}
        onClose={() => setEditingItem(null)}
        onUpdate={updateCarrito}
      />

      {showModal && ModalConfirm && (
        <ModalConfirm
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onConfirm={confirmDelete}
          title="Eliminar lista"
          message="¿Estás seguro que deseas eliminar esta lista de compras guardada? Esta acción no se puede deshacer."
          confirmText="Eliminar"
          cancelText="Cancelar"
        />
      )}
    </div>
  );
};