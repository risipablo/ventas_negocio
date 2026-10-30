import type { Sale } from '../types/sale.types';
import { formatDate, buscarPorFecha } from './dateUtils';

const normalize = (s: string): string =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

export const filterSaleBySearch = (
  sales: Sale[],
  palabraClave: string
): Sale[] => {
  if (!palabraClave.trim()) return sales;

  const palabras = normalize(palabraClave).trim().split(/\s+/);

  return sales.filter((sale) => {
    const fecha = formatDate(sale.date);

    return palabras.every((palabra) => {
      const matchFecha = buscarPorFecha(sale.date, palabra) ||
        fecha.includes(palabra);

      const matchProductos = sale.items.some((item) =>
        normalize(item.name).includes(palabra)
      );

      const matchMetodo = normalize(sale.paymentMethod).includes(palabra);

      const matchTarjeta = sale.cardBrand
        ? normalize(sale.cardBrand).includes(palabra)
        : false;

      const matchCupon = sale.couponNumber
        ? normalize(sale.couponNumber).includes(palabra)
        : false;

      const matchNumero = sale.numberTarget
        ? normalize(sale.numberTarget).includes(palabra)
        : false;

      const matchTotal = sale.total.toString().includes(palabra);

      return (
        matchFecha ||
        matchProductos ||
        matchMetodo ||
        matchTarjeta ||
        matchCupon ||
        matchNumero ||
        matchTotal
      );
    });
  });
};