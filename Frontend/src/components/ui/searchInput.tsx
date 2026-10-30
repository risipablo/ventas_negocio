import { useState, type KeyboardEvent } from 'react';
import { Search, X } from 'lucide-react';
import '../../styles/search.css';

interface SearchInputProps {
  onSearch: (value: string) => void;
  placeholder?: string;
  loading?: boolean;
}

export const SearchInput = ({ onSearch, placeholder = 'Buscar...', loading = false }: SearchInputProps) => {
  const [localValue, setLocalValue] = useState('');

  const handleSearch = () => {
    onSearch(localValue.trim());
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  const handleClear = () => {
    setLocalValue('');
    onSearch('');
  };

  return (
    <div className="search-container">
      <Search className="search-icon" size={20} />
      
      <input
        type="text"
        className="search-input"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
      />

      {loading && (
        <div className="spinner spinner-sm" style={{ borderTopColor: '#1d5fc9', marginRight: '8px' }} />
      )}

      {localValue && !loading && (
        <button
          type="button"
          className="search-clear-btn"
          onClick={handleClear}
          aria-label="Limpiar búsqueda"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};