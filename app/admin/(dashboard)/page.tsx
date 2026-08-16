import Link from "next/link";
import {
  CircleDollarSign,
  Clock,
  Inbox,
  TrendingUp,
  Users,
} from "lucide-react";

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
import { formatCurrency } from "@/lib/format";

const statusLabel: Record<string, string> = {
  NOUVEAU: "Nouveau",
  EN_COURS: "En cours",
  TRAITE: "Traité",
  CONVERTI: "Converti",
  REFUSE: "Refusé",
};

const statusVariant: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  NOUVEAU: "default",
  EN_COURS: "secondary",
  TRAITE: "outline",
  CONVERTI: "default",
  REFUSE: "destructive",
};

const invoiceStatusLabel: Record<string, string> = {
  EN_ATTENTE: "En attente",
  PAYEE: "Payée",
  ANNULEE: "Annulée",
};

export const metadata = { title: "Tableau de bord" };

export default async function AdminDashboard() {
  const [
    clientCount,
    requestCount,
    newRequestCount,
    invoices,
    recentRequests,
  ] = await Promise.all([
    prisma.client.count(),
    prisma.request.count(),
    prisma.request.count({ where: { status: "NOUVEAU" } }),
    prisma.invoice.findMany({
      include: { client: true, payments: true },
      orderBy: { date: "desc" },
    }),
    prisma.request.findMany({
      include: { service: true },
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
  ]);

  const paidTotal = invoices
    .filter((i) => i.status === "PAYEE")
    .reduce((sum, i) => sum + Number(i.totalAmount), 0);
  const pendingTotal = invoices
    .filter((i) => i.status === "EN_ATTENTE")
    .reduce((sum, i) => sum + Number(i.totalAmount), 0);
  const paidCount = invoices.filter((i) => i.status === "PAYEE").length;

  const last6Months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setDate(1);
    d.setMonth(d.getMonth() - (5 - i));
    return d;
  });

  const monthlyData = last6Months.map((month) => {
    const key = `${month.getFullYear()}-${month.getMonth()}`;
    const total = invoices
      .filter((i) => {
        if (i.status !== "PAYEE") return false;
        const d = new Date(i.date);
        return `${d.getFullYear()}-${d.getMonth()}` === key;
      })
      .reduce((sum, i) => sum + Number(i.totalAmount), 0);
    return {
      month: month.toLocaleDateString("fr-FR", {
        month: "short",
      }),
      total,
    };
  });

  const recentInvoices = invoices.slice(0, 6);

  const stats = [
    {
      label: "Chiffre d'affaire",
      value: formatCurrency(paidTotal),
      sub: `${paidCount} facture(s) payée(s)`,
      icon: TrendingUp,
    },
    {
      label: "En attente de paiement",
      value: formatCurrency(pendingTotal),
      sub: "Factures non réglées",
      icon: Clock,
    },
    {
      label: "Clients",
      value: String(clientCount),
      sub: "Clients enregistrés",
      icon: Users,
    },
    {
      label: "Demandes",
      value: String(requestCount),
      sub: `${newRequestCount} nouvelle(s) en attente`,
      icon: Inbox,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-medium tracking-tight">
            Tableau de bord
          </h1>
          <p className="text-sm text-muted-foreground">
            Vue d'ensemble de l'activité CollabDev.
          </p>
        </div>
        <Button
              nativeButton={false} render={<Link href="/admin/invoices/new" />}>
          <CircleDollarSign />
          Nouvelle facture
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader>
              <CardDescription className="flex items-center gap-2">
                <stat.icon className="size-4" />
                {stat.label}
              </CardDescription>
              <CardTitle className="text-2xl font-medium tracking-tight">
                {stat.value}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">{stat.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Chiffre d'affaire sur 6 mois</CardTitle>
          <CardDescription>
            Factures payées par mois.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-64 items-end gap-4">
            {monthlyData.map((m) => {
              const max = Math.max(...monthlyData.map((x) => x.total), 1);
              const height = m.total === 0 ? 2 : Math.max((m.total / max) * 100, 4);
              return (
                <div
                  key={m.month}
                  className="flex h-full flex-1 flex-col items-center justify-end gap-2"
                >
                  <span className="text-xs font-medium text-muted-foreground">
                    {m.total === 0 ? "" : `${m.total} €`}
                  </span>
                  <div
                    className="w-full rounded-t-md bg-primary"
                    style={{ height: `${height}%` }}
                  />
                  <span className="text-xs capitalize text-muted-foreground">
                    {m.month}
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Dernières demandes</CardTitle>
            <CardDescription>
              Les dernières demandes reçues sur le site.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentRequests.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>
                      <Link
                        href={`/admin/requests/${r.id}`}
                        className="font-medium hover:underline"
                      >
                        {r.name}
                      </Link>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {r.service?.name ?? "—"}
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusVariant[r.status]}>
                        {statusLabel[r.status]}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
                {recentRequests.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="py-8 text-center text-muted-foreground"
                    >
                      Aucune demande pour le moment.
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dernières factures</CardTitle>
            <CardDescription>
              Les dernières factures émises.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Référence</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead>Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentInvoices.map((inv) => (
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
                    <TableCell>{formatCurrency(inv.totalAmount)}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          inv.status === "PAYEE"
                            ? "default"
                            : inv.status === "ANNULEE"
                              ? "destructive"
                              : "secondary"
                        }
                      >
                        {invoiceStatusLabel[inv.status]}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
                {recentInvoices.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="py-8 text-center text-muted-foreground"
                    >
                      Aucune facture pour le moment.
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
