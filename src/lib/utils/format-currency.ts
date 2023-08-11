import { type Currency } from "$/server/api/routers/debts/create-debt/input";

export function formatCurrency(value: number, currency?: Currency): string {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: currency ?? "COP",
  }).format(value);
}
