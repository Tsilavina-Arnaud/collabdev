"use client";

import { useActionState, useState } from "react";
import { Banknote, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { registerPaymentAction } from "@/lib/actions/invoices";

type FormState = { error?: string };

const initialState: FormState = {};

export function PaymentForm({
  invoiceId,
  remaining,
  total,
}: {
  invoiceId: number;
  remaining: number;
  total: number;
}) {
  const [state, formAction, pending] = useActionState(
    (_prev: FormState, fd: FormData) => registerPaymentAction(invoiceId, fd),
    initialState,
  );
  const [method, setMethod] = useState("CARTE_BANCAIRE");
  const [plan, setPlan] = useState("PAIEMENT_COMPLET");

  const installments =
    plan === "PAIEMENT_3_FOIS" ? 3 : plan === "PAIEMENT_2_FOIS" ? 2 : 1;

  return (
    <div className="rounded-lg border border-border p-3">
      <p className="mb-3 text-sm font-medium">Enregistrer un paiement</p>
      <form
        action={(fd) => {
          fd.set("method", method);
          fd.set("plan", plan);
          return formAction(fd);
        }}
        className="space-y-3"
      >
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1.5">
            <Label htmlFor="amountPaid" className="text-xs">
              Montant reçu
            </Label>
            <Input
              id="amountPaid"
              name="amountPaid"
              type="number"
              step="0.01"
              min="0"
              max={total}
              defaultValue={remaining}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="paymentDate" className="text-xs">
              Date
            </Label>
            <Input
              id="paymentDate"
              name="paymentDate"
              type="date"
              defaultValue={new Date().toISOString().slice(0, 10)}
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Mode de paiement</Label>
          <Select value={method} onValueChange={(v) => setMethod(v ?? "CARTE_BANCAIRE")}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="CARTE_BANCAIRE">Carte bancaire</SelectItem>
              <SelectItem value="VIREMENT">Virement</SelectItem>
              <SelectItem value="ESPECES">Espèces</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Plan de paiement</Label>
          <Select value={plan} onValueChange={(v) => setPlan(v ?? "PAIEMENT_COMPLET")}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PAIEMENT_COMPLET">Paiement complet</SelectItem>
              <SelectItem value="PAIEMENT_2_FOIS">Paiement en 2 fois</SelectItem>
              <SelectItem value="PAIEMENT_3_FOIS">Paiement en 3 fois</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1.5">
            <Label htmlFor="currentNumber" className="text-xs">
              Paiement n°
            </Label>
            <Input
              id="currentNumber"
              name="currentNumber"
              type="number"
              min={1}
              max={installments}
              defaultValue={1}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Nombre d'échéances</Label>
            <Input value={`${installments}`} readOnly />
          </div>
        </div>
        {state.error ? (
          <p className="text-sm text-destructive">{state.error}</p>
        ) : null}
        <Button type="submit" size="sm" className="w-full" disabled={pending}>
          {pending ? <Loader2 className="animate-spin" /> : <Banknote />}
          Enregistrer le paiement
        </Button>
      </form>
    </div>
  );
}
