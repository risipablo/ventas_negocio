import { useMemo } from 'react';
import { format, subMonths, isSameMonth } from 'date-fns';
import { es } from 'date-fns/locale';
import type { Sale } from '../../sales/types/sale.types';

export const useSalesStats = (sales: Sale[]) => {
  const salesByMonth = useMemo(() => {
    const months = Array.from({ length: 12 }, (_, i) => ({
      name: format(new Date(2024, i, 1), 'MMM', { locale: es }),
      total: 0,
      monthNumber: i + 1,
    }));

    sales.forEach((sale) => {
      const date = new Date(sale.date);
      const m = date.getMonth();
      if (m >= 0 && m < 12) {
        months[m].total += sale.total;
      }
    });
    return months;
  }, [sales]);

  const topProducts = useMemo(() => {
    const counts: Record<string, number> = {};
    sales.forEach((sale) => {
      sale.items.forEach((item) => {
        const name = item.name.toLowerCase();
        counts[name] = (counts[name] || 0) + item.quantity;
      });
    });
    return Object.entries(counts)
      .map(([name, quantity]) => ({ name, quantity }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);
  }, [sales]);

  const paymentMethods = useMemo(() => {
    const counts: Record<string, number> = {};
    sales.forEach((sale) => {
      counts[sale.paymentMethod] = (counts[sale.paymentMethod] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [sales]);

  const currentMonthVsPrevious = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    let currentTotal = 0;
    let previousTotal = 0;

    sales.forEach((sale) => {
      const date = new Date(sale.date);
      if (date.getFullYear() === currentYear) {
        if (date.getMonth() === currentMonth) {
          currentTotal += sale.total;
        } else if (date.getMonth() === currentMonth - 1) {
          previousTotal += sale.total;
        }
      }
    });

    const diff = currentTotal - previousTotal;
    const percentage = previousTotal === 0 ? 100 : (diff / previousTotal) * 100;

    return [
      { name: format(subMonths(now, 1), 'MMMM', { locale: es }), total: previousTotal },
      { name: format(now, 'MMMM', { locale: es }), total: currentTotal },
      { name: 'Diferencia', total: Math.abs(diff), isDiff: true }
    ];
  }, [sales]);

  return { salesByMonth, topProducts, paymentMethods, currentMonthVsPrevious };
};