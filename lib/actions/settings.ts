"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { hashPassword, verifyPassword } from "@/lib/password";

export type SettingsFormState = {
  error?: string;
};

export async function updateCompanyInfoAction(
  formData: FormData,
): Promise<SettingsFormState> {
  const first = await prisma.companyInfo.findFirst();
  const data = {
    name: String(formData.get("name") ?? "").trim() || "collab·dev",
    legalName:
      String(formData.get("legalName") ?? "").trim() || "Collectif collab·dev",
    representative: String(formData.get("representative") ?? "").trim(),
    representativeRole: String(formData.get("representativeRole") ?? "").trim(),
    address: String(formData.get("address") ?? "").trim(),
    phone: String(formData.get("phone") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    website: String(formData.get("website") ?? "").trim(),
    taxId: String(formData.get("taxId") ?? "").trim(),
    iban: String(formData.get("iban") ?? "").trim(),
    bic: String(formData.get("bic") ?? "").trim(),
    currency: String(formData.get("currency") ?? "EUR").trim() || "EUR",
  };

  if (first) {
    await prisma.companyInfo.update({ where: { id: first.id }, data });
  } else {
    await prisma.companyInfo.create({ data });
  }

  revalidatePath("/admin/settings");
  return {};
}

export async function changePasswordAction(
  formData: FormData,
): Promise<SettingsFormState> {
  const current = String(formData.get("currentPassword") ?? "");
  const next = String(formData.get("newPassword") ?? "");
  const confirm = String(formData.get("confirmPassword") ?? "");
  const email = String(formData.get("email") ?? "").trim().toLowerCase();

  if (next.length < 6) {
    return { error: "Le nouveau mot de passe doit contenir au moins 6 caractères." };
  }
  if (next !== confirm) {
    return { error: "Les mots de passe ne correspondent pas." };
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user?.password) {
    return { error: "Utilisateur introuvable." };
  }

  const valid = await verifyPassword(current, user.password);
  if (!valid) {
    return { error: "Mot de passe actuel incorrect." };
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { password: await hashPassword(next) },
  });

  revalidatePath("/admin/settings");
  return {};
}
