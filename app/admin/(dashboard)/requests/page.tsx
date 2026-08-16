import Link from "next/link";
import { Eye, Inbox } from "lucide-react";

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
import { formatDateTime } from "@/lib/format";

const statuses = ["NOUVEAU", "EN_COURS", "TRAITE", "CONVERTI", "REFUSE"] as const;

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

export const metadata = { title: "Demandes" };

export default async function RequestsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;
  const activeTab =
    tab === "ALL" || statuses.includes(tab as never) ? (tab as string) : "NOUVEAU";

  const requests = await prisma.request.findMany({
    include: { service: true, client: true },
    orderBy: { createdAt: "desc" },
  });

  const counts = statuses.reduce<Record<string, number>>((acc, s) => {
    acc[s] = 0;
    return acc;
  }, {});
  for (const r of requests) {
    counts[r.status] = (counts[r.status] ?? 0) + 1;
  }

  const filtered =
    activeTab === "ALL"
      ? requests
      : requests.filter((r) => r.status === activeTab);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-medium tracking-tight">Demandes</h1>
        <p className="text-sm text-muted-foreground">
          Demandes reçues via le site et suivi commercial.
        </p>
      </div>

      <Tabs value={activeTab}>
        <TabsList className="flex-wrap">
          <TabsTrigger value="ALL" nativeButton={false} render={<Link href="/admin/requests" />}>
            Toutes ({requests.length})
          </TabsTrigger>
          {statuses.map((s) => (
            <TabsTrigger
              key={s}
              value={s}
              nativeButton={false}
              render={<Link href={`/admin/requests?tab=${s}`} />}
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
                  <TableHead>Client</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Reçue le</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="w-12">
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>
                      <Link
                        href={`/admin/requests/${r.id}`}
                        className="font-medium hover:underline"
                      >
                        {r.name}
                      </Link>
                      <div className="text-xs text-muted-foreground">
                        {r.email}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {r.type === "DEVIS"
                        ? "Devis"
                        : r.type === "RENDEZ_VOUS"
                          ? "Rendez-vous"
                          : "Contact"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {r.service?.name ?? "—"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDateTime(r.createdAt)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusVariant[r.status]}>
                        {statusLabel[r.status]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Voir la demande de ${r.name}`}
                        nativeButton={false}
                        render={<Link href={`/admin/requests/${r.id}`} />}
                      >
                        <Eye />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="py-12 text-center text-muted-foreground"
                    >
                      <Inbox className="mx-auto mb-2 size-8" />
                      Aucune demande dans cet état.
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
