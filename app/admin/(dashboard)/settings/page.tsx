import { CompanySettingsForm } from "@/components/admin/company-settings-form";
import { PasswordForm } from "@/components/admin/password-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

export const metadata = { title: "Paramètres" };

export default async function SettingsPage() {
  const [company, user] = await Promise.all([
    prisma.companyInfo.findFirst(),
    getCurrentUser(),
  ]);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-medium tracking-tight">Paramètres</h1>
        <p className="text-sm text-muted-foreground">
          Informations utilisées sur les factures et le site.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Coordonnées du collectif</CardTitle>
          <CardDescription>
            Coordonnées affichées sur les factures et proformas.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CompanySettingsForm
            defaults={{
              name: company?.name ?? "collab·dev",
              legalName: company?.legalName ?? "Collectif collab·dev",
              representative: company?.representative ?? "",
              representativeRole: company?.representativeRole ?? "",
              address: company?.address ?? "",
              phone: company?.phone ?? "",
              email: company?.email ?? "",
              website: company?.website ?? "",
              taxId: company?.taxId ?? "",
              iban: company?.iban ?? "",
              bic: company?.bic ?? "",
              currency: company?.currency ?? "EUR",
            }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sécurité</CardTitle>
          <CardDescription>
            Modifier le mot de passe de votre compte.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PasswordForm email={user?.email ?? ""} />
        </CardContent>
      </Card>
    </div>
  );
}
