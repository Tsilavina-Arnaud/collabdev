"use client";

import { useActionState } from "react";
import { Loader2, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { ClientFormState } from "@/lib/actions/clients";

type ClientValues = {
  name?: string;
  company?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
};

export function ClientForm({
  action,
  defaults,
  submitLabel = "Enregistrer",
}: {
  action: (
    prev: ClientFormState,
    formData: FormData,
  ) => Promise<ClientFormState>;
  defaults?: ClientValues;
  submitLabel?: string;
}) {
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nom complet</Label>
        <Input
          id="name"
          name="name"
          defaultValue={defaults?.name}
          placeholder="Jean Dupont"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="company">Société</Label>
        <Input
          id="company"
          name="company"
          defaultValue={defaults?.company ?? ""}
          placeholder="Société, association, organisation"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            defaultValue={defaults?.email ?? ""}
            placeholder="client@exemple.fr"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Téléphone</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            defaultValue={defaults?.phone ?? ""}
            placeholder="06 12 34 56 78"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="address">Adresse</Label>
        <Textarea
          id="address"
          name="address"
          rows={2}
          defaultValue={defaults?.address ?? ""}
          placeholder="Adresse de facturation"
        />
      </div>
      {state.error ? (
        <p className="text-sm text-destructive">{state.error}</p>
      ) : null}
      <div className="flex justify-end">
        <Button type="submit" disabled={pending}>
          {pending ? <Loader2 className="animate-spin" /> : <Save />}
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
