import Link from "next/link";
import { notFound } from "next/navigation";

import { FollowUpForm } from "@/components/admin/followup-form";
import { RequestActions } from "@/components/admin/request-actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { formatDateTime } from "@/lib/format";

export const metadata = { title: "Demande" };

export default async function RequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const request = await prisma.request.findUnique({
    where: { id: Number(id) },
    include: {
      service: true,
      client: true,
      followUps: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!request) notFound();

  const clients = await prisma.client.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-medium tracking-tight">{request.name}</h1>
          <p className="text-sm text-muted-foreground">
            Reçue le {formatDateTime(request.createdAt)}
          </p>
        </div>
        <Button
              nativeButton={false} render={<Link href="/admin/requests" />} variant="outline">
          Retour
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Détails de la demande</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="grid gap-2 sm:grid-cols-2">
                <div>
                  <p className="text-muted-foreground">Email</p>
                  <p>{request.email ?? "—"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Téléphone</p>
                  <p>{request.phone ?? "—"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Type</p>
                  <p>
                    {request.type === "DEVIS"
                      ? "Demande de devis"
                      : request.type === "RENDEZ_VOUS"
                        ? "Rendez-vous"
                        : "Contact"}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Service concerné</p>
                  <p>{request.service?.name ?? "—"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Client lié</p>
                  <p>
                    {request.client ? (
                      <Link
                        href={`/admin/clients/${request.client.id}/edit`}
                        className="font-medium hover:underline"
                      >
                        {request.client.name}
                      </Link>
                    ) : (
                      "—"
                    )}
                  </p>
                </div>
              </div>
              {request.message ? (
                <div className="rounded-lg border border-border p-3">
                  <p className="mb-1 text-xs font-medium text-muted-foreground">
                    Message
                  </p>
                  <p className="whitespace-pre-wrap">{request.message}</p>
                </div>
              ) : null}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Gestion</CardTitle>
              <CardDescription>
                Statut, conversion en client et association.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RequestActions
                requestId={request.id}
                status={request.status}
                clientId={request.clientId}
                clients={clients}
              />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Ajouter un suivi</CardTitle>
            </CardHeader>
            <CardContent>
              <FollowUpForm requestId={request.id} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Historique de suivi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {request.followUps.map((f) => (
                <div key={f.id} className="rounded-lg border border-border p-3">
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant="outline">{formatDateTime(f.createdAt)}</Badge>
                    {f.dueDate ? (
                      <span className="text-xs text-muted-foreground">
                        Échéance : {formatDateTime(f.dueDate)}
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
              {request.followUps.length === 0 ? (
                <p className="py-4 text-center text-sm text-muted-foreground">
                  Aucun suivi enregistré.
                </p>
              ) : null}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
