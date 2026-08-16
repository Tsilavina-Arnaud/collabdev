import Link from "next/link";
import { Plus, Search, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Clients" };

const filters = [
  { value: "", label: "Tous" },
  { value: "societe", label: "Sociétés" },
  { value: "particulier", label: "Particuliers" },
  { value: "avec_factures", label: "Avec factures" },
  { value: "sans_facture", label: "Sans facture" },
];

export default async function ClientsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; filtre?: string }>;
}) {
  const { q = "", filtre = "" } = await searchParams;

  const clients = await prisma.client.findMany({
    where: {
      ...(q
        ? {
            OR: [
              { name: { contains: q, mode: "insensitive" as const } },
              { company: { contains: q, mode: "insensitive" as const } },
              { email: { contains: q, mode: "insensitive" as const } },
            ],
          }
        : {}),
      ...(filtre === "societe" ? { company: { not: null } } : {}),
      ...(filtre === "particulier" ? { company: null } : {}),
      ...(filtre === "avec_factures" ? { invoices: { some: {} } } : {}),
      ...(filtre === "sans_facture" ? { invoices: { none: {} } } : {}),
    },
    include: {
      _count: { select: { invoices: true, requests: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const total = await prisma.client.count();
  const societes = await prisma.client.count({
    where: { company: { not: null } },
  });
  const avecFactures = await prisma.client.count({
    where: { invoices: { some: {} } },
  });

  const filterCount = (value: string): number => {
    switch (value) {
      case "societe":
        return societes;
      case "particulier":
        return total - societes;
      case "avec_factures":
        return avecFactures;
      case "sans_facture":
        return total - avecFactures;
      default:
        return total;
    }
  };

  const filterHref = (filter: string) => {
    const params = new URLSearchParams();
    if (filter) params.set("filtre", filter);
    if (q) params.set("q", q);
    const s = params.toString();
    return s ? `/admin/clients?${s}` : "/admin/clients";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-medium tracking-tight">Clients</h1>
          <p className="text-sm text-muted-foreground">
            Tous les clients de l'agence.
          </p>
        </div>
        <Button
          nativeButton={false} render={<Link href="/admin/clients/new" />}>
          <Plus />
          Nouveau client
        </Button>
      </div>

      <div className="space-y-3">
        <form method="get" action="/admin/clients" className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              name="q"
              defaultValue={q}
              placeholder="Rechercher un nom, une société ou un email..."
              className="pl-8"
            />
            <input type="hidden" name="filtre" value={filtre} />
          </div>
          <Button type="submit" variant="outline">
            <Search />
            Rechercher
          </Button>
          {q || filtre ? (
            <Button
              nativeButton={false} render={<Link href="/admin/clients" />} variant="ghost">
              Effacer
            </Button>
          ) : null}
        </form>

        <div className="flex flex-wrap items-center gap-2">
          {filters.map((f) => {
            const active = f.value === filtre;
            return (
              <Button
                key={f.value}
                nativeButton={false}
                render={<Link href={filterHref(f.value)} />}
                variant={active ? "default" : "outline"}
                size="sm"
              >
                {f.label} ({filterCount(f.value)})
              </Button>
            );
          })}
        </div>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Factures</TableHead>
              <TableHead>Demandes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.map((client) => (
              <TableRow key={client.id}>
                <TableCell>
                  <div className="font-medium">{client.name}</div>
                  {client.company ? (
                    <div className="text-sm text-muted-foreground">
                      {client.company}
                    </div>
                  ) : null}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  <div>{client.email ?? "—"}</div>
                  <div>{client.phone ?? ""}</div>
                </TableCell>
                <TableCell>{client._count.invoices}</TableCell>
                <TableCell>{client._count.requests}</TableCell>
                <TableCell className="text-right">
                  <Button
                    nativeButton={false} render={<Link href={`/admin/clients/${client.id}/edit`} />} variant="ghost" size="sm">
                    Détail
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {clients.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="py-12 text-center text-muted-foreground"
                >
                  <Users className="mx-auto mb-2 size-8" />
                  {total === 0
                    ? "Aucun client pour le moment."
                    : "Aucun client ne correspond à votre recherche."}
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
