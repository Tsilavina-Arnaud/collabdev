import Link from "next/link";
import { CalendarClock } from "lucide-react";

import { Badge } from "@/components/ui/badge";
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
import { formatDate } from "@/lib/format";
import { FollowUpStatusToggle } from "@/components/admin/followup-status-toggle";

const statuses = ["A_FAIRE", "EN_COURS", "TERMINE"] as const;

const statusLabel: Record<string, string> = {
  A_FAIRE: "À faire",
  EN_COURS: "En cours",
  TERMINE: "Terminé",
};

export const metadata = { title: "Suivi" };

export default async function FollowUpsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;
  const activeTab =
    tab === "ALL" || statuses.includes(tab as never) ? (tab as string) : "A_FAIRE";

  const followUps = await prisma.followUp.findMany({
    include: { request: true, client: true },
    orderBy: [{ status: "asc" }, { dueDate: "asc" }],
  });

  const counts = statuses.reduce<Record<string, number>>((acc, s) => {
    acc[s] = 0;
    return acc;
  }, {});
  for (const f of followUps) {
    counts[f.status] = (counts[f.status] ?? 0) + 1;
  }

  const filtered =
    activeTab === "ALL"
      ? followUps
      : followUps.filter((f) => f.status === activeTab);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-medium tracking-tight">Suivi</h1>
        <p className="text-sm text-muted-foreground">
          Actions et relances liées aux demandes et aux clients.
        </p>
      </div>

      <Tabs value={activeTab}>
        <TabsList>
          <TabsTrigger value="ALL" nativeButton={false} render={<Link href="/admin/followups" />}>
            Toutes ({followUps.length})
          </TabsTrigger>
          {statuses.map((s) => (
            <TabsTrigger
              key={s}
              value={s}
              nativeButton={false}
              render={<Link href={`/admin/followups?tab=${s}`} />}
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
                  <TableHead>Lien</TableHead>
                  <TableHead>Note</TableHead>
                  <TableHead>Prochaine action</TableHead>
                  <TableHead>Échéance</TableHead>
                  <TableHead>Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((f) => {
                  const href = f.requestId
                    ? `/admin/requests/${f.requestId}`
                    : f.clientId
                      ? `/admin/clients/${f.clientId}/edit`
                      : null;
                  return (
                    <TableRow key={f.id}>
                      <TableCell>
                        {href ? (
                          <Link
                            href={href}
                            className="font-medium hover:underline"
                          >
                            {f.client?.name ?? f.request?.name ?? "—"}
                          </Link>
                        ) : (
                          "—"
                        )}
                        <div className="text-xs text-muted-foreground">
                          {f.request
                            ? "Demande"
                            : f.client
                              ? "Client"
                              : ""}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs truncate text-sm text-muted-foreground">
                        {f.note}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {f.nextAction ?? "—"}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {f.dueDate ? formatDate(f.dueDate) : "—"}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{statusLabel[f.status]}</Badge>
                          <FollowUpStatusToggle
                            id={f.id}
                            status={f.status}
                            next={f.status === "A_FAIRE" ? "EN_COURS" : f.status === "EN_COURS" ? "TERMINE" : "A_FAIRE"}
                            label={f.status === "TERMINE" ? "Rouvrir" : "Avancer"}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="py-12 text-center text-muted-foreground"
                    >
                      <CalendarClock className="mx-auto mb-2 size-8" />
                      Aucun suivi dans cet état.
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
