"use client";

import { useActionState } from "react";
import { Loader2, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateCompanyInfoAction } from "@/lib/actions/settings";

type CompanyValues = {
  name: string;
  legalName: string;
  representative: string;
  representativeRole: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  taxId: string;
  iban: string;
  bic: string;
  currency: string;
};

type FormState = { error?: string };

const initialState: FormState = {};

export function CompanySettingsForm({ defaults }: { defaults: CompanyValues }) {
  const [state, formAction, pending] = useActionState(
    (_prev: FormState, fd: FormData) => updateCompanyInfoAction(fd),
    initialState,
  );

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Nom du collectif</Label>
          <Input id="name" name="name" defaultValue={defaults.name} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="legalName">Dénomination</Label>
          <Input
            id="legalName"
            name="legalName"
            defaultValue={defaults.legalName}
          />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="representative">Personne responsable</Label>
          <Input
            id="representative"
            name="representative"
            defaultValue={defaults.representative}
            placeholder="Camille Rousseau"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="representativeRole">Fonction</Label>
          <Input
            id="representativeRole"
            name="representativeRole"
            defaultValue={defaults.representativeRole}
            placeholder="Responsable administration & facturation"
          />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="taxId">Numéro d'identification (ENI/SIREN)</Label>
          <Input id="taxId" name="taxId" defaultValue={defaults.taxId} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Téléphone</Label>
          <Input id="phone" name="phone" defaultValue={defaults.phone} />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            defaultValue={defaults.email}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="website">Site web</Label>
          <Input id="website" name="website" defaultValue={defaults.website} />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="currency">Devise</Label>
          <Input id="currency" name="currency" defaultValue={defaults.currency} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="address">Adresse</Label>
          <Input id="address" name="address" defaultValue={defaults.address} />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="iban">IBAN</Label>
        <Input
          id="iban"
          name="iban"
          defaultValue={defaults.iban}
          placeholder="FR76 XXXX XXXX XXXX XXXX XXXX XXX"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="bic">BIC</Label>
        <Input
          id="bic"
          name="bic"
          defaultValue={defaults.bic}
          placeholder="XXXXXXXX"
        />
      </div>
      {state.error ? (
        <p className="text-sm text-destructive">{state.error}</p>
      ) : null}
      <div className="flex justify-end">
        <Button type="submit" disabled={pending}>
          {pending ? <Loader2 className="animate-spin" /> : <Save />}
          Enregistrer
        </Button>
      </div>
    </form>
  );
}
