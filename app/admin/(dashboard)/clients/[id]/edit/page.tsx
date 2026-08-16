import Link from "next/link";
import { notFound } from "next/navigation";

import { ClientForm } from "@/components/admin/client-form";
import { DeleteButton } from "@/components/admin/delete-button";
import { FollowUpForm } from "@/components/admin/followup-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDate } from "@/lib/format";
import {
  deleteClientAction,
  updateClientAction,
  type ClientFormState,
} from "@/lib/actions/clients";

const invoiceStatusLabel: Record<string, string> = {
  EN_ATTENTE: "En attente",
  PAYEE: "Payée",
  ANNULEE: "Annulée",
};

export const metadata = { title: "Client" };

export default async function ClientEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const client = await prisma.client.findUnique({
    where: { id: Number(id) },
    include: {
      invoices: {
        include: { payments: true },
        orderBy: { date: "desc" },
      },
      requests: { orderBy: { createdAt: "desc" } },
      followUps: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!client) notFound();

  const boundUpdate = async (
    prev: ClientFormState,
    fd: FormData,
  ): Promise<ClientFormState> => {
    "use server";
    return updateClientAction(client.id, prev, fd);
  };

  const handleDelete = async () => {
    "use server";
    await deleteClientAction(client.id);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-medium tracking-tight">{client.name}</h1>
          <p className="text-sm text-muted-foreground">
            {client.company ?? "Particulier"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
              nativeButton={false} render={<Link href={`/admin/invoices/new?clientId=${client.id}`} />} variant="outline">
            Créer une facture
          </Button>
          <DeleteButton
            description={`Supprimer le client "${client.name}" et toutes ses données associées ?`}
            action={handleDelete}
            redirectTo="/admin/clients"
          />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Informations</CardTitle>
          </CardHeader>
          <CardContent>
            <ClientForm
              action={boundUpdate}
              defaults={{
                name: client.name,
                company: client.company,
                email: client.email,
                phone: client.phone,
                address: client.address,
              }}
            />
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Ajouter un suivi</CardTitle>
              <CardDescription>
                Notez un échange, une prochaine action ou une échéance.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FollowUpForm clientId={client.id} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Historique de suivi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {client.followUps.map((f) => (
                <div key={f.id} className="rounded-lg border border-border p-3">
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant="outline">{formatDate(f.createdAt)}</Badge>
                    {f.dueDate ? (
                      <span className="text-xs text-muted-foreground">
                        Échéance : {formatDate(f.dueDate)}
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-2 text-sm">{f.note}</p>
                  {f.nextAction ? (
                    <p className="mt-1 text-xs text-muted-foreground">
                      Suivant : {f.nextAction}
                    </p>
                  ) : null}
                </div>
              ))}
              {client.followUps.length === 0 ? (
                <p className="py-4 text-center text-sm text-muted-foreground">
                  Aucun suivi enregistré.
                </p>
              ) : null}
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Factures</CardTitle>
        </CardHeader>
        <CardContent className="px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Référence</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Statut</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {client.invoices.map((inv) => (
                <TableRow key={inv.id}>
                  <TableCell>
                    <Link
                      href={`/admin/invoices/${inv.id}`}
                      className="font-medium hover:underline"
                    >
                      {inv.reference}
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(inv.date)}
                  </TableCell>
                  <TableCell>{formatCurrency(inv.totalAmount)}</TableCell>
                  <TableCell>
                    <Badge variant={inv.status === "PAYEE" ? "default" : "secondary"}>
                      {invoiceStatusLabel[inv.status]}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
              {client.invoices.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="py-8 text-center text-muted-foreground"
                  >
                    Aucune facture pour ce client.
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
