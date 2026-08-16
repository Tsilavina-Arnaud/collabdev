export function formatCurrency(
  amount: number | string | { toString(): string },
  currency = "EUR",
): string {
  const value =
    typeof amount === "number"
      ? amount
      : parseFloat(typeof amount === "string" ? amount : amount.toString());
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(value);
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(d);
}

export function formatDateTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

const TYPE_PREFIX: Record<string, string> = {
  FACTURE: "INV",
  PROFORMA: "PRO",
};

export function buildInvoiceReference(
  type: string,
  year: number,
  sequence: number,
): string {
  const prefix = TYPE_PREFIX[type] ?? "INV";
  return `${prefix}-${year}-${String(sequence).padStart(4, "0")}`;
}
