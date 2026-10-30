import { useEffect, useMemo, useState } from "react"
import { X, ChevronDown } from "lucide-react"
import type { IList } from "../types/type.list"

interface Props {
    products: IList[]
    setFilterProducts: React.Dispatch<React.SetStateAction<IList[]>>
    onFilterChange?: (filters: {
        brandFilter: string
        petFilter: string
        ageFilter: string
        kgFilter: string
        categoriaFilter: string
        condicionFilter: string
    }) => void
}

const PETS = ['Perro', 'Gato', 'Mixto'];
const AGES = [
    'Adulto', 'Mini Adulto', 'Cachorro', 'Mini Puppy', 'Derma Adulto',
    'Derma Mini Adulto', 'Urinary', 'Senior', 'Criadores', 'Lata',
    'Pouch', 'Weight Control', 'Medicado'
];
const CATEGORIES = ['Alimento', 'Accesorio', 'Indumentaria', 'Húmedo', 'Snack', 'Pipeta', 'Higiene', 'Hueso'];

const CONDICIONES = ['-', 'Efectivo', 'No actualizado', 'Discontinuado'];

export const FilterList = ({
    products,
    setFilterProducts,
    onFilterChange
}: Props) => {
    const [brandFilter, setBrandFilter] = useState('')
    const [petFilter, setPetFilter] = useState('')
    const [ageFilter, setAgeFilter] = useState('')
    const [kgFilter, setKgFilter] = useState('')
    const [categoriaFilter, setCategoriaFilter] = useState('')
    const [condicionFilter, setCondicionFilter] = useState('')

    const filterListProducts = useMemo(() => {
        let filteredProducts = products

        if (brandFilter) {
            filteredProducts = filteredProducts.filter(product => product.marca.toLowerCase().includes(brandFilter.toLowerCase()))
        }
        if (petFilter) {
            filteredProducts = filteredProducts.filter(product => product.mascota.toLowerCase().includes(petFilter.toLowerCase()))
        }
        if (ageFilter) {
            filteredProducts = filteredProducts.filter(product => product.edad.toLowerCase() === ageFilter.toLowerCase())
        }
        if (kgFilter) {
            filteredProducts = filteredProducts.filter(product => product.kilo.toLowerCase().includes(kgFilter.toLowerCase()))
        }
        if (categoriaFilter) {
            filteredProducts = filteredProducts.filter(product => product.categoria.toLowerCase() === categoriaFilter.toLowerCase())
        }

        if (condicionFilter) {
            filteredProducts = filteredProducts.filter(product => product.condicion === condicionFilter)
        }

        return filteredProducts;
    }, [products, brandFilter, petFilter, ageFilter, kgFilter, categoriaFilter, condicionFilter])

    const cleanFilters = () => {
        setBrandFilter('')
        setPetFilter('')
        setAgeFilter('')
        setKgFilter('')
        setCategoriaFilter('')
        setCondicionFilter('')
    }

    useEffect(() => {
        setFilterProducts(filterListProducts)
    }, [filterListProducts, setFilterProducts])

    useEffect(() => {
        onFilterChange?.({
            brandFilter,
            petFilter,
            ageFilter,
            kgFilter,
            categoriaFilter,
            condicionFilter
        })
    }, [onFilterChange, brandFilter, petFilter, ageFilter, kgFilter, categoriaFilter, condicionFilter])

    const hasActiveFilters = Boolean(
        brandFilter || petFilter || ageFilter || kgFilter || categoriaFilter || condicionFilter
    )

    
    const uniqueBrands = Array.from(new Set(products.map(product => product.marca)))

    return (
        <div className="filter-sales">
            <div className="filter-sales__row">
                
                
                <div className="filter-field">
                    <select
                        value={brandFilter}
                        onChange={(e) => setBrandFilter(e.target.value)}
                        aria-label="Seleccionar Marca"
                    >
                        <option value="">Seleccionar Marca</option>
                        {uniqueBrands.map((marca) => (
                            <option key={marca} value={marca}>
                                {marca}
                            </option>
                        ))}
                    </select>
                    <ChevronDown size={16} className="filter-field__icon" />
                </div>

                
                <div className="filter-field">
                    <select
                        value={petFilter}
                        onChange={(e) => setPetFilter(e.target.value)}
                        aria-label="Seleccionar Mascota"
                    >
                        <option value="">Seleccionar Mascota</option>
                        {PETS.map((pet) => (
                            <option key={pet} value={pet}>
                                {pet}
                            </option>
                        ))}
                    </select>
                    <ChevronDown size={16} className="filter-field__icon" />
                </div>

                
                <div className="filter-field">
                    <select
                        value={ageFilter}
                        onChange={(e) => setAgeFilter(e.target.value)}
                        aria-label="Seleccionar Edad"
                    >
                        <option value="">Seleccionar Edad</option>
                        {AGES.map((age) => (
                            <option key={age} value={age}>
                                {age}
                            </option>
                        ))}
                    </select>
                    <ChevronDown size={16} className="filter-field__icon" />
                </div>

                
                <div className="filter-field">
                    <select
                        value={kgFilter}
                        onChange={(e) => setKgFilter(e.target.value)}
                        aria-label="Seleccionar Unidad"
                    >
                        <option value="">Seleccionar Unidad</option>
                        {Array.from(new Set(products.map(product => product.kilo))).map((kg) => (
                            <option key={kg} value={kg}>
                                {kg}
                            </option>
                        ))}
                    </select>
                    <ChevronDown size={16} className="filter-field__icon" />
                </div>

                
                <div className="filter-field">
                    <select
                        value={categoriaFilter}
                        onChange={(e) => setCategoriaFilter(e.target.value)}
                        aria-label="Seleccionar Categoría"
                    >
                        <option value="">Seleccionar Categoría</option>
                        {CATEGORIES.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>
                    <ChevronDown size={16} className="filter-field__icon" />
                </div>

                <div className="filter-field">
                    <select
                        value={condicionFilter}
                        onChange={(e) => setCondicionFilter(e.target.value)}
                        aria-label="Seleccionar Condición"
                    >
                        <option value="">Seleccionar Condición</option>
                        {CONDICIONES.map((cond) => (
                            <option key={cond} value={cond}>
                                {cond === '-' ? 'Ninguno' : cond}
                            </option>
                        ))}
                    </select>
                    <ChevronDown size={16} className="filter-field__icon" />
                </div>
                
                <button
                    type="button"
                    className="filter-sales__reset"
                    onClick={cleanFilters}
                    disabled={!hasActiveFilters}
                    aria-label="Limpiar filtros"
                    title="Limpiar filtros"
                >
                    <X size={18} />
                </button>
            </div>
        </div>
    )
}