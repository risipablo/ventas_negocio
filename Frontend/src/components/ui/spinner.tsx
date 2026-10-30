interface LoaderProps {
  fullScreen?: boolean;
  text?:
    | 'cargando datos'
    | 'cargando ventas'
    | 'cargando productos'
    | 'cargando clientes'
    | 'cargando proveedores'
    | 'cargando usuarios'
    | null;
}

export const LogoSpinner = ({ fullScreen = false, text = null }: LoaderProps) => {
  return (
    <div
      className={`spinner-container${fullScreen ? ' spinner-container--full' : ''}`}
      role="status"
      aria-live="polite"
    >
      <div className="spinner" />

      {text ? (
        <p className="spinner-text">
          {text}
    
          <span className="spinner-dots" aria-hidden="true">
            <i>.</i>
            <i>.</i>
            <i>.</i>
            <i>.</i>
            <i>.</i>
          </span>
        </p>
      ) : (
        <span className="sr-only">Cargando datos</span>
      )}
    </div>
  );
};