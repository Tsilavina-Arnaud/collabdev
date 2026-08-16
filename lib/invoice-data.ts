import type { InvoicePdfData } from "@/lib/invoice-pdf";

type InvoiceWithRelations = {
  reference: string;
  type: string;
  status: string;
  date: Date;
  dueDate: Date | null;
  totalAmount: { toString(): string };
  note: string | null;
  client: {
    name: string;
    company: string | null;
    email: string | null;
    phone: string | null;
    address: string | null;
  };
  items: {
    label: string;
    quantity: number;
    unitPrice: { toString(): string };
    total: { toString(): string };
    free: boolean;
  }[];
  payments: {
    method: string;
    plan: string;
    currentNumber: number;
    totalInstallments: number;
    amountPaid: { toString(): string };
    remaining: { toString(): string };
    paymentDate: Date | null;
  }[];
};

type CompanyInfoLike = {
  name: string;
  legalName: string;
  representative: string;
  representativeRole: string;
  legalStatus: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  taxId: string | null;
  iban: string | null;
  bic: string | null;
} | null;

export function buildInvoicePdfData(
  invoice: InvoiceWithRelations,
  company: CompanyInfoLike,
): InvoicePdfData {
  return {
    reference: invoice.reference,
    type: invoice.type,
    status: invoice.status,
    date: invoice.date,
    dueDate: invoice.dueDate,
    client: {
      name: invoice.client.name,
      company: invoice.client.company,
      email: invoice.client.email,
      phone: invoice.client.phone,
      address: invoice.client.address,
    },
    items: invoice.items.map((item) => ({
      label: item.label,
      quantity: item.quantity,
      unitPrice: Number(item.unitPrice),
      total: Number(item.total),
      free: item.free,
    })),
    payments: invoice.payments.map((p) => ({
      method: p.method,
      plan: p.plan,
      currentNumber: p.currentNumber,
      totalInstallments: p.totalInstallments,
      amountPaid: Number(p.amountPaid),
      remaining: Number(p.remaining),
      paymentDate: p.paymentDate,
    })),
    totalAmount: Number(invoice.totalAmount),
    note: invoice.note,
    company: {
      name: company?.name ?? "collab·dev",
      legalName: company?.legalName ?? "Collectif collab·dev",
      representative: company?.representative ?? "",
      representativeRole: company?.representativeRole ?? "",
      legalStatus: company?.legalStatus,
      address: company?.address,
      phone: company?.phone,
      email: company?.email,
      website: company?.website,
      taxId: company?.taxId,
      iban: company?.iban,
      bic: company?.bic,
    },
    paid: invoice.status === "PAYEE",
  };
}
