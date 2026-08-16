"use client";

import { useActionState } from "react";
import { CalendarPlus, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { addFollowUpAction } from "@/lib/actions/requests";

type FormState = { error?: string };

const initialState: FormState = {};

export function FollowUpForm({
  requestId,
  clientId,
}: {
  requestId?: number;
  clientId?: number;
}) {
  const target = { requestId, clientId };
  const [state, formAction, pending] = useActionState(
    async (_prev: FormState, fd: FormData): Promise<FormState> => {
      await addFollowUpAction(target, fd);
      return {};
    },
    initialState,
  );

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="note">Compte rendu</Label>
        <Textarea
          id="note"
          name="note"
          rows={3}
          placeholder="Contenu du suivi, échange avec le client..."
          required
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="nextAction">Prochaine action</Label>
          <Input
            id="nextAction"
            name="nextAction"
            placeholder="Ex : relancer pour le devis"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="dueDate">Échéance</Label>
          <Input id="dueDate" name="dueDate" type="date" />
        </div>
      </div>
      {state.error ? (
        <p className="text-sm text-destructive">{state.error}</p>
      ) : null}
      <Button type="submit" disabled={pending}>
        {pending ? <Loader2 className="animate-spin" /> : <CalendarPlus />}
        Ajouter le suivi
      </Button>
    </form>
  );
}
