import { useState, useEffect, useMemo } from 'react';
import { CheckCircle, XCircle, Pencil, Trash2 } from 'lucide-react';
import type { IGasto } from '../types/gastos.types';
import { ModalConfirm } from '../../../components/ui/modalConfirm';
import { Paginate } from '../../../components/ui/paginate';
import { LogoSpinner } from '../../../components/ui/spinner';
import '../../../styles/gastos.css';
import { formatDate } from '../../sales/utils/dateUtils';

const ITEMS_PER_PAGE = 8;
const money = (n: number) => `$${n.toLocaleString('es-AR')}`;
const cap = (s: string) => s.toUpperCase();

interface Props {
  list: IGasto[];
  loading: boolean;
  onDelete: (id: string) => void;
  onUpdate: (id: string, data: Partial<IGasto>) => void;
  onEdit: (gasto: IGasto) => void;
}

export const GastoContainer = ({ list, loading, onDelete, onUpdate, onEdit }: Props) => {
  const [showModal, setShowModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [minTimePassed, setMinTimePassed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMinTimePassed(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  
  const sortedList = useMemo(() => {
    return [...list].sort(
      (a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
    );
  }, [list]);

  const totalPages = Math.ceil(sortedList.length / ITEMS_PER_PAGE);
  const currentList = sortedList.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleTogglePago = (gasto: IGasto) => {
    const isPagando = gasto.estado !== 'pagado';
    onUpdate(gasto._id!, {
      estado: isPagando ? 'pagado' : 'impago',
      fechaPago: isPagando ? new Date().toISOString() : null,
    });
  };

  const confirmDelete = () => {
    if (itemToDelete) onDelete(itemToDelete);
    setShowModal(false);
    setItemToDelete(null);
  };

  const isLoading = loading || !minTimePassed;

  return (
    <div className="sale-master">
      {isLoading ? (
        <div style={{ padding: '4rem 0', textAlign: 'center' }}><LogoSpinner /></div>
      ) : list.length === 0 ? (
        <p>No se encontraron gastos con los filtros aplicados.</p>
      ) : (
        <>
          <div className="table-scroll">
            <table className="sale-table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Proveedor</th>
                  <th>N° Boleta</th>
                  <th>Monto</th>
                  <th>Estado</th>
                  <th>Fecha Pago</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {currentList.map((gasto) => {
                  const isPagado = gasto.estado === 'pagado';
                  const isImpago = gasto.estado === 'impago';
                  
                  return (
                    <tr key={gasto._id} className={isImpago ? 'row--danger' : ''}>
                      <td data-label="Fecha">{formatDate(gasto.fecha)}</td>
                      <td data-label="Proveedor">{cap(gasto.proveedor)}</td>
                      <td data-label="N° Boleta">{gasto.numeroBoleta}</td>
                      <td data-label="Monto" style={{ fontWeight: 'bold' }}>{money(gasto.monto)}</td>
                      <td data-label="Estado">
                        <span className={`tag ${isPagado ? 'tag--success' : isImpago ? 'tag--danger' : 'tag--warning'}`}>
                          {cap(gasto.estado)}
                        </span>
                      </td>
                      <td data-label="Fecha Pago">
                         {gasto.fechaPago ? formatDate(gasto.fechaPago) : '—'} 
                      </td>
                      <td data-label="Acciones">
                        <div className="cell-actions">
                          <button
                            className={`btn btn--icon ${isPagado ? 'btn--danger-icon' : 'btn--success-icon'}`}
                            onClick={() => handleTogglePago(gasto)}
                            title={isPagado ? 'Desmarcar pago' : 'Marcar como pagado'}
                            disabled={gasto.estado === 'nota de credito'}
                          >
                            {isPagado ? <XCircle size={16} /> : <CheckCircle size={16} />}
                          </button>
                          <button className="btn btn--icon" onClick={() => onEdit(gasto)}>
                            <Pencil size={16} />
                          </button>
                          <button className="btn btn--icon btn--danger-icon" onClick={() => { setItemToDelete(gasto._id!); setShowModal(true); }}>
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
          {totalPages > 1 && <Paginate currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />}
        </>
      )}

      {showModal && ModalConfirm && (
        <ModalConfirm
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onConfirm={confirmDelete}
          title="Eliminar gasto"
          message="¿Estás seguro que deseas eliminar este gasto? Esta acción no se puede deshacer."
          confirmText="Eliminar"
          cancelText="Cancelar"
        />
      )}
    </div>
  );
};