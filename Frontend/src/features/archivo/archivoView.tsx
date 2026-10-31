import { useRef, useState } from 'react';
import { UploadCloud, File, Image as ImageIcon, FileText, Trash2, Download, Eye, X } from 'lucide-react';
import '../../styles/archivo.css';
import { useArchivos, type IArchivo } from './hook/useArchivo';
import { ModalConfirm } from '../../components/ui/modalConfirm';

export const ArchivosView = () => {
  const { archivos, loading, uploading, uploadArchivo, deleteArchivo } = useArchivos();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await uploadArchivo(e.target.files[0]);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getIconForType = (tipo: string) => {
    if (tipo.startsWith('image/')) return <ImageIcon size={32} color="#1d5fc9" />;
    if (tipo.includes('pdf')) return <FileText size={32} color="#e5342f" />;
    return <File size={32} color="#8c98a8" />;
  };

  const handlePreview = (file: IArchivo) => {
    const url = `http://localhost:3001${file.ruta}`;
    
    if (file.tipo.startsWith('image/')) {
      setPreviewImage(url);
    } else if (file.tipo.includes('pdf')) {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      alert('La vista previa no está disponible para este tipo de archivo. Por favor, descárgalo.');
    }
  };

  const confirmDelete = () => {
    if (itemToDelete) deleteArchivo(itemToDelete);
    setItemToDelete(null);
  };

  return (
    <div className="sale-container">
      <div className="sale-master">
        
        <div className="upload-zone" onClick={() => fileInputRef.current?.click()}>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            style={{ display: 'none' }} 
            accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
          />
          <UploadCloud size={48} color="#1d5fc9" style={{ marginBottom: '16px' }} />
          <h3>{uploading ? 'Subiendo archivo...' : 'Haz clic para subir un archivo'}</h3>
          <p>Imágenes, PDFs o documentos de hasta 10MB</p>
        </div>

        <h2 style={{ marginTop: '2rem', marginBottom: '1rem' }}>Mis Archivos</h2>

        {loading ? (
          <p>Cargando archivos...</p>
        ) : archivos.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#888', padding: '2rem' }}>No tienes archivos subidos aún.</p>
        ) : (
          <div className="archivos-grid">
            {archivos.map((file) => (
              <div className="archivo-card" key={file._id}>
                <div className="archivo-card__icon">
                  {getIconForType(file.tipo)}
                </div>
                <div className="archivo-card__info">
                  <h4 title={file.nombreOriginal}>{file.nombreOriginal}</h4>
                  <p>{formatSize(file.tamaño)} · {new Date(file.createdAt!).toLocaleDateString()}</p>
                </div>
                <div className="archivo-card__actions">
                  
                  {/* BOTÓN PREVIEW */}
                  <button 
                    className="btn-icon" 
                    onClick={() => handlePreview(file)} 
                    title="Vista previa"
                  >
                    <Eye size={18} />
                  </button>

                  {/* BOTÓN DESCARGAR */}
                  <a 
                    href={`http://localhost:3001${file.ruta}`} 
                    download={file.nombreOriginal}
                    target="_blank" 
                    rel="noreferrer" 
                    className="btn-icon" 
                    title="Descargar"
                  >
                    <Download size={18} />
                  </a>

                  <button className="btn-icon btn-danger" onClick={() => setItemToDelete(file._id!)} title="Eliminar">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {itemToDelete && (
        <ModalConfirm
          isOpen={!!itemToDelete}
          onClose={() => setItemToDelete(null)}
          onConfirm={confirmDelete}
          title="Eliminar archivo"
          message="¿Estás seguro que deseas eliminar este archivo? Esta acción no se puede deshacer."
          confirmText="Eliminar"
          cancelText="Cancelar"
        />
      )}

      {/* MODAL DE VISTA PREVIA PARA IMÁGENES */}
      {previewImage && (
        <div className="sale-modal sale-modal--open" role="dialog" aria-modal="true" onClick={() => setPreviewImage(null)}>
          <div className="sale-modal__backdrop" />
          <div 
            className="preview-modal-content" 
            onClick={(e) => e.stopPropagation()} 
          >
            <button className="preview-close" onClick={() => setPreviewImage(null)}>
              <X size={24} />
            </button>
            <img src={previewImage} alt="Vista previa" className="preview-image" />
          </div>
        </div>
      )}
    </div>
  );
};