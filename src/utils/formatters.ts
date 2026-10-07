import { Currency } from '../types/realEstate';

export function formatCurrency(
  amount: number,
  currency: Currency = 'USD',
  decimals: number = 0
): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return currency === 'USD' ? '$ 0' : 'S/. 0';
  }

  const prefix = currency === 'USD' ? '$' : 'S/.';
  const formatted = amount.toLocaleString('es-PE', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return `${prefix} ${formatted}`;
}

export function formatPct(value: number, decimals: number = 1): string {
  if (isNaN(value) || value === null || value === undefined) {
    return '0.0%';
  }
  return `${value.toFixed(decimals)}%`;
}

export function formatNumber(value: number, decimals: number = 0): string {
  if (isNaN(value) || value === null || value === undefined) {
    return '0';
  }
  return value.toLocaleString('es-PE', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export const PERUVIAN_DISTRICTS = [
  'Miraflores',
  'San Isidro',
  'Barranco',
  'Santiago de Surco',
  'San Borja',
  'Jesús María',
  'Magdalena del Mar',
  'Lince',
  'Pueblo Libre',
  'San Miguel',
  'Surquillo',
  'La Molina',
  'Cercado de Lima',
  'Chorrillos',
  'Arequipa (Centro/Cayma)',
  'Cusco (Wanchaq/Centro)',
  'Trujillo (Víctor Larco)',
  'Otro distrito',
];
