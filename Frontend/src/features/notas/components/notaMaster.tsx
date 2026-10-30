import { useState, useEffect } from 'react';
import { Search, Trash2, Pencil, CheckCircle, Undo2 } from 'lucide-react';

import { useSearch } from '../../../hooks/useSearch';
import '../../../styles/notas.css';
import { useNotas, type INota } from '../hooks/useNota';
import { SearchInput } from '../../../components/ui/searchInput';

export const NotasView = () => {
  const { notas, loading, addNota, updateNota, deleteNota } = useNotas();
  const { query, setQuery, results } = useSearch(notas, ['titulo', 'descripcion', 'fecha']);

  const [fecha, setFecha] = useState('');
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');

  const pendientes = notas.filter((n) => !n.realizado).length;

  // Avisa al navbar cuántas notas activas hay (para su indicador rojo)
  useEffect(() => {
    if (loading) return;
    localStorage.setItem('notasPendientes', String(pendientes));
    window.dispatchEvent(new CustomEvent('notas:pendientes', { detail: pendientes }));
  }, [pendientes, loading]);

  const limpiar = () => {
    setFecha('');
    setTitulo('');
    setDescripcion('');
  };

  const handleGuardarNota = async () => {
    if (!fecha || !titulo || !descripcion) return alert('Complete todos los campos');
    await addNota({ fecha, titulo, descripcion });
    limpiar();
  };

  const handleMarcarRealizado = async (nota: INota) => {
    await updateNota(nota._id!, { realizado: true });
  };

  // Vuelve la nota a "activa"
  const handleDesmarcar = async (nota: INota) => {
    await updateNota(nota._id!, { realizado: false });
  };

  const handleEdit = async (nota: INota) => {
    const nuevoTitulo = prompt('Editar Título:', nota.titulo);
    const nuevaDesc = prompt('Editar Descripción:', nota.descripcion);
    if (nuevoTitulo && nuevaDesc) {
      await updateNota(nota._id!, { titulo: nuevoTitulo, descripcion: nuevaDesc });
    }
  };

  const visibleNotas = query ? results : notas;

  return (
    <div className="notas-container">
      <header className="notas-header">
        <h2 className="notas-title">Notas</h2>

        {!loading && (
          <span className={`notas-pending ${pendientes === 0 ? 'notas-pending--ok' : ''}`}>
            <i aria-hidden="true" />
            {pendientes === 0
              ? 'Todo al día'
              : `${pendientes} ${pendientes === 1 ? 'pendiente' : 'pendientes'}`}
          </span>
        )}
      </header>


      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
        <SearchInput 
          onSearch={setQuery} 
          loading={loading} 
          placeholder="Buscar por marca, mascota o categoría..." 
        />
      </div>


      <div className="notas-form-row">
        <input
          type="date"
          aria-label="Fecha"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
        />
        <input
          type="text"
          placeholder="Título de la nota"
          aria-label="Título"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
        />
        <input
          type="text"
          placeholder="Descripción o detalles"
          aria-label="Descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />
        <button type="button" className="btn-agregar" onClick={handleGuardarNota}>
          Agregar
        </button>
        <button type="button" className="btn-limpiar" onClick={limpiar}>
          Limpiar
        </button>
      </div>

      <div className="notas-table-wrapper">
        <table className="notas-table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Título</th>
              <th>Descripción</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr className="nota-empty"><td colSpan={5}>Cargando notas...</td></tr>
            ) : visibleNotas.length === 0 ? (
              <tr className="nota-empty"><td colSpan={5}>No hay notas.</td></tr>
            ) : (
              visibleNotas.map((nota) => (
                <tr
                  key={nota._id}
                  className={nota.realizado ? 'nota-realizada' : 'nota-activa'}
                >
                  <td data-label="Fecha">
                    <span className="nota-text">
                      {new Date(nota.fecha).toLocaleDateString()}
                    </span>
                  </td>
                  <td data-label="Título" className="nota-col-title">
                    <span className="nota-text nota-title">{nota.titulo}</span>
                  </td>
                  <td data-label="Descripción" className="nota-col-desc">
                    <span className="nota-text">{nota.descripcion}</span>
                  </td>
                  <td data-label="Estado">
                    {nota.realizado ? (
                      <span className="nota-status nota-status--done">Completada</span>
                    ) : (
                      <span className="nota-status nota-status--pending">Pendiente</span>
                    )}
                  </td>
                  <td data-label="" className="nota-col-actions">
                    <div className="nota-actions">
                      {nota.realizado ? (
                        <button
                          type="button"
                          className="nota-btn nota-btn--undo"
                          onClick={() => handleDesmarcar(nota)}
                          title="Desmarcar (volver a pendiente)"
                        >
                          <Undo2 size={16} /> Desmarcar
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="nota-btn nota-btn--done"
                          onClick={() => handleMarcarRealizado(nota)}
                          title="Marcar como realizado"
                        >
                          <CheckCircle size={16} /> Realizado
                        </button>
                      )}

                      <button
                        type="button"
                        className="nota-btn nota-btn--icon"
                        onClick={() => handleEdit(nota)}
                        aria-label="Editar"
                        title="Editar"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        type="button"
                        className="nota-btn nota-btn--icon nota-btn--danger"
                        onClick={() => deleteNota(nota._id!)}
                        aria-label="Eliminar"
                        title="Eliminar"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};