"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Link2, Loader2, RefreshCcw, UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  convertRequestToClientAction,
  linkRequestToClientAction,
  updateRequestStatusAction,
} from "@/lib/actions/requests";

type ClientOption = { id: number; name: string };

const statuses = ["NOUVEAU", "EN_COURS", "TRAITE", "CONVERTI", "REFUSE"] as const;

const statusLabels: Record<string, string> = {
  NOUVEAU: "Nouveau",
  EN_COURS: "En cours",
  TRAITE: "Traité",
  CONVERTI: "Converti",
  REFUSE: "Refusé",
};

export function RequestActions({
  requestId,
  status,
  clientId,
  clients,
}: {
  requestId: number;
  status: string;
  clientId: number | null;
  clients: ClientOption[];
}) {
  const router = useRouter();
  const [pendingStatus, setPendingStatus] = useState<string | null>(null);
  const [selectedClient, setSelectedClient] = useState(
    clientId ? String(clientId) : "",
  );
  const [pendingConvert, setPendingConvert] = useState(false);
  const [pendingLink, setPendingLink] = useState(false);

  async function changeStatus(next: string) {
    if (next === status) return;
    setPendingStatus(next);
    await updateRequestStatusAction(requestId, next);
    router.refresh();
    setPendingStatus(null);
  }

  async function convert() {
    setPendingConvert(true);
    await convertRequestToClientAction(requestId);
    router.refresh();
    setPendingConvert(false);
  }

  async function link() {
    if (!selectedClient) return;
    setPendingLink(true);
    await linkRequestToClientAction(requestId, Number(selectedClient));
    router.refresh();
    setPendingLink(false);
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">Statut :</span>
          {statuses.map((s) => (
            <Button
              key={s}
              variant={status === s ? "default" : "outline"}
              size="sm"
              disabled={pendingStatus !== null}
              onClick={() => changeStatus(s)}
            >
              {pendingStatus === s ? (
                <Loader2 className="animate-spin" />
              ) : null}
              {statusLabels[s]}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-2 rounded-lg border border-border p-3">
        <p className="text-sm font-medium">Lier à un client</p>
        <div className="flex flex-col gap-2 sm:flex-row">
          {clientId ? (
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <Link2 className="size-4" />
              Demandé lié à un client existant.
            </p>
          ) : (
            <>
              <Select value={selectedClient} onValueChange={(v) => setSelectedClient(v ?? "")}>
                <SelectTrigger className="sm:flex-1">
                  <SelectValue placeholder="Choisir un client existant" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((c) => (
                    <SelectItem key={c.id} value={String(c.id)}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="sm"
                disabled={!selectedClient || pendingLink}
                onClick={link}
              >
                {pendingLink ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Link2 />
                )}
                Lier
              </Button>
            </>
          )}
        </div>
        {!clientId ? (
          <Button
            variant="outline"
            size="sm"
            disabled={pendingConvert}
            onClick={convert}
          >
            {pendingConvert ? <Loader2 className="animate-spin" /> : <UserPlus />}
            Créer un client depuis cette demande
          </Button>
        ) : null}
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.refresh()}
      >
        <RefreshCcw />
        Actualiser
      </Button>
    </div>
  );
}
