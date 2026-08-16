import Link from "next/link";
import { FileText, Plus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDate } from "@/lib/format";

const statuses = ["EN_ATTENTE", "PAYEE", "ANNULEE"] as const;

const statusLabel: Record<string, string> = {
  EN_ATTENTE: "En attente",
  PAYEE: "Payée",
  ANNULEE: "Annulée",
};

const statusVariant: Record<string, "default" | "secondary" | "destructive"> = {
  EN_ATTENTE: "secondary",
  PAYEE: "default",
  ANNULEE: "destructive",
};

const typeLabel: Record<string, string> = {
  FACTURE: "Facture",
  PROFORMA: "Proforma",
};

export const metadata = { title: "Facturation" };

export default async function InvoicesPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;
  const activeTab = statuses.includes(tab as never) ? (tab as string) : "ALL";

  const invoices = await prisma.invoice.findMany({
    include: { client: true },
    orderBy: { date: "desc" },
  });

  const counts = statuses.reduce<Record<string, number>>((acc, s) => {
    acc[s] = 0;
    return acc;
  }, {});
  for (const i of invoices) {
    counts[i.status] = (counts[i.status] ?? 0) + 1;
  }

  const filtered =
    activeTab === "ALL"
      ? invoices
      : invoices.filter((i) => i.status === activeTab);

  const paidTotal = invoices
    .filter((i) => i.status === "PAYEE")
    .reduce((sum, i) => sum + Number(i.totalAmount), 0);
  const pendingTotal = invoices
    .filter((i) => i.status === "EN_ATTENTE")
    .reduce((sum, i) => sum + Number(i.totalAmount), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-medium tracking-tight">Facturation</h1>
          <p className="text-sm text-muted-foreground">
            Payé : {formatCurrency(paidTotal)} - En attente :{" "}
            {formatCurrency(pendingTotal)}
          </p>
        </div>
        <Button
              nativeButton={false} render={<Link href="/admin/invoices/new" />}>
          <Plus />
          Nouvelle facture
        </Button>
      </div>

      <Tabs value={activeTab}>
        <TabsList>
          <TabsTrigger value="ALL" nativeButton={false} render={<Link href="/admin/invoices" />}>
            Toutes ({invoices.length})
          </TabsTrigger>
          {statuses.map((s) => (
            <TabsTrigger
              key={s}
              value={s}
              nativeButton={false}
              render={<Link href={`/admin/invoices?tab=${s}`} />}
            >
              {statusLabel[s]} ({counts[s]})
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Référence</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead>Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((inv) => (
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
                      {inv.client.name}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {typeLabel[inv.type] ?? inv.type}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(inv.date)}
                    </TableCell>
                    <TableCell>{formatCurrency(inv.totalAmount)}</TableCell>
                    <TableCell>
                      <Badge variant={statusVariant[inv.status]}>
                        {statusLabel[inv.status]}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="py-12 text-center text-muted-foreground"
                    >
                      <FileText className="mx-auto mb-2 size-8" />
                      Aucune facture dans cet état.
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
