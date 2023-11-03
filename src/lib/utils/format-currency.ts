import { type Currency } from "$/server/api/routers/debts/mutations/input";

export function formatCurrency(value: number, currency?: Currency): string {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: currency ?? "COP",
  }).format(value);
}
