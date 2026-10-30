import { useEffect, useMemo, useState } from 'react';
import { X, ChevronDown } from 'lucide-react';
import type { IProveedor } from '../types/proveedores.type';

interface Props {
  proveedores: IProveedor[];
  setFilterProveedores: React.Dispatch<React.SetStateAction<IProveedor[]>>;
}

const PETS = ['Perro', 'Gato', 'Mixto'];

export const FilterProveedores = ({ proveedores, setFilterProveedores }: Props) => {
  const [providerFilter, setProviderFilter] = useState('');
  const [brandFilter, setBrandFilter] = useState('');
  const [petFilter, setPetFilter] = useState('');
  const [ageFilter, setAgeFilter] = useState('');

  const filterList = useMemo(() => {
    let filtered = proveedores;

    if (providerFilter) {
      filtered = filtered.filter((p) => p.proveedores.toLowerCase().includes(providerFilter.toLowerCase()));
    }
    if (brandFilter) {
      filtered = filtered.filter((p) => p.marcas.toLowerCase().includes(brandFilter.toLowerCase()));
    }
    if (petFilter) {
      filtered = filtered.filter((p) => p.mascotas.toLowerCase() === petFilter.toLowerCase());
    }

    if (ageFilter) {
      filtered = filtered.filter((p) => p.edades.toLowerCase() === ageFilter.toLowerCase());
    }

    return filtered;
  }, [proveedores, providerFilter, brandFilter, petFilter,ageFilter]);

  const cleanFilters = () => {
    setProviderFilter('');
    setBrandFilter('');
    setPetFilter('');
    setAgeFilter('');
  };

  useEffect(() => {
    setFilterProveedores(filterList);
  }, [filterList, setFilterProveedores]);

  const hasActiveFilters = Boolean(providerFilter || brandFilter || petFilter || ageFilter);

  const uniqueProviders = Array.from(new Set(proveedores.map((p) => p.proveedores)));
  const uniqueBrands = Array.from(new Set(proveedores.map((p) => p.marcas)));
  const uniqueAges = Array.from(new Set(proveedores.map((p) => p.edades)));

  return (
    <div className="filter-sales">
      <div className="filter-sales__row">
        <div className="filter-field">
          <select value={providerFilter} onChange={(e) => setProviderFilter(e.target.value)}>
            <option value="">Seleccionar Proveedor</option>
            {uniqueProviders.map((prov) => <option key={prov} value={prov}>{prov}</option>)}
          </select>
          <ChevronDown size={16} className="filter-field__icon" />
        </div>

        <div className="filter-field">
          <select value={brandFilter} onChange={(e) => setBrandFilter(e.target.value)}>
            <option value="">Seleccionar Marca</option>
            {uniqueBrands.map((brand) => <option key={brand} value={brand}>{brand}</option>)}
          </select>
          <ChevronDown size={16} className="filter-field__icon" />
        </div>

        <div className="filter-field">
          <select value={petFilter} onChange={(e) => setPetFilter(e.target.value)}>
            <option value="">Seleccionar Mascota</option>
            {PETS.map((pet) => <option key={pet} value={pet}>{pet}</option>)}
          </select>
          <ChevronDown size={16} className="filter-field__icon" />
        </div>

        <div className="filter-field">
          <select value={ageFilter} onChange={(e) => setAgeFilter(e.target.value)}>
            <option value="">Seleccionar Edad</option>
            {uniqueAges.map((age) => <option key={age} value={age}>{age}</option>)}
          </select>
          <ChevronDown size={16} className="filter-field__icon" />
        </div>

        <button
          type="button"
          className="filter-sales__reset"
          onClick={cleanFilters}
          disabled={!hasActiveFilters}
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
};