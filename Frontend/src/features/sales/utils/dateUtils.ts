export const formatDate = (dateString: string | Date): string => {
  if (!dateString) return '';

  if (dateString instanceof Date) {
    const day = String(dateString.getDate()).padStart(2, '0');
    const month = String(dateString.getMonth() + 1).padStart(2, '0');
    const year = dateString.getFullYear();
    return `${day}/${month}/${year}`;
  }

  if (typeof dateString === 'string' && /^\d{4}-\d{2}-\d{2}/.test(dateString)) {
    const [year, month, day] = dateString.slice(0, 10).split('-');
    return `${day}/${month}/${year}`;
  }

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return String(dateString);

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const dateToInputValue = (d: Date): string => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const todayInputDate = (): string => {
  return dateToInputValue(new Date());
};

export const toInputDate = (
  value: string | Date | undefined | null
): string => {
  if (!value) return todayInputDate();

  if (value instanceof Date) {
    return dateToInputValue(value);
  }

  if (/^\d{4}-\d{2}-\d{2}/.test(value)) {
    return value.slice(0, 10);
  }

  const d = new Date(value);
  if (isNaN(d.getTime())) return todayInputDate();
  return dateToInputValue(d);
};

export const inputDateToISO = (inputValue: string): string => {
  if (!inputValue) return new Date().toISOString();
  const [year, month, day] = inputValue.split('-').map(Number);
  const local = new Date(year, month - 1, day, 12, 0, 0, 0);
  return local.toISOString();
};

export const buscarPorFecha = (
  fechaStr: string | Date,
  palabra: string
): boolean => {
  if (!fechaStr || !palabra) return false;

  let fechaNormalizada = fechaStr;
  if (typeof fechaStr === 'string' && fechaStr.includes('-')) {
    fechaNormalizada = fechaStr.split('T')[0];
  }

  const date =
    fechaNormalizada instanceof Date
      ? fechaNormalizada
      : new Date(fechaNormalizada);
  if (isNaN(date.getTime())) return false;

  const year = String(date.getFullYear());
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  const meses: Record<string, string> = {
    '01': 'enero',
    '02': 'febrero',
    '03': 'marzo',
    '04': 'abril',
    '05': 'mayo',
    '06': 'junio',
    '07': 'julio',
    '08': 'agosto',
    '09': 'septiembre',
    '10': 'octubre',
    '11': 'noviembre',
    '12': 'diciembre',
  };

  const nombreMes = meses[month] || '';
  const fechaFormateada = `${day}/${month}/${year}`;
  const termino = palabra.trim().toLowerCase();

  return (
    nombreMes.includes(termino) ||
    year.includes(termino) ||
    `${nombreMes} ${year}`.includes(termino) ||
    `${month}/${year}`.includes(termino) ||
    fechaFormateada.includes(termino)
  );
};