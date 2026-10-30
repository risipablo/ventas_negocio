import { createContext, createElement, useContext, useState, type ReactNode, } from 'react';

export interface NotaItem {
  nombre: string;
  cantidad: number;
  precio: number;
}

export interface Nota {
  _id?: string;
  fecha: string;
  proveedor: string;
  items: NotaItem[];
  total: number;
}

interface NotaContextType {
  draftNota: Partial<Nota> | null;
  setDraftNota: (nota: Partial<Nota> | null) => void;
}

const NotaContext = createContext<NotaContextType | undefined>(undefined);

export const NotaProvider = ({ children }: { children: ReactNode }) => {
  const [draftNota, setDraftNota] = useState<Partial<Nota> | null>(null);

  return createElement(
    NotaContext.Provider,
    { value: { draftNota, setDraftNota } },
    children
  );
};

export const useNotaContext = () => {
  const context = useContext(NotaContext);
  if (!context) throw new Error('useNotaContext debe usarse dentro de NotaProvider');
  return context;
};