"use server";

import { randomBytes } from "node:crypto";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { buildInvoiceReference } from "@/lib/format";

export type InvoiceFormState = {
  error?: string;
};

const planInstallments: Record<string, number> = {
  PAIEMENT_COMPLET: 1,
  PAIEMENT_2_FOIS: 2,
  PAIEMENT_3_FOIS: 3,
};

async function nextReference(type: string, year: number): Promise<string> {
  const prefix = type === "PROFORMA" ? "PRO" : "INV";
  const last = await prisma.invoice.findFirst({
    where: { reference: { startsWith: `${prefix}-${year}-` } },
    orderBy: { reference: "desc" },
  });
  const sequence = last
    ? parseInt(last.reference.split("-").pop() ?? "0", 10) + 1
    : 1;
  return buildInvoiceReference(type, year, sequence);
}

export async function createInvoiceAction(
  _prev: InvoiceFormState,
  formData: FormData,
): Promise<InvoiceFormState> {
  const clientId = Number(formData.get("clientId") ?? 0);
  const type = String(formData.get("type") ?? "FACTURE");
  const date = String(formData.get("date") ?? "");
  const dueDate = String(formData.get("dueDate") ?? "");
  const note = String(formData.get("note") ?? "").trim();
  const itemCount = Number(formData.get("itemCount") ?? 0);

  let client: { id: number };

  if (clientId) {
    client = { id: clientId };
  } else {
    const newName = String(formData.get("newClientName") ?? "").trim();
    if (!newName) {
      return { error: "Sélectionnez un client ou renseignez un nouveau client." };
    }
    client = await prisma.client.create({
      data: {
        name: newName,
        company: String(formData.get("newClientCompany") ?? "").trim() || null,
        email: String(formData.get("newClientEmail") ?? "").trim() || null,
        phone: String(formData.get("newClientPhone") ?? "").trim() || null,
      },
    });
  }

  const items: {
    label: string;
    quantity: number;
    unitPrice: number;
    free: boolean;
    total: number;
  }[] = [];

  for (let i = 0; i < itemCount; i++) {
    const label = String(formData.get(`label_${i}`) ?? "").trim();
    if (!label) continue;
    const quantity = Number(formData.get(`quantity_${i}`) ?? 1) || 1;
    const unitPrice = Number(formData.get(`unitPrice_${i}`) ?? 0) || 0;
    const free = formData.get(`free_${i}`) === "on";
    items.push({
      label,
      quantity,
      unitPrice: free ? 0 : unitPrice,
      free,
      total: (free ? 0 : unitPrice) * quantity,
    });
  }

  if (items.length === 0) {
    return { error: "Ajoutez au moins une ligne à la facture." };
  }

  const totalAmount = items.reduce((sum, i) => sum + i.total, 0);
  const invoiceDate = date ? new Date(date) : new Date();
  const year = invoiceDate.getFullYear();

  const reference = await nextReference(type, year);

  const method = String(formData.get("paymentMethod") ?? "CARTE_BANCAIRE");
  const plan = String(formData.get("paymentPlan") ?? "PAIEMENT_COMPLET");
  const amountPaid = Number(formData.get("amountPaid") ?? 0) || 0;
  const paymentDate = String(formData.get("paymentDate") ?? "")
    ? new Date(String(formData.get("paymentDate")))
    : null;
  const installments = planInstallments[plan] ?? 1;

  const invoice = await prisma.invoice.create({
    data: {
      reference,
      type: type as never,
      status: amountPaid >= totalAmount ? "PAYEE" : "EN_ATTENTE",
      date: invoiceDate,
      dueDate: dueDate ? new Date(dueDate) : null,
      downloadToken: randomBytes(16).toString("hex"),
      clientId: client.id,
      note: note || null,
      totalAmount,
      items: {
        create: items.map((item) => ({
          label: item.label,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          total: item.total,
          free: item.free,
        })),
      },
      payments:
        amountPaid > 0
          ? {
              create: {
                method: method as never,
                plan: plan as never,
                currentNumber: amountPaid >= totalAmount ? installments : 1,
                totalInstallments: installments,
                amountPaid,
                remaining: Math.max(totalAmount - amountPaid, 0),
                paymentDate,
              },
            }
          : undefined,
    },
  });

  revalidatePath("/admin/invoices");
  redirect(`/admin/invoices/${invoice.id}`);
}

export async function updateInvoiceStatusAction(id: number, status: string) {
  await prisma.invoice.update({
    where: { id },
    data: { status: status as never },
  });
  revalidatePath("/admin/invoices");
  revalidatePath(`/admin/invoices/${id}`);
}

export async function registerPaymentAction(
  id: number,
  formData: FormData,
): Promise<InvoiceFormState> {
  const invoice = await prisma.invoice.findUnique({ where: { id } });
  if (!invoice) return { error: "Facture introuvable." };

  const total = Number(invoice.totalAmount);
  const method = String(formData.get("method") ?? "CARTE_BANCAIRE");
  const plan = String(formData.get("plan") ?? "PAIEMENT_COMPLET");
  const currentNumber = Number(formData.get("currentNumber") ?? 1) || 1;
  const amountPaid = Number(formData.get("amountPaid") ?? 0) || 0;
  const paymentDate = String(formData.get("paymentDate") ?? "")
    ? new Date(String(formData.get("paymentDate")))
    : new Date();
  const installments = planInstallments[plan] ?? 1;
  const remaining = Math.max(total - amountPaid, 0);

  await prisma.payment.create({
    data: {
      invoiceId: id,
      method: method as never,
      plan: plan as never,
      currentNumber,
      totalInstallments: installments,
      amountPaid,
      remaining,
      paymentDate,
    },
  });

  await prisma.invoice.update({
    where: { id },
    data: {
      status:
        amountPaid >= total
          ? "PAYEE"
          : invoice.status === "PAYEE"
            ? "PAYEE"
            : "EN_ATTENTE",
    },
  });

  revalidatePath("/admin/invoices");
  revalidatePath(`/admin/invoices/${id}`);
  return { error: undefined };
}

export async function deleteInvoiceAction(id: number) {
  await prisma.invoice.delete({ where: { id } });
  revalidatePath("/admin/invoices");
}

export async function ensureInvoiceDownloadTokenAction(id: number) {
  const invoice = await prisma.invoice.findUnique({ where: { id } });
  if (!invoice) return;

  if (!invoice.downloadToken) {
    await prisma.invoice.update({
      where: { id },
      data: { downloadToken: randomBytes(16).toString("hex") },
    });
  }
  revalidatePath(`/admin/invoices/${id}`);
}
