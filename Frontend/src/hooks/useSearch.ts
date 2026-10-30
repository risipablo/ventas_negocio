import { useMemo, useState, useEffect } from 'react';

export function useSearch<T>(
  data: T[],
  searchKeys: (keyof T)[],
  debounceMs: number = 300
) {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Efecto para el Debounce (espera a que el usuario deje de escribir)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, debounceMs);

    return () => clearTimeout(handler);
  }, [query, debounceMs]);

  // Memorizamos los resultados para que no recalcule en cada render
  const results = useMemo(() => {
    if (!debouncedQuery.trim()) return data;

    const lowerQuery = debouncedQuery.toLowerCase().trim();
    const words = lowerQuery.split(/\s+/); 

    return data.filter((item) => {
      return words.every((word) => {
        
        // Buscar propiedas especificas
        return searchKeys.some((key) => {
          const value = item[key];
          if (value === null || value === undefined) return false;
          
          // Convertir todo a string
          return String(value).toLowerCase().includes(word);
        });
      });
    });
  }, [data, debouncedQuery, searchKeys]);

  return {
    query,
    setQuery,
    results,
    isSearching: debouncedQuery.length > 0,
  };
}