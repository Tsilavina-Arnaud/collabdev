"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export type RequestFormState = {
  error?: string;
};

export async function updateRequestStatusAction(
  id: number,
  status: string,
) {
  await prisma.request.update({
    where: { id },
    data: { status: status as never },
  });
  revalidatePath("/admin/requests");
  revalidatePath(`/admin/requests/${id}`);
}

export async function convertRequestToClientAction(id: number) {
  const request = await prisma.request.findUnique({ where: { id } });
  if (!request) return;

  const client = await prisma.client.create({
    data: {
      name: request.name,
      email: request.email || null,
      phone: request.phone || null,
    },
  });

  await prisma.request.update({
    where: { id },
    data: { clientId: client.id, status: "CONVERTI" },
  });

  revalidatePath("/admin/requests");
  revalidatePath(`/admin/requests/${id}`);
  redirect(`/admin/clients/${client.id}/edit`);
}

export async function linkRequestToClientAction(
  id: number,
  clientId: number,
) {
  await prisma.request.update({
    where: { id },
    data: { clientId, status: "CONVERTI" },
  });
  revalidatePath("/admin/requests");
  revalidatePath(`/admin/requests/${id}`);
}

export async function addFollowUpAction(
  target: { requestId?: number; clientId?: number },
  formData: FormData,
) {
  await prisma.followUp.create({
    data: {
      requestId: target.requestId ?? null,
      clientId: target.clientId ?? null,
      note: String(formData.get("note") ?? "").trim(),
      nextAction: String(formData.get("nextAction") ?? "").trim() || null,
      status: "A_FAIRE",
      dueDate: String(formData.get("dueDate") ?? "").trim()
        ? new Date(String(formData.get("dueDate")))
        : null,
    },
  });

  revalidatePath("/admin/requests");
  revalidatePath("/admin/followups");
  if (target.requestId) revalidatePath(`/admin/requests/${target.requestId}`);
  if (target.clientId) revalidatePath(`/admin/clients/${target.clientId}`);
}

export async function updateFollowUpStatusAction(id: number, status: string) {
  await prisma.followUp.update({
    where: { id },
    data: { status: status as never },
  });
  revalidatePath("/admin/followups");
  revalidatePath("/admin/requests");
}
