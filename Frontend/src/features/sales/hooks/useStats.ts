import { useMemo } from "react";
import type { Sale } from "../types/sale.types";
import { formatDate } from "../utils/dateUtils";

export const useStats = (
    sales:Sale[],
    filterSales:Sale[]
) => {

    const lastSaleProduct = useMemo(() => {
        const data = filterSales.length > 0 ? filterSales : sales

        if(data.length === 0){
            return 'No hay ventas registradas'
        }

        const lastSale = data[data.length - 1]
        return `${formatDate(lastSale.date)}
            ${lastSale.items.map(item => `${item.name.charAt(0).toUpperCase() + item.name.slice(1)}`).join(', ')}
            $${lastSale.total.toLocaleString(
                'es-AR', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            })}
        `
    },[sales,filterSales])

    const totalMonto = useMemo(() => {
        const data = filterSales.length > 0 ? filterSales : sales
        const condicionesExcluidas = ['debe']

        return data.reduce((total,g) => {
            if(!g.paymentMethod) return total
            if(condicionesExcluidas.includes(g.paymentMethod.toLowerCase())) return total
            return total + (g.total || 0)
        },0)
    },[sales,filterSales])

    return{
        lastSaleProduct,
        totalMonto
    }
}