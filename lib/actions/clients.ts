"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export type ClientFormState = {
  error?: string;
};

export async function createClientAction(
  _prev: ClientFormState,
  formData: FormData,
): Promise<ClientFormState> {
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { error: "Le nom du client est obligatoire." };

  const client = await prisma.client.create({
    data: {
      name,
      company: String(formData.get("company") ?? "").trim() || null,
      email: String(formData.get("email") ?? "").trim() || null,
      phone: String(formData.get("phone") ?? "").trim() || null,
      address: String(formData.get("address") ?? "").trim() || null,
    },
  });

  revalidatePath("/admin/clients");
  redirect(`/admin/clients/${client.id}/edit`);
}

export async function updateClientAction(
  id: number,
  _prev: ClientFormState,
  formData: FormData,
): Promise<ClientFormState> {
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { error: "Le nom du client est obligatoire." };

  await prisma.client.update({
    where: { id },
    data: {
      name,
      company: String(formData.get("company") ?? "").trim() || null,
      email: String(formData.get("email") ?? "").trim() || null,
      phone: String(formData.get("phone") ?? "").trim() || null,
      address: String(formData.get("address") ?? "").trim() || null,
    },
  });

  revalidatePath("/admin/clients");
  revalidatePath(`/admin/clients/${id}/edit`);
  redirect(`/admin/clients`);
}

export async function deleteClientAction(id: number) {
  await prisma.$transaction([
    prisma.invoice.deleteMany({ where: { clientId: id } }),
    prisma.client.delete({ where: { id } }),
  ]);
  revalidatePath("/admin/clients");
}
