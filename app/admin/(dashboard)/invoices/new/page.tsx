import Link from "next/link";
import { InvoiceForm } from "@/components/admin/invoice-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Nouvelle facture" };

export default async function NewInvoicePage({
  searchParams,
}: {
  searchParams: Promise<{ clientId?: string }>;
}) {
  const { clientId } = await searchParams;

  const [services, clients] = await Promise.all([
    prisma.service.findMany({
      where: { active: true },
      orderBy: [{ isPack: "asc" }, { name: "asc" }],
      select: { id: true, name: true, price: true },
    }),
    prisma.client.findMany({
      select: { id: true, name: true, email: true },
      orderBy: { name: "asc" },
    }),
  ]);

  const serviceOptions = services.map((s) => ({
    id: s.id,
    name: s.name,
    price: Number(s.price),
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-medium tracking-tight">
            Nouvelle facture
          </h1>
          <p className="text-sm text-muted-foreground">
            Créez une facture ou une proforma selon le modèle CollabDev.
          </p>
        </div>
        <Button
              nativeButton={false} render={<Link href="/admin/invoices" />} variant="outline">
          Retour
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Détails de la facture</CardTitle>
        </CardHeader>
        <CardContent>
          <InvoiceForm
            services={serviceOptions}
            clients={clients}
            defaultClientId={clientId ? Number(clientId) : undefined}
          />
        </CardContent>
      </Card>
    </div>
  );
}
