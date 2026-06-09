import { Currency } from '../enums/currency.enum';

const RATES_TO_BRL: Record<Currency, number> = {
  [Currency.BRL]: 1,
  [Currency.ARS]: 0.005,
};

export function convertAmount(
  amount: number,
  from: Currency,
  to: Currency,
): number {
  if (from === to) {
    return amount;
  }

  const inBrl = amount * RATES_TO_BRL[from];
  return inBrl / RATES_TO_BRL[to];
}

export function parseDecimal(value: string | number): number {
  return typeof value === 'number' ? value : Number.parseFloat(value);
}
