"use server";

import { prisma } from "@/lib/prisma";

export type ContactFormState = {
  ok: boolean;
  error?: string;
};

export async function submitContactRequest(
  _prev: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const serviceId = Number(formData.get("serviceId") ?? 0);
  const message = String(formData.get("message") ?? "").trim();

  if (!name || !email) {
    return { ok: false, error: "Veuillez renseigner votre nom et votre email." };
  }

  await prisma.request.create({
    data: {
      name,
      email,
      phone: phone || null,
      type: serviceId ? "DEVIS" : "CONTACT",
      serviceId: serviceId || null,
      message: message || null,
      status: "NOUVEAU",
    },
  });

  return { ok: true };
}
