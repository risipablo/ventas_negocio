import { useMemo } from "react";
import type { IGasto } from "../types/gastos.types";
import { formatDate } from "../../sales/utils/dateUtils";


export const useStatsGastos = (
    gastos:IGasto[],
    filterGastos:IGasto[]
) => {

    const lastSaleProduct = useMemo(() => {
        const data = filterGastos.length > 0 ? filterGastos : gastos

        if(data.length === 0){
            return 'No hay gastos registrados'
        }

        const lastSale = data[filterGastos.length - 1]
        return `${formatDate(lastSale.fecha)}
            ${lastSale.proveedor.charAt(0).toUpperCase() + lastSale.proveedor.slice(1)}
            $${lastSale.monto.toLocaleString(
                'es-AR', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            })} ${lastSale.estado.charAt(0).toUpperCase() + lastSale.estado.slice(1)}
        `
    },[gastos,filterGastos])

    const totalMonto = useMemo(() => {
        const data = filterGastos.length > 0 ? filterGastos : gastos
        const condicionesExcluidas = ['nota de credito']

        return data.reduce((total,g) => {
            if(!g.estado) return total
            if(condicionesExcluidas.includes(g.estado.toLowerCase())) return total
            return total + (g.monto || 0)
        },0)
    },[gastos,filterGastos])

    return{
        lastSaleProduct,
        totalMonto
    }
}