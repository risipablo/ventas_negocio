import { Pencil, Trash2 } from 'lucide-react';
import type { SaleMasterProps } from '../types/sale.types';
import { formatDate } from '../utils/dateUtils';
import { useState, useEffect } from 'react';
import { ModalConfirm } from '../../../components/ui/modalConfirm';
import { LogoSpinner } from '../../../components/ui/spinner';
import { Paginate } from '../../../components/ui/paginate';
import "../../../styles/spinner.css"

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const money = (n: number) => `$${n.toLocaleString('es-AR')}`;
const ITEMS_PER_PAGE = 12;

export const SaleMaster = ({
  sales,
  filterSales,
  loading,
  error,
  onEdit,
  onDelete,
}: SaleMasterProps) => {
  const [showModal, setShowModal] = useState(false);
  const [deleteAction, setDeleteAction] = useState<(() => Promise<void>) | null>(null);
  const [modalConfig, setModalConfig] = useState({
    title: "",
    message: "",
    confirmText: ""
  });
  const [minTimePassed, setMinTimePassed] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

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

  const openDeleteModal = (
    action: () => Promise<void>,
    title: string,
    message: string,
    confirmText: string
  ) => {
    setDeleteAction(() => action);
    setModalConfig({ title, message, confirmText });
    setShowModal(true);
  };

  const confirmModal = async () => {
    if (deleteAction) {
      try {
        await deleteAction();
      } catch (error) {
        console.error("Error al eliminar:", error);
      } finally {
        setShowModal(false);
        setDeleteAction(null);
      }
    }
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
      <div
        className="table-scroll"
        role="region"
        aria-label="Listado de ventas"
        tabIndex={0}
      >
        <table className="sale-table">
          <thead>
            <tr>
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

            return (
              <tbody key={sale._id}>
                {sale.items.map((item, index) => (
                  <tr key={`${sale._id}-${index}`}>
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
                              onClick={() => openDeleteModal(
                                async () => {
                                  if (sale._id) await onDelete(sale._id);
                                },
                                "Confirmar borrado",
                                "¿Estás seguro que deseas eliminar este producto?",
                                "Eliminar"
                              )}
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

      <Paginate
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {showModal && ModalConfirm && (
        <ModalConfirm
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onConfirm={confirmModal}
          title={modalConfig.title}
          message={modalConfig.message}
          confirmText={modalConfig.confirmText}
          cancelText="Cancelar"
        />
      )}
    </div>
  );
};